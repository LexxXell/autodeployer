const { logger } = require('./helpers');

module.exports = (repositoryName, repositoryConfig) => {
  if (!repositoryConfig.hook_path) {
    logger('No shell-script to execution...')
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