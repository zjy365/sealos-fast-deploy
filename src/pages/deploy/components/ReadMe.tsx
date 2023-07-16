import MyIcon from '@/components/Icon';
import MarkDown from '@/components/markdown';
import { GET } from '@/services/request';
import { TemplateType } from '@/types/app';
import { Box, useTheme } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Octokit } from 'octokit';
import { useEffect } from 'react';
import 'github-markdown-css/github-markdown-light.css';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const ReadMe = ({ templateDetail }: { templateDetail: TemplateType }) => {
  const octokit = new Octokit({
    auth: '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'
  });
  const { data } = useQuery(['getReadMe'], () =>
    octokit.request('GET /repos/{owner}/{repo}/readme', {
      owner: 'appsmithorg',
      repo: 'appsmith'
    })
  );

  let readme = '';
  if (data?.data?.content) {
    readme = Buffer.from(data?.data?.content || '', 'base64').toString('utf-8');
  }

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
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{readme}</ReactMarkdown>
      </Box>
    </Box>
  );
};

export default ReadMe;
