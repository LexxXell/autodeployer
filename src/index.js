require('dotenv').config();

const { logger, configConverter } = require('./helpers');
const config = configConverter(require('../config.json'));

const hookExecutor = require('./hook-executor');
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
    return hookExecutor(repositoryName, config[repositoryName]);
  } catch (error) {
    logger(error);
    return false;
  }
};
