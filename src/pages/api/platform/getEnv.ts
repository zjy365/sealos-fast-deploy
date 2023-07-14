import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResp } from '@/services/kubernet';
import { jsonRes } from '@/services/backend/response';

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResp>) {
  try {
    jsonRes(res, {
      data: {
        SEALOS_CLOUD_DOMAIN: process.env.SEALOS_CLOUD_DOMAIN || 'cloud.sealos.io',
        SEALOS_Cert_Secret_Name: process.env.SEALOS_Cert_Secret_Name || 'wildcard-cert',
        TEMPLATE_REPO_PATH: process.env.TEMPLATE_REPO_PATH || 'dev-template'
      }
    });
  } catch (err: any) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
