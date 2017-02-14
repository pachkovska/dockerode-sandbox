# dockerode-example
Some examples on Docker-related automation with Node.js and dockerode.

Currently it build an nginx image base on a custom Dockerfile, creates a local network and creates a nginx container on that network with host port mapping.

## Prerequisites
To run this examples you need docker and Node.js installed (tested with 4.4.7).

## Running
`npm install && npm start`

Then check if nginx is running on http://localhost 
