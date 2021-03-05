<template>
  <div class="card">
    <div :class="{serverStatusUp: !isServerDown, serverStatusDown: isServerDown}">
      <i v-if="!isServerDown" class="fas fa-check-circle"></i>
      <i v-if="isServerDown" class="fas fa-times-circle"></i>
    </div>
    <a class="title">{{ title }}</a>
    <a>Last update:</a>
    <a class="dateChecked">{{ dateChecked }}</a>
    <button v-on:click="restartServer" :disabled="!isServerDown">Restart server</button>
  </div>
</template>

<script lang="ts">
const API_RESTART_SERVER = 'http://localhost:3000/server-status/restart-server/?server=';

export default {
  props: {
    title: String,
    dateChecked: String,
    isServerDown: Boolean,
  },
  setup(props: any) {
    function restartServer() {
      fetch(API_RESTART_SERVER + props.title).then((response) => console.log(response));
    }

    return {
      restartServer,
    };
  },
};
</script>

<style lang="scss" scoped>
div.card {
  display: flex;
  flex-direction: column;
  margin: 1.5rem;
  padding: 1rem;
  background: #dadada;
  border-radius: 15px;
  width: 15rem;

  transition: all 0.3s;

  div.serverStatusUp {
    font-size: 24pt;
    color: #39ac17;
  }
  div.serverStatusDown {
    font-size: 24pt;
    color: #c32f2f;
  }
  a.title {
    font-family: 'Andika New Basic', sans-serif;
    font-weight: 600;
    font-size: 14pt;
    color: #2c3e50;
  }
  a.dateChecked {
    margin: 1rem;
  }
}
div.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 3px 5px #8b8b8b;
}
</style>
