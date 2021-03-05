<template>
  <Logo />
  <a class="description">Laboratory project for the depelopment of a load balancer middleware.</a>
  <br>
  <a class="link" href="https://github.com/HeizRaum/Laboratory-2-Client" target="_blank"><u>🤖 Link to the GitHub repo 🗄️</u></a>
  <div class="container">
    <div class="framedContainer" v-if="isConnectedToMiddleware">
      <a>Add new server</a>
      <button v-on:click="addServer">Add server</button>
    </div>
    <error-card v-if="!isConnectedToMiddleware"
      :message="'Couldn\'t stablish connection with middleware!'" />
  </div>
  <div class="container">
    <div class="framedContainer">
      <a>Upload image</a>

      <image-container
        :imageURL="imageURL"/>

      <div>
        <button v-on:click="uploadImage">Upload image</button>
        <input id="imageInput" type="file" style="display: none;" accept="image/png"/>
        <button v-on:click="sendImage">Send image</button>
      </div>
    </div>
  </div>
  <div class="cardContainer">
    <server-card v-for="(status, index) in serversStatus" v-bind:key="index"
      :title="status.name"
      :dateChecked="getDateChecked(status.date)"
      :isServerDown="getServerStatus(status.code)"
    />
  </div>
  <img id="my-img">
</template>

<script lang="ts">
import ErrorCard from '@/components/ErrorCard.vue';
import ImageContainer from '@/components/ImageContainer.vue';
import Logo from '@/components/Logo.vue';
import ServerCard from '@/components/ServerCard.vue';
import { ref } from 'vue';

interface ServerStatus {
  name: string;
  date: number;
  code: number;
}

const API_URL = 'http://localhost:3000/server-status';
const API_ADD_SERVER = 'http://localhost:3000/server-status/add-server';
const API_SEND_IMAGE = 'http://localhost:3000/send-image';

const serversStatus = ref<ServerStatus[]>([]);
const imageURL = ref<string>();
const isConnectedToMiddleware = ref<boolean>(false);

function handleApiResponse(response: Response) {
  response.text().then((data) => {
    isConnectedToMiddleware.value = true;
    try {
      serversStatus.value = JSON.parse(data) as ServerStatus[];
    } catch (error) {
      console.log('The response from the API is malformed!');
    }
  });
}

function handleApiRejection(rejection: Response) {
  isConnectedToMiddleware.value = false;
  console.log(rejection);
}

export default {
  mounted() {
    const response = fetch(API_URL);
    response.then(handleApiResponse, handleApiRejection);
  },
  setup() {
    function getDateChecked(numberDate: number): string {
      return new Date(numberDate).toString();
    }

    function getServerStatus(code: number) {
      return code !== 200;
    }

    function addServer() {
      fetch(API_ADD_SERVER).then((response) => console.log(response));
    }

    function uploadImage() {
      const imageInput: HTMLInputElement = document.getElementById('imageInput') as HTMLInputElement;
      imageInput.click();
      imageInput.addEventListener('change', () => {
        if (imageInput.files) {
          if (imageInput.value) {
            imageURL.value = URL.createObjectURL(imageInput.files[0]);
            // imageURL.value.onload = () => {
            //   if (imageURL.value) URL.revokeObjectURL(imageURL.value);
            // };
          }
        }
      });
    }

    function sendImage() {
      const imageInput: HTMLInputElement = document.getElementById('imageInput') as HTMLInputElement;
      const formData: FormData = new FormData();
      const options = {
        method: 'POST',
        body: formData,
      };

      if (imageInput.files) {
        formData.append('image', imageInput.files[0]);
        fetch(API_SEND_IMAGE, options).then((response: Response) => {
          if (response) {
            console.log(response.body?.getReader().read().then((value) => {
              console.log(value.value);
              if (value.value !== undefined) {
                const img: Uint8Array = value.value;
                const test: HTMLImageElement = document.getElementById('my-img') as HTMLImageElement;
                test.src = URL.createObjectURL(new Blob([img.buffer], { type: 'image/png' }));
              }
            }));
          }
        });
      }
    }

    return {
      isConnectedToMiddleware,
      getDateChecked,
      getServerStatus,
      uploadImage,
      sendImage,
      addServer,
      imageURL,
      serversStatus,
    };
  },
  components: {
    ErrorCard,
    ImageContainer,
    Logo,
    ServerCard,
  },
};
</script>

<style lang="scss">
div.container {
  display: flex;
  align-items: center;
  flex-direction: column;

  div.framedContainer {
    display: flex;
    background: #0a3863;
    flex-direction: column;
    align-items: center;
    border: 2px solid #fafafa;
    border-radius: 15px;
    margin: 1rem;
    padding: 1rem;

    box-shadow: 0 5px 5px #0a386350;
  }

  a {
    margin: 1rem;
    font-size: 14pt;
    color: white;
  }
}

div.cardContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
a {
  font-family: "Open Sans";
  color: #4e4e4e;
}
a.description {
  font-size: 14pt;
}
a.link {
  font-size: 12pt;
  font-weight: 800;
}

button {
  font-family: 'Open Sans';
  font-size: 12pt;
  padding: 0.8rem 1.5rem;
  margin: 0.5rem;
  min-width: 10rem;
  max-width: 20rem;

  outline: none;
  border: none;
  border-radius: 10px;
  box-shadow: 0 3px 0 #B3B3B3;

  transition: 0.075s all;
}
button:active {
  box-shadow: none;
  transform: translateY(3px);
}
button.disabled, button[disabled] {
  background: #B3B3B3;
  box-shadow: none;
}
button.disabled:active {
  transform: none;
}

img {
  max-width: 50em;
  max-height: 50em;

  margin: 1em;
}
</style>
