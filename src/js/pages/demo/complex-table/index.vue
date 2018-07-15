<template>
  <div>
    <m-complex-table :data="mockData" :fixedHeader="true">
      <m-complex-table-column prop="dscomname" label="机构"></m-complex-table-column>
      <m-complex-table-column prop="day" width=150 label="日报费"></m-complex-table-column>
      <m-complex-table-column prop="month" width=280 label="月报费"></m-complex-table-column>
      <m-complex-table-column prop="year" width=300 label="年报费"></m-complex-table-column>
    </m-complex-table>
    <div class="button" @click="changeDate">
      <text class="button-text">改变数据</text>
    </div>
  </div>
</template>
<script>
import mockData from "./mock-data.js";
import mockData2 from "./mock-data2.js";
import {
  MComplexTable,
  MComplexTableColumn
} from "Components/complex-table/index.js";
export default {
  components: {
    MComplexTable,
    MComplexTableColumn
  },
  data() {
    return {
      mockData
    };
  },
  methods: {
    changeDate() {
      this.mockData = mockData2;
    }
  }
};
</script>
<style>
.button {
  width: 700px;
  height: 90px;
  margin-top: 20px;
  margin-left: 25px;
  justify-content: center;
  align-items: center;
  background-color: darkgreen;
  border-radius: 15px;
}
.button-text {
  color: #fff;
  font-size: 36px;
}
</style>

