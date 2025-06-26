/* eslint-disable no-undef */

import gulp from 'gulp';
import { exec } from 'child_process';
import zip from 'gulp-zip';
import { deleteAsync } from 'del';
import { readFileSync, rmSync } from 'fs';
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
const serviceName = manifest.name.replace('test.', '');
const version = manifest.version;
// Check if pnpm is used by checking the existence of pnpm-workspace.yml
// const isPnpm = existsSync('pnpm-workspace.yaml');
const isPnpm = false;

/**
 * Returns the current platform and architecture as a string.
 * @returns the current platform and architecture as a string in the format of 'os-arch' or 'os-dist-arch'
 * @example 'win-x64', 'linux-debian-x64'
 */
const getCurrentPlatform = () => {
  const arch = (() => {
    switch (process.arch) {
      case 'x64': return 'x64';
      case 'ia32': return 'x86';
      case 'arm': return 'arm';
      case 'arm64': return 'arm64';
      default: return '';
    }
  })();

  if (!arch) {
    throw new Error(`Unsupported architecture: ${process.arch}`);
  }

  switch (process.platform) {
    case 'win32':
      return `win-${arch}`;
    case 'darwin':
      return `osx-${arch}`;
    case 'linux': {
      let dist = 'generic';
      try {
        const osRelease = readFileSync('/etc/os-release', 'utf-8');
        const releaseInfo = osRelease.split('\n').reduce((acc, line) => {
          const [key, ...valueParts] = line.split('=');
          if (key && valueParts.length > 0) {
            let value = valueParts.join('=').trim();
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.substring(1, value.length - 1);
            }
            acc[key.trim()] = value;
          }
          return acc;
        }, {});

        const id = releaseInfo.ID;
        const idLike = releaseInfo.ID_LIKE?.split(/\s+/) || [];

        if (id === 'debian' || idLike.includes('debian')) {
          dist = 'debian';
        } else if (id === 'rhel' || id === 'fedora' || id === 'centos' || idLike.includes('rhel') || idLike.includes('fedora')) {
          dist = 'rhel';
        } else if (id === 'arch' || idLike.includes('arch')) {
          dist = 'arch';
        }
      } catch (e) {
        // default to generic I guess ?
      }
      return `linux-${dist}-${arch}`;
    }
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
};

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
  if(!isPnpm) {
    return gulp.src('package.json')
      .pipe(gulp.dest(`${outputDir}/`));
  }
});

// Copy all the built files
gulp.task('copy-dist', async () => {
  if(!isPnpm) {
    return gulp.src('dist/**/*')
      .pipe(gulp.dest(`${outputDir}/dist/`));
  }
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
  exec('npm install --omit=dev --no-save --prefix ./build', (err, stdout, stderr) => {
    console.log(stdout);
    // Windows, npm install creates a symlink to the parent folder in build/node_modules.
    // Here we get rid of it.
    rmSync(`./build/node_modules/${packageJson.name}`, { recursive: true, force: true });
    stderr && console.error(stderr);
    cb(err);
  });
});

// Task to zip the build directory
gulp.task('zip-build', () => {
  return gulp.src(['build/**/**/*'], { dot: true, resolveSymlinks: true })
    .pipe(zip(`${serviceName}@${version}-${getCurrentPlatform()}.zip`))
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

  return writeFile('dist/manifest.json', JSON.stringify(manifest, null, 2));
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
