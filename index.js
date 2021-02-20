const Docker = require('dockerode');
const docker = new Docker();

let imageTag = 'node';
let networkName = 'node_network';
let containerName = 'node_container_1';
let testFile = 'test/test.json';

buildImage(imageTag, process.cwd(), testFile).then(() => {

    console.log('Image built.');
    return createNetwork(networkName);

}).then(() => {

    console.log('Network created.');
    return createContainer(imageTag, containerName, networkName);

}).then((container) => {

    // console.log('Container created.', containerInfo);
    console.log('Container created.');
    container.stop(); //commented out for now, but it stops container and this container get auto-removed.
    console.log("container stopped")
}).catch((err) => {
    console.log(`Something went wrong: ${err}`);
});

/**
 * Creates the container.
 * @param  {String} image The image to be used.
 * @param  {String} containerName A name for the container
 * @param  {String} networkName the docker network to be used.
 * @return {Promise} A promise to retrieve a container.
 */
function createContainer(image, containerName, networkName) {
    return new Promise(function(resolve, reject) {
        let hostConfig = {
            AutoRemove: true, // I added this to remove container. It will work only after container has been stopped.
            NetworkMode: networkName,
            PortBindings: {
                "8080/tcp": [
                    {
                        "HostPort": "8080",
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

async function checkForNetwork(networkName) {
    const listNetworks = await docker.listNetworks();
    for (let network of listNetworks) {
        console.log(network.Name);
        if (networkName === network.Name) return true;
    }
    return false;
}

async function checkForImage(imageTag) {
    const listImages = await docker.listImages();
    for (let image of listImages) {
        console.log(image.RepoTags);
        // if (networkName === network.Name) return true;
    }
    // return false;
}

/**
 * Creates a local docker network.
 * @param  {String} networkName Name of the network to be created.
 * @return {Promise}  A promise.
 */
async function createNetwork(networkName) {
    const listNetworks = await docker.listNetworks();
    if (listNetworks.length > 3 && checkForNetwork(networkName)) return networkName;
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
async function buildImage(tag, imageLocation, testFile) {
    const listImages = await docker.listImages();
    if (listImages.length > 0) return checkForImage(tag);
    return new Promise(function(resolve, reject) {
        docker.buildImage({
            context: imageLocation,
            src: ['Dockerfile', 'index.js', 'package.json', testFile],
        }, {
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
