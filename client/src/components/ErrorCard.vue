<template>
<div class="framedContainer red">
  <i class="fas fa-exclamation-circle"></i>
  <a>{{message}}</a>
</div>
</template>

<script lang="ts">
export default {
  props: {
    message: String,
  },
};
</script>

<style lang="scss" scoped>
div.framedContainer.red {
  color: #fafafa;
  background: #721e1e;
  flex-direction: row;

  i {
    font-size: 24pt;
  }
}
</style>
