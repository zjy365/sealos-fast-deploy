import MyIcon from '@/components/Icon';
import { TemplateType } from '@/types/app';
import { Box } from '@chakra-ui/react';
import 'github-markdown-css/github-markdown-light.css';
import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';
import rehypeRewrite from 'rehype-rewrite';
import styles from './index.module.scss';

const ReadMe = ({ templateDetail }: { templateDetail: TemplateType }) => {
  const [templateReadMe, setTemplateReadMe] = useState('');

  const parseGithubUrl = (url: string) => {
    if (!url) return null;
    var urlObj = new URL(url);
    var pathParts = urlObj.pathname.split('/');
    return {
      organization: pathParts[1],
      repository: pathParts[2],
      branch: pathParts[3]
    };
  };

  const githubOptions = useMemo(
    () => parseGithubUrl(templateDetail?.spec?.readme),
    [templateDetail?.spec?.readme]
  );

  useEffect(() => {
    if (templateDetail?.spec?.readme) {
      (async () => {
        try {
          const res = await (await fetch(templateDetail?.spec?.readme)).text();
          setTemplateReadMe(res);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [templateDetail?.spec?.readme]);

  // @ts-ignore
  const myRewrite = (node, index, parent) => {
    if (node.tagName === 'img' && !node.properties.src.startsWith('http')) {
      node.properties.src = `https://raw.githubusercontent.com/${githubOptions?.organization}/${githubOptions?.repository}/${githubOptions?.branch}/${node.properties.src}`;
    }
  };

  return (
    <Box flexGrow={1} border={'1px solid #DEE0E2'} mt={'16px'}>
      <Box
        p={'16px 0'}
        borderBottom={'1px solid #DEE0E2'}
        color={'#24282C'}
        fontSize={'18px'}
        fontWeight={500}>
        <MyIcon name={'markdown'} mr={5} w={'24px'} h={'24px'} ml={'42px'} color={'myGray.500'} />
        README.md
      </Box>
      <Box p={'24px'} className={`markdown-body ${styles.customMarkDownBody}`}>
        <ReactMarkdown
          rehypePlugins={[rehypeRaw, [rehypeRewrite, { rewrite: myRewrite }]]}
          remarkPlugins={[remarkGfm, remarkUnwrapImages]}>
          {templateReadMe}
        </ReactMarkdown>
      </Box>
    </Box>
  );
};

export default ReadMe;
