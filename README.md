# Autodeployer
The webhook from github calls pull for the repository, and does the callback.

## Contents
- [Technologies](#Technologies)
- [Usage](#usage)
- [Deploy и CI/CD](#deploy-и-ci/cd)
- [Project Team](#project-team)

## Technologies
- [NodeJS](https://nodejs.org/)
- [ExpressJS](https://expressjs.com/)
- [dotenv](https://github.com/motdotla/dotenv#readme)
- [nodemon](https://nodemon.io/)
- [yarn](https://yarnpkg.com/)


## Usage

Clone the repository to the server. Configure the github repository to call webhook. Configure the webserver on the server as a reverse proxy (if using the Nginx/Apache/etc webserver).

Set the dependencies with yarn:
```sh
$ yarn
```
Rename the .env.example file to .env and modify it to suit your needs.

Run the bot:
```sh
$ yarn dev
```
You can specify the .env file at startup:
```sh
$ node src/index.js /path/to/.env
```

## Deploy и CI/CD
It is recommended to use pm2 to run the autodeployer in production.



## Project Team

- [LexxXell](https://t.me/lexxxell) — Back-End Engineer
