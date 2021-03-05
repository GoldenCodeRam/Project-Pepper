cd temp/

IMAGE_FILE=$(ls)

curl -s -X POST -F "data=@$IMAGE_FILE" localhost:$1 > temp

echo "☑️ 🗄️ Image received from server..."