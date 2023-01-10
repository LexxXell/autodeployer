require('dotenv').config();
const { exec } = require('node:child_process');
const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

app.post('/', (request, _) => {
  try {
    if (
      request.body.repository.full_name !== process.env.GITHUB_REPOSITORY ||
      request.body.ref.split('/').pop() !== process.env.TARGET_BRANCH
    ) {
      return false;
    };
    console.log(new Date(), 'Github repository updated.');
    return execHookSh();
  } catch (error) {
    console.err(error);
    return false;
  }
});

function execHookSh() {
  if (!process.env.HOOK_SH_PATH) {
    return false;
  }
  return exec(process.env.HOOK_SH_PATH, (error, stdout, stderr) => {
    if (error) {
      throw new Error(error);
    }
    if (process.env.LOG_STDOUT_PATH) {
      fs.writeFileSync(
        process.env.LOG_STDOUT_PATH,
        new Date() + '\n' + stdout + '\n',
      );
    }
    if (process.env.LOG_STDERR_PATH) {
      fs.writeFileSync(
        process.env.LOG_STDERR_PATH,
        new Date() + '\n' + stderr + '\n',
      );
    }
  });
}

app.listen(process.env.GITHUB_WEBHOOK_PORT || 9001);