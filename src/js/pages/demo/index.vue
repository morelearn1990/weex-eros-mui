<template>
  <div class="page-container">
    <div class="header">
      <text class="header-txt title">Mui</text>
      <text class="header-txt">基于 weex-eros 的一些不常用 UI 组件库</text>
    </div>
    <list>
      <cell v-for="(target,index) in listData" :key="index">
        <div class="cell-header">
          <text class="cell-header-title">{{target.title}}</text>
        </div>
        <wxc-cell v-for="(item,itemIndex) in target.list" :key="itemIndex" :title="item.title" :desc="item.des" :has-arrow="true" :has-top-border="true" @wxcCellClicked="jumpToRouter(item.name)"></wxc-cell>
      </cell>
    </list>
  </div>
</template>
<script>
import { WxcCell } from "weex-ui";
import listData from "./list-data.js";
export default {
  components: {
    WxcCell
  },
  data() {
    return {
      listData
    };
  },
  methods: {
    jumpToRouter(name) {
      this.$router.open({
        name,
        gesBack: false
      });
    }
  }
};
</script>
<style>
.page-container {
  flex: 1;
  flex-direction: column;
}
.header {
  margin-top: 150px;
}
.header-txt {
  text-align: center;
}
.title {
  font-size: 50px;
  margin-bottom: 20px;
}
.cell-header {
  padding-top: 45px;
  padding-left: 20px;
  width: 750px;
  height: 117px;
}
.cell-header-title {
  width: 650px;
  font-weight: 400;
  font-size: 40px;
  color: #1da1f2;
}
</style>
