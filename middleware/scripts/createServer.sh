#! bin/bash

CONTAINER_REPOSITORY="heizraum/simple-image-modifier";

docker pull ${CONTAINER_REPOSITORY}

CONTAINER_IMAGE=$(docker images --format="{{.Repository}}{{.ID}}{{.Tag}}" | grep "^$CONTAINER_REPOSITORY" | grep "latest*");

CONTAINER_IMAGE=${CONTAINER_IMAGE#$CONTAINER_REPOSITORY};

CONTAINER_IMAGE=${CONTAINER_IMAGE%"latest"};

echo "Creating new server at port: $1...";

docker run -d -p $1:8080 $CONTAINER_IMAGE;

echo "Server created at port: $1!";