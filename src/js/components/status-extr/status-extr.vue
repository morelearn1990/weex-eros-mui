<template>
  <div :style="statusStyle"></div>
</template>
<style>

</style>
<script>
let statusHeight = weex.config.eros.statusBarHeight;
export default {
  computed: {
    statusStyle() {
      return {
        width: "750px",
        height: statusHeight + "px"
      };
    }
  }
};
</script>
