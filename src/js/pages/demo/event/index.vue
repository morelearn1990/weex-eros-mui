<template>
  <div class="container" ref="container"></div>
</template>
<script>
export default {
  data() {
    return {
      clickCount: 0,
      touchCount: 0
    };
  },
  mounted() {
    let _this = this;
    let container = this.$refs.container;
    container.addEvent("touchstart", function(e) {
      _this.touchCount > 10 ? container.removeEvent("touchstart") : "";
      console.log("touchCount", _this.touchCount);
      console.log("touchstart", e);
      _this.touchCount++;
    });
    container.addEvent("click", function(e) {
      _this.clickCount > 4 ? container.removeEvent("click") : "";
      console.log("clickCount", _this.clickCount);
      console.log("click", e);
      _this.clickCount++;
    });
  }
};
</script>

<style>
.container {
  background-color: red;
  width: 750px;
  flex: 1;
}
</style>
