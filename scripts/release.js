const { execSync } = require("child_process");
const fs = require("fs");

const version = require("../package.json").version;
const packageName = require("../package.json").name;

// Create a GitHub release
execSync(`gh release create v${version} -t "Release v${version}"`);

// Create a tarball of your package
execSync("npm pack");

// Move the tarball to the releases folder only if it exists
const tarballName = `${packageName.replace("/", "-")}-${version}.tgz`;
const sourcePath = `./${tarballName}`;
const destinationPath = `./releases/${tarballName}`;

execSync("ls");
console.log(tarballName);
console.log(sourcePath);
console.log(destinationPath);

// Check if the tarball exists before moving it
if (fs.existsSync(sourcePath)) {
  // Move the tarball to the releases folder
  fs.renameSync(sourcePath, destinationPath);
} else {
  // Handle the case where the tarball doesn't exist
  console.error(`Error: Tarball '${tarballName}' does not exist.`);
}
