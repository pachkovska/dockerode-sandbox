# dockerode-example
Example of Docker automation with Node.js and [dockerode](https://www.npmjs.com/package/dockerode).

Currently it builds a custom nginx image, creates a local network and creates a container on that network with host port mapping.

## Prerequisites
To run this example you need Docker (tested with 1.13.1 on linux) and Node.js installed (tested with 4.4.7).

## Running
`npm install && npm start`

Then check if nginx is running on http://localhost 
