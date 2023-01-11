require('dotenv').config();
const path = require('node:path');
const config = require('../config.json');
const { exec } = require('node:child_process');
const fs = require('fs');
const express = require('express');
const { httpCode } = require('./enum')

const app = express();
app.use(express.json());

app.post('/', (request, response) => {
  try {
    const repositoryName = request.body.repository.full_name;
    const branch = request.body.ref
      ? request.body.ref.split('/').pop()
      : undefined;
    if (
      !Object.keys(config).includes(repositoryName) ||
      config[repositoryName].branch !== branch
    ) {
      response.status(httpCode.NOT_FOUND);
      response.json({ status: httpCode.NOT_FOUND });
      return false;
    }
    console.log(new Date(), `Updated github repository: ${repositoryName}`);
    execHook(config[repositoryName]);
    response.status(httpCode.OK);
    response.json({ status: httpCode.OK });
    return true;
  } catch (error) {
    console.error(error);
    response.status(httpCode.INTERNAL_SERVER_ERROR);
    response.json({ status: httpCode.INTERNAL_SERVER_ERROR });
    return false;
  }
});

function execHook(repositoryConfig) {
  if (!repositoryConfig.hook_path) {
    return false;
  }
  return exec(repositoryConfig.hook_path,
    {
      env: {
        ...process.env,
        PROJECT_PATH: repositoryConfig.project_path,
        BRANCH: repositoryConfig.branch,
        CALLBACK: repositoryConfig.callback,
      }
    },
    (error, stdout, stderr) => {
      if (error) {
        throw new Error(error);
      }
      if (repositoryConfig.log_dir_path) {
        fs.writeFileSync(
          path.resolve(repositoryConfig.log_dir_path, 'stdout.log'),
          new Date() + '\n' + stdout + '\n',
        );
        fs.writeFileSync(
          path.resolve(repositoryConfig.log_dir_path, 'stderr.log'),
          new Date() + '\n' + stderr + '\n',
        );
      }
    });
}

app.listen(process.env.WEBHOOK_PORT || 9001);