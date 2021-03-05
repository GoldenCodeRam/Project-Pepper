<template>
<div class="imageContainer">
  <img ref="image" v-show="isImageLoaded">
  <i class="fas fa-file-image" v-if="!isImageLoaded"></i>
</div>
</template>

<script lang="ts">
import { onMounted, ref, watchEffect } from 'vue';

const isImageLoaded = ref<boolean>(false);

export default {
  props: {
    imageURL: String,
  },
  setup(props: any) {
    const image = ref<HTMLImageElement | null>(null);

    onMounted(() => {
      watchEffect(() => {
        if (image.value && props.imageURL) {
          isImageLoaded.value = true;
          image.value.src = props.imageURL;
          image.value.onload = () => {
            if (image.value) URL.revokeObjectURL(image.value.src);
          };
        }
      });
    });

    console.log(props);
    return {
      image,
      isImageLoaded,
    };
  },
};
</script>

<style lang="scss" scoped>
div.imageContainer {
  background: #ffffff;
  padding: 2rem;
  margin: 1rem;
  border-radius: 15px;
  box-shadow: 0 3px 3px #9c9c9c;

  img {
    margin: 0;
    max-width: 20rem;
    max-height: 20rem;
  }
}

i {
  padding: 2pt;
  font-size: 32pt;
  color: #b4b4b4;
}
</style>
