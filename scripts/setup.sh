#!/bin/bash

echo "Setting up previews..."

ROOT_DIR=$(pwd)

function sync_submodules {
  echo "Pull submodules:"

  mv previews .previews

  sed -i'.bak' "s/https:\/\/github.com\//https:\/\/$GITHUB_TOKEN@github.com\//" "$ROOT_DIR/.gitmodules"
  git submodule sync
  git submodule update --init --remote
  rm .gitmodules
  mv .gitmodules.bak .gitmodules

  cp -RT .previews previews
  rm -rf .previews
}

function checkout_branches {
  echo "Checkout branches for each preview repos:"

  # cd $ROOT_DIR/sdk
  # SDK_VERSION=$(npm pkg get version --workspaces=false | tr -d \")
  # cd $ROOT_DIR

  for repo in previews/*; do
    echo "Setting up previews for repo $repo:"

    cd $ROOT_DIR/$repo
    git fetch --all

    if git show-ref --quiet origin/$VERCEL_GIT_COMMIT_REF; then
      target=origin/$VERCEL_GIT_COMMIT_REF
    else
      target=$(git symbolic-ref --short refs/remotes/origin/HEAD) 
    fi

    echo "Set to branch $target"
    git checkout -f $target

    # npm pkg set dependencies.bucket-protocol-sdk=$SDK_VERSION --workspaces=false
  done
}

if [ -n "$GITHUB_TOKEN" ]; then
  sync_submodules && checkout_branches
fi
