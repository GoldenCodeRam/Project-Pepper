#! bin/bash

cd ./database

DATABASE_SERVERS_FILES=$(ls *.sqlite | grep 'server_^*')

declare -a SERVER_NAMES=()

for SERVER_FILE in $DATABASE_SERVERS_FILES
do
  SERVER_NAME=$(echo $SERVER_FILE | cut -d'.' -f1)
  SERVER_NAMES+=(${SERVER_NAME})
done

for SERVER_NAME in ${SERVER_NAMES[@]}
do
  echo $SERVER_NAME
done