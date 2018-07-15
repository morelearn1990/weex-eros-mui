<template>
  <m-table :data="mockData"></m-table>
</template>
<script>
import mockData from "./mock-data.js";
import MTable from "Components/simple-table/index.js";
export default {
  components: {
    MTable
  },
  data() {
    return {
      mockData
    };
  }
};
</script>
<style>
</style>
