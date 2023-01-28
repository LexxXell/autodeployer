cd $PROJECT_PATH &&
  git pull origin $BRANCH &&
  exec $CALLBACK
