module.exports = (config) => {
  try {
    if (Array.isArray(config)) {
      const result = {};
      config.forEach((el) => {
        const { full_name, ...repositoryConfig } = el;
        result[full_name] = repositoryConfig;
      });
      return result;
    } else if (typeof config === 'object') {
      return config;
    }
    throw Error;
  } catch {
    throw new Error('Unknown config...');
  }
}