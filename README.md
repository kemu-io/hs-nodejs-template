# hs-nodejs-template

This is a Node.js template project.

## Version

0.1.0

## Description

This project is a template for creating Kemu Hub Services in Node.js.

## Installation

First, clone the repository:

```bash
git clone https://github.com/kemu-io/hs-nodejs-template
```

Then, navigate to the project directory and install the dependencies:

  **NOTE:** we recommend using [nvm](https://github.com/nvm-sh/nvm) and node version 22.2.0.

```bash
cd hs-nodejs-template
# nvm use (optional)
npm install
```

## Usage
To build the project, run:

```bash
npm run build
```

This will compile the TypeScript files and copy the necessary files to the `dist` directory.

## Running the service

To run the service, run:

```bash
node dist/processor.js {SERVICE_ID}
```

Where `{SERVICE_ID}` is the session id generated by the Kemu Hub.
