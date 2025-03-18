#!/bin/bash

echo "setting up previews..."

pwd=$(pwd)
branch=$(git branch --show-current)

for repo in previews/*; do
  echo "setting up previews for repo: $repo..."

  cd $pwd/$repo
  git fetch --all

  if git show-ref --quiet origin/$branch; then
    target=origin/$branch
  else
    target=$(git symbolic-ref --short refs/remotes/origin/HEAD) 
  fi

  echo "set to branch $target"
  git checkout -f $target
done