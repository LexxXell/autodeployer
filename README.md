# Autodeployer
The webhook from github calls pull for the repository, and does the callback.

## Contents
- [Technologies](#Technologies)
- [Usage](#usage)
- [Deploy и CI/CD](#deploy-and-ci/cd)
- [Project Team](#project-team)

## Technologies
- [NodeJS](https://nodejs.org/)
- [ExpressJS](https://expressjs.com/)
- [dotenv](https://github.com/motdotla/dotenv#readme)
- [nodemon](https://nodemon.io/)
- [yarn](https://yarnpkg.com/)


## Usage

Clone the repository to the server. Configure the github repository to call webhook, need use content type application/json. Configure the webserver on the server as a reverse proxy (if using the Nginx/Apache/etc webserver).

Install the dependencies with yarn:
```sh
$ yarn
```
Rename the .env.example file to .env and modify it to suit your needs.

Configure config.json according to your requirements, you can specify multiple repositories to track.
```
"full_name" - full name of the github repository (ex. "LexxXell/autodeployer")
"branch" - the name of the branch that will trigger the hook when updated
"hook_path" - defaul can use "<autodeployer_dir_path>/hooks/default_hook.sh"
"project_path" - path to project directory
"log_dir_path" - log files will be added here
"callback" - this is passed to hook-script as a callback to be executed after the pull request is executed
```

Run autodeployer:
```sh
$ yarn dev
```

## Deploy и CI/CD
It is recommended to use pm2 to run the autodeployer in production.



## Project Team

- [LexxXell](https://t.me/lexxxell) — Back-End Engineer
