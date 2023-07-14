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
  const jsonPath = path.resolve(originalPath, 'FastDeployTemplates', 'fast_deploy_template.json');
  const handlePath = process.env.TEMPLATE_REPO_PATH || 'dev-template';

  try {
    if (fs.existsSync(jsonPath)) {
      const jsonData = fs.readFileSync(jsonPath, 'utf8');
      const objects = JSON.parse(jsonData);
      return jsonRes(res, { data: objects, code: 200 });
    }

    function readFileList(targetPath: string, fileList: unknown[] = []) {
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
    }

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

    jsonRes(res, { data: jsonObjArr, code: 200 });
  } catch (error) {
    console.log(error);
    jsonRes(res, { code: 500, data: 'error' });
  }
}
