const { githubHeader } = require('./github-headers.enum');
const { githubEvent } = require('./github-events.enum');
const httpStatus = require('./httpStatusCodes.enum');

module.exports = {
  githubEvent,
  githubHeader,
  httpStatus,
}