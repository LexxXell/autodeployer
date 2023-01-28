const express = require('express');
const { logger } = require('./helpers');
const { githubHeader, githubEvent, httpStatus } = require('./enums');

const githubEventListener = {};

githubEventListener.server = express();
githubEventListener.server.use(express.json());
githubEventListener.server.use(express.urlencoded({ extended: true }));
githubEventListener.onPushCallback = (data) => {
  logger('Github event PUSH...');
};

githubEventListener.server.post('/', (request, response) => {
  try {
    if (request.headers[githubHeader.EVENT]) {
      response.status(httpStatus.OK).json({ status: httpStatus.OK });
      if (request.headers[githubHeader.EVENT] === githubEvent.PING) {
        logger('Github event PING...');
      }
      if (request.headers[githubHeader.EVENT] === githubEvent.PUSH) {
        githubEventListener.onPushCallback(
          request.body.payload ? JSON.parse(request.body.payload) : request.body
        );
      }
    } else {
      response
        .status(httpStatus.BAD_REQUEST)
        .json({ status: httpStatus.BAD_REQUEST });
    }
  } catch (error) {
    response.status().json({ status: 500 });
  }
});

let _ = githubEventListener.server.listen(
  process.env.WEBHOOK_PORT || 9001,
  function () {
    logger(`Server listening at PORT: ${_.address().port}`);
  }
);

module.exports = githubEventListener;
