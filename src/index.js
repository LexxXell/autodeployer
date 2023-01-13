require('dotenv').config();

const fs = require('fs');
const path = require('node:path');
const config = require('../config.json');
const { exec } = require('node:child_process');
const { logger } = require('./helpers');

const githubEventListener = require('./github-event-listener');
const hookExecutor = require('./hook-executor');

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
}

