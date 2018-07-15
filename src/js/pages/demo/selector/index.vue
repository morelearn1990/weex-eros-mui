<template>
  <div class="page-content">
    <div class="area-wrapper">
      <div class="area-show" @click="selecting">
        <text class="area-text">{{ area.full_name }}</text>
      </div>
      <div class="area-reset" @click="noSelecting">
        <text class="area-text">重置</text>
      </div>
    </div>
    <div class="detail">
      <text>需要传递的参数：</text>
      <text class="detail-text">:isShow.sync="showSelector" 必须加上 .sync 修饰符</text>
      <text class="detail-text">:filterData="AreaData" 需要筛选的字段，有格式要求，为一个数组，数组里面是一个对象，对象里面一定要有一个 data 的待选择数组，里面在包含对象，对象里面必须有传进去的 filterField="id" showField="name" 属性。</text>
      <text class="detail-text">tabName='tabname' 选择器里面 请选择后面的字段，包含在 AreaData 数组对象的属性里面 </text>
      <text class="detail-text">filterField="id" 匹配的字段，匹配规则为下级选择器的该字段前段是上级选择器的该字段 /^id/.test(id) </text>
      <text class="detail-text">showField="name" 展示字段，用于选择器里面展示的字段</text>
      <text class="detail-text">@selected="changeArea" 事件：选择确定,返回 event 包含 status: true, data:list ，data 里面是每个选择器所选择的项</text>
      <text class="detail-text">@cancel 事件：选择确定,返回 event 包含 status: true</text>
    </div>
    <m-multi-selector :isShow.sync="showSelector" :filterData="AreaData" tabName="tabname" filterField="id" showField="name" @selected="changeArea"></m-multi-selector>
  </div>
</template>
<script>
import MMultiSelector from "Components/multilevel-selector";
import AreaData from "./mock.js";
export default {
  components: {
    MMultiSelector
  },
  data() {
    return {
      showSelector: false,
      area: {
        full_name: "贵州"
      },
      AreaData
    };
  },
  methods: {
    selecting() {
      this.showSelector = true;
    },
    noSelecting() {
      this.showSelector = false;
    },
    changeArea(event) {
      let length = event.data.length;
      this.area = event.data[length - 1] ? event.data[length - 1] : {};
    }
  }
};
</script>
<style>
.test {
  padding-top: 100px;
}
.area-wrapper {
  margin-top: 20px;
  width: 750px;
  height: 80px;
  flex-direction: row;
  flex-wrap: nowrap;
}
.area-show {
  width: 600px;
  height: 80px;
  border-style: solid;
  border-width: 1px;
  border-color: #444;
  justify-content: center;
}
.area-reset {
  width: 150px;
  height: 80px;
  border-style: solid;
  border-width: 1px;
  border-color: #444;
  justify-content: center;
}
.area-text {
  font-size: 40px;
  text-align: center;
}
.detail {
  padding: 20px;
}
.detail-text {
  padding-left: 20px;
  line-height: 50px;
}
</style>
