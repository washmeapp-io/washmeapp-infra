const { execSync } = require("child_process");
const fs = require("fs");

const version = require("../package.json").version;

// Create a GitHub release
execSync(`gh release create v${version} -t "Release v${version}"`);

// Create a tarball of your package
execSync("npm pack");

// Move the tarball to a releases directory
const tarballName = `@organization-infra-${version}.tgz`;
fs.renameSync(`./${tarballName}`, `./releases/${tarballName}`);
