'use strict'
const Docker = require('dockerode');
const tar = require('tar-fs');

// https://github.com/apocas/dockerode
const docker = new Docker();

let imageTag = 'our_nginx_image';
let networkName = 'our_network';
let containerName = 'our_container';

buildImage(imageTag, process.cwd()).then(() => {
    console.log('Image built.');
    return createNetwork(networkName);
}).then(() => {
    console.log('Network created.');
    return createContainer(imageTag, containerName, networkName);
}).then(() => {
    console.log('Container created.');
}).catch((err) => {
    console.log(`Something went wrong: ${err.stack}`);
});

function createContainer(image, containerName, networkName) {
    return new Promise(function(resolve, reject) {
        let hostConfig = {
            NetworkMode: networkName,
            PortBindings: {
                "80/tcp": [
                    {
                        "HostPort": "80",
                        "HostIp": "0.0.0.0"
                    }
                ]
            }
        };

        docker.createContainer({
            Image: image,
            Tty: true,
            name: containerName,
            HostConfig: hostConfig
        }, function(err, container) {
            if (err) {
                reject(err);
                return;
            }
            //as soon as the container is created we start it!
            container.start({}, function(err, data) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(container);
            });
        });
    });
}

/**
 * Creates a local docker network.
 * @param  {String} networkName Name of the network to be created.
 * @return {Promise}  A promise.
 */
function createNetwork(networkName) {
    return new Promise(function(resolve, reject) {
        docker.createNetwork({
            "Name": networkName,
            "Driver": "bridge"
        }, function(err, result) {
            if (err) {
                reject(err);
                return
            }
            resolve();
        });
    });
}

/**
 * Builds a docker image.
 * @param  {String} tag Tag to be applied on the image.
 * @param  {String} buildContextLocation Path to the Docker build context.
 * @return {Promise}  A promise.
 */
function buildImage(tag, buildContextLocation) {
    return new Promise(function(resolve, reject) {
        var tarStream = tar.pack(buildContextLocation);
        docker.buildImage(tarStream, {
            t: tag
        }, function(err, stream) {
            if (err) {
                reject(err);
                return;
            }
            stream.pipe(process.stdout);
            stream.on('end', resolve);
        });
    });
}
