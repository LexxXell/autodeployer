require('dotenv').config();

const fs = require('fs');
const path = require('node:path');
const config = require('../config.json');
const { exec } = require('node:child_process');
const { logger } = require('./helpers');
const githubEventListener = require('./github-event-listener');

githubEventListener.onPushCallback = (data) => {
  try {
    const repositoryName = data.repository.full_name;
    const branch = data.ref ? data.ref.split('/').pop() : undefined;
    if (
      !Object.keys(config).includes(repositoryName) ||
      config[repositoryName].branch !== branch
    ) {
      return false;
    }
    logger(`Updated github repository: ${repositoryName} #${branch}`);
    return execHook(repositoryName);
  } catch (error) {
    logger(error);
    return false;
  }
}

function execHook(repositoryName) {
  const repositoryConfig = config[repositoryName];
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
          path.resolve(
            repositoryConfig.log_dir_path,
            `${repositoryName.replace('/', '.')}_stdout.log`
          ),
          `${new Date()}\n${stdout}\n`,
        );
        fs.writeFileSync(
          path.resolve(
            repositoryConfig.log_dir_path,
            `${repositoryName.replace('/', '.')}_stderr.log`
          ),
          `${new Date()}\n${stderr}\n`,
        )
      }
    });
}
