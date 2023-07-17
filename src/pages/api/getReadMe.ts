import { jsonRes } from '@/services/backend/response';
import { ApiResp } from '@/services/kubernet';
import { GET } from '@/services/request';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from 'octokit';

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResp>) {
  try {
    const { url } = req.body;
    console.log(url);
    return jsonRes(res, { data: 'sad', code: 200 });
  } catch (error) {
    console.log(error);
    jsonRes(res, { code: 500, data: 'error' });
  }
}
