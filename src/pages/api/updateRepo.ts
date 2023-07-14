import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResp } from '@/services/kubernet';
import { jsonRes } from '@/services/backend/response';
import { execSync } from 'child_process';
import { clone } from 'isomorphic-git';
// node.js example
const path = require('path');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResp>) {
  try {
    const dir = path.join(process.cwd(), 'test-clone');
    git
      .clone({
        fs,
        http,
        dir,
        url: 'https://github.com/isomorphic-git/lightning-fs',
        timeout: 30000
      })
      .then(console.log);

    jsonRes(res, { data: 'update repo', code: 200 });
  } catch (err: any) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
