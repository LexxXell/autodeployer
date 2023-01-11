require('dotenv').config();
const path = require('node:path');
const config = require('../config.json');
const { exec } = require('node:child_process');
const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

app.post('/', (request, _) => {
  try {
    const repositoryName = request.body.repository.full_name;
    const branch = request.body.ref.split('/').pop();
    if (
      !Object.keys(config).includes(repositoryName) ||
      config[repositoryName].branch !== branch
    ) {
      return false;
    }
    console.log(new Date(), 'Github repository updated.');
    return execHookSh();
  } catch (error) {
    console.err(error);
    return false;
  }
});

function execHookSh(repositoryConfig) {
  if(!repositoryConfig.hook_path) {
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