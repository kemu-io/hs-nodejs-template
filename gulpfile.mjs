/* eslint-disable no-undef */

import gulp from 'gulp';
import { exec } from 'child_process';
import zip from 'gulp-zip';
import { deleteAsync } from 'del';
import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';

// Read a JSON file
const readJsonFile = (filePath) => {
  const fileStr = readFileSync(filePath, 'utf8');
  const file = JSON.parse(fileStr);
  return file;
};

const outputDir = 'build';
const manifest = readJsonFile('./src/manifest.json');
const packageJson = readJsonFile('./package.json');

// Define the service name and version for the zip file name
const serviceName = manifest.name;
const version = manifest.version;

// Task to run 'npm run pack'
gulp.task('build', (cb) => {
  exec('npm run build', (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    cb(err);
  });
});

// Task to copy package.json to the build directory
gulp.task('copy-package-json', async () => {
  return gulp.src('package.json')
    .pipe(gulp.dest(`${outputDir}/`));
});

// Copy all the built files
gulp.task('copy-dist', async () => {
  return gulp.src('dist/**/*')
    .pipe(gulp.dest(`${outputDir}/dist/`));
});

// copy the docs folder
gulp.task('copy-docs', async () => {
  return gulp.src('docs/**/*', { allowEmpty: true })
    .pipe(gulp.dest(`${outputDir}/dist/docs/`));
});

// Remove build directory
gulp.task('clean', () => {
  return deleteAsync([
    outputDir,
  ]);
});

// Task to install production dependencies in the build directory
gulp.task('npm-install-prod', (cb) => {
  // NPM's
  exec('npm install --omit=dev --prefix ./build', (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    cb(err);
  });
});

// Task to zip the build directory
gulp.task('zip-build', () => {
  return gulp.src(['build/**/**/*'], { dot: true, resolveSymlinks: true })
    .pipe(zip(`${serviceName}@${version}.zip`))
    .pipe(gulp.dest(`${outputDir}/`));
});

// Delete everything except for the zip file
gulp.task('remove-artifacts', () => {
  return deleteAsync([
    `${outputDir}/**/*`,
    `!${outputDir}/*.zip`,
  ]);
});

// Removes the test. prefix from the manifest name which is not
// allowed in prod services.
gulp.task('patch-manifest', async () => {
  if(manifest.name.startsWith('test.')) {
    manifest.name = manifest.name.slice(5);
  }

  await writeFile(`dist/manifest.json`, JSON.stringify(manifest, null, 2));
});

// Define the default task
const release = gulp.series(
  'clean',
  'build',
  'copy-dist',
  'copy-docs',
  'patch-manifest',
  'copy-package-json',
  'npm-install-prod',
  'zip-build',
  'remove-artifacts'
);

export { release };
