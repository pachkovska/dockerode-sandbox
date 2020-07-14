# dockerode-sandbox
Example of Docker containerization within Node.js app using [dockerode](https://www.npmjs.com/package/dockerode).

Currently it builds a custom node image, creates a local network and creates a container on that network. There can be many containers running at the same time.

## Prerequisites
To run this example you need Docker and Node.js installed.

### Docker commands cheatsheet:
`FROM` - allows us to pull a pre-built image of a system from dockerhub. It basically will download it for you. 
In this example, we sued pre-built image of Node which already comes with Linux OS. 

`RUN` - allows us to use any linux command when creating container. That is how, for instance, we are able to execute 
mkdir or npm install commands. See Dockerfile. 

`WORKDIR` - used to define the working directory of a Docker container at any given time. 
The command is also specified in the Dockerfile.

###Commandline useful commands:
`docker ps` - will show list currently running processes thus you will see all of the running containers
`docker network prune` - delete all unused docker networks.
`docker exec -it <containerId> /bin/bash` - allows you to go into the specific container and see what is in it. Helpful for troubleshooting. 
`docker kill <containerId>` - kill specific running container. Generally you will not use it unless there are issues with the container. 



## Running
`npm install && npm start`
