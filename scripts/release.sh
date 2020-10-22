#!/usr/bin/env bash

set -e -o pipefail

rm -rf dist/ngx-structurals
lerna version
ng build --prod ngx-structurals

cp README.md dist/ngx-structurals
cp LICENSE dist/ngx-structurals

cd dist/ngx-structurals && npm publish --access public --registry https://registry.npmjs.org/ ; cd -

git push
git push --tags
