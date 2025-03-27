#!/bin/bash

echo "Setting up previews..."

GITHUB_USERNAME=bucket-bot
ROOT_DIR=$(pwd)
CURRENT_BRANCH=$(git branch --show-current)

function sync_submodules {
  echo "Pull submodules:"

  mv previews .previews
  sed -i'.bak' "s/https:\/\/github.com\//https:\/\/$GITHUB_TOKEN@github.com\//" "$ROOT_DIR/.gitmodules"
  git submodule sync
  git submodule update --remote

  cp -RT .previews previews
  rm -rf .previews
}

function checkout_branches {
  echo "Checkout branches for each preview repos:"

  for repo in previews/*; do
    echo "Setting up previews for repo $repo:"

    cd $ROOT_DIR/$repo
    git fetch --all

    echo $(git show-ref origin/$CURRENT_BRANCH)
    git branch -a | cat

    if git show-ref --quiet origin/$CURRENT_BRANCH; then
      target=origin/$CURRENT_BRANCH
    else
      target=$(git symbolic-ref --short refs/remotes/origin/HEAD) 
    fi

    echo "Set to branch $target"
    git checkout -f $target
  done
}

if [ -n "$GITHUB_TOKEN" ]; then
  sync_submodules && checkout_branches
fi
