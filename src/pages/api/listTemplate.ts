import { jsonRes } from '@/services/backend/response';
import { ApiResp } from '@/services/kubernet';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import JSYAML from 'js-yaml';

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResp>) {
  const repoUrl = 'git@github.com:a497625414/DelpoyOnSealosRepo.git';
  const originalPath = process.cwd();
  const targetPath = path.resolve(originalPath, 'FastDeployTemplates');
  const jsonPath = path.resolve(originalPath, 'fast_deploy_template.json');
  const handlePath = process.env.TEMPLATE_REPO_PATH || 'dev-template';

  try {
    if (fs.existsSync(jsonPath)) {
      const jsonData = fs.readFileSync(jsonPath, 'utf8');
      const objects = JSON.parse(jsonData);
      return jsonRes(res, { data: objects, code: 200 });
    } else {
      return jsonRes(res, { data: 'no template', code: 200 });
    }
  } catch (error) {
    console.log(error);
    jsonRes(res, { code: 500, data: 'error' });
  }
}
