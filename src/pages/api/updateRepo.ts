import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResp } from '@/services/kubernet';
import { jsonRes } from '@/services/backend/response';
import path from 'path';
import fs from 'fs';
import { simpleGit } from 'simple-git';
import JSYAML from 'js-yaml';

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResp>) {
  try {
    const repoUrl = 'git@github.com:a497625414/DelpoyOnSealosRepo.git';
    const originalPath = process.cwd();
    const targetPath = path.resolve(originalPath, 'FastDeployTemplates');
    const jsonPath = path.resolve(originalPath, 'fast_deploy_template.json');
    const handlePath = process.env.TEMPLATE_REPO_PATH || 'dev-template';

    if (fs.existsSync(targetPath)) {
      const result = await simpleGit().pull({ '--depth': 1 });
    } else {
      const result = simpleGit().clone(repoUrl, targetPath, {
        '--depth': 1
      });
    }

    const readFileList = (targetPath: string, fileList: unknown[] = []) => {
      const files = fs.readdirSync(targetPath);
      files.forEach((item) => {
        const filePath = path.join(targetPath, item);
        const stats = fs.statSync(filePath);
        if (stats.isFile() && path.extname(item) === '.yaml' && item !== 'template.yaml') {
          fileList.push(filePath);
        } else if (stats.isDirectory() && item === handlePath) {
          readFileList(filePath, fileList);
        }
      });
    };

    let fileList: unknown[] = [];
    readFileList(targetPath, fileList);

    let jsonObjArr: unknown[] = [];
    fileList.forEach((item: any) => {
      if (!item) return;
      const content = fs.readFileSync(item, 'utf-8');
      const yamlTemplate: any = JSYAML.loadAll(content)[0];
      jsonObjArr.push(yamlTemplate);
    });

    const jsonContent = JSON.stringify(jsonObjArr, null, 2);
    fs.writeFileSync(jsonPath, jsonContent, 'utf-8');

    jsonRes(res, { data: 'success clone template', code: 200 });
  } catch (err: any) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
