CONTAINER_REPOSITORY="lowenherz/quote-to-image-server"

if docker &> /dev/null
then
  CONTAINER_IMAGE=$(docker images --format="{{.Repository}}{{.ID}}" | grep "^$CONTAINER_REPOSITORY")
  CONTAINER_IMAGE=${CONTAINER_IMAGE#$CONTAINER_REPOSITORY}

  CONTAINER_INSTANCES=$(docker container ls --format="{{.Ports}}")

  declare -a CONTAINER_PORTS=()

  for CONTAINER_INSTANCE in $CONTAINER_INSTANCES; do
    TEMP=${CONTAINER_INSTANCE#*:}
    TEMP=${TEMP%-*}
    CONTAINER_PORTS+=(${TEMP%/*})
  done

  for PORT in "${CONTAINER_PORTS[@]}"; do
    echo $PORT
  done
fi