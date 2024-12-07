# hs-nodejs-template

This is a Node.js template project.

## Version

0.1.0

## Description

This project is a template for creating Kemu Hub Services in Node.js.

## Installation

**NOTE:** We recommend using [pnpm](https://pnpm.io/) as the package manager for this project.

First, clone the repository:

```bash
git clone https://github.com/kemu-io/hs-nodejs-template
```

Then, navigate to the project directory and install the dependencies:

```bash
cd hs-nodejs-template
# nvm use (optional)
pnpm install
```


## Usage
* To build the project, run:

```bash
pnpm run build
```

This will compile the TypeScript files and copy the necessary files to the `dist` directory.

## Release Your Service For Deployment
This project includes a script to release your service to be deployed to the Kemu Hub. To release your service, run:

```bash
pnpm run release
```


## Running the service

To run the service, run:

```bash
node dist/processor.js
```
