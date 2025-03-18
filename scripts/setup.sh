#!/bin/bash

echo "setting up previews..."

GITHUB_USERNAME=bucket-bot
ROOT_DIR=$(pwd)
CURRENT_BRANCH=$(git branch --show-current)

function sync_submodules {
  echo "pull submodules:"

  sed -i'.bak' "s/https:\/\/github.com\//https:\/\/oauth2:$GITHUB_TOKEN@github.com\//" "$ROOT_DIR/.gitmodules"

  git submodule sync
  git submodule update --remote
}

function checkout_branches {
  echo "checkout branches for each preview repos:"

  for repo in previews/*; do
    echo "  setting up previews for repo $repo:"

    cd $ROOT_DIR/$repo
    git fetch --all

    if git show-ref --quiet origin/$branch; then
      target=origin/$CURRENT_BRANCH
    else
      target=$(git symbolic-ref --short refs/remotes/origin/HEAD) 
    fi

    echo "    set to branch $target"
    git checkout -f $target
  done
}

if [ -z $GITHUB_TOKEN ]; then
  echo '$GITHUB_TOKEN is not provided. Abort.'
  exit 1
fi
  
sync_submodules
checkout_branches