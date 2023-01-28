const path = require('path');
const fs = require('fs');
const logger = require('./logger.helper');

function toAbsolute(filePath) {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(
      'Unable to convert relative path to absolute!\n' + filePath
    );
  }
  logger(
    'INFO: The config contains a relative path, it is converted to absolute, make sure the conversion is correct:'
  );
  logger(`└╴${filePath}`);
  logger(`  └╴${absolutePath}`);
  return absolutePath;
}

module.exports = (config) => {
  try {
    if (Array.isArray(config)) {
      const result = {};
      config.forEach((el) => {
        const { full_name, ...repositoryConfig } = el;
        result[full_name] = repositoryConfig;
      });
      config = result;
    } else if (typeof config !== 'object') {
      throw Error();
    }
  } catch {
    throw new Error('Unknown config...');
  }
  for (full_name of Object.keys(config)) {
    if (!path.isAbsolute(config[full_name].hook_path)) {
      config[full_name].hook_path = toAbsolute(config[full_name].hook_path);
    }
    if (!path.isAbsolute(config[full_name].project_path)) {
      config[full_name].project_path = toAbsolute(
        config[full_name].project_path
      );
    }
    if (!path.isAbsolute(config[full_name].log_dir_path)) {
      config[full_name].log_dir_path = toAbsolute(
        config[full_name].log_dir_path
      );
    }
  }
  return config;
};
