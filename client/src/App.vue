<template>
  <router-view/>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Andika+New+Basic&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');

body {
  background: #14518b;
  margin: 0;
  padding: 0;
}

#app {
  margin: 5rem auto;
  width: 75%;
  background: #f6f6f6;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  border-radius: 25px;
  border: solid 3px #fafafa;
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.4);
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
