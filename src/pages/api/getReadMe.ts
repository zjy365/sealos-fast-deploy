import { jsonRes } from '@/services/backend/response';
import { ApiResp } from '@/services/kubernet';
import { GET } from '@/services/request';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from 'octokit';

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResp>) {
  try {
    const octokit = new Octokit({
      auth: ''
    });

    const result = await octokit.request('GET /repos/{owner}/{repo}/readme', {
      owner: 'appsmithorg',
      repo: 'appsmith'
    });

    const readme = Buffer.from(result.data.content, 'base64').toString('utf-8');

    jsonRes(res, { data: readme, code: 200 });
  } catch (error) {
    console.log(error);
    jsonRes(res, { code: 500, data: 'error' });
  }
}
