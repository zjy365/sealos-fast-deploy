import MyIcon from '@/components/Icon';
import { GET, POST } from '@/services/request';
import { TemplateType } from '@/types/app';
import { Box, useTheme } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Octokit } from 'octokit';
import { useEffect, useState } from 'react';
import 'github-markdown-css/github-markdown-light.css';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const ReadMe = ({ templateDetail }: { templateDetail: TemplateType }) => {
  const [templateReadMe, setTemplateReadMe] = useState('');
  // const { data } = useQuery(
  //   ['getReadMe'],
  //   () => POST('/api/getReadMe', { url: templateDetail?.spec?.readme }),
  //   {
  //     enabled: !!templateDetail?.spec?.readme
  //   }
  // );

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
      <Box p={'24px'} className="markdown-body">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{templateReadMe}</ReactMarkdown>
      </Box>
    </Box>
  );
};

export default ReadMe;
