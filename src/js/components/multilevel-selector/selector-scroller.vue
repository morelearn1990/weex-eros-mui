<template>
  <div class="select-wrapper" v-if="isShow">
    <div class="selector-indicator"></div>
    <div class="selector-column">
      <scroller scroll-direction="vertical" show-scrollbar=false class="selector" :style="widthStyle" v-for="(scroller,sIndex) in list" :key="sIndex" @scrollend="scrollend(sIndex,$event)" @scroll="scroll(sIndex,$event)">
        <div class="selector-top"></div>
        <div class="txt-wrapper" :ref="'scroller' + sIndex + 'item-1'" :style="widthStyle">
          <text class="txt" :style="widthStyle">请选择{{ tabName?scroller[tabName]:''}}</text>
        </div>
        <div class="txt-wrapper" :ref="'scroller' + sIndex + 'item' + subIndex" :style="widthStyle" v-for="(subItem,subIndex) in scroller.data" :key="subIndex">
          <text class="txt" :style="widthStyle" :class="[subIndex == subIndex ? 'txt-plus' : '']">{{ subItem[showField] }}</text>
        </div>
        <div class="selector-bottom"></div>
      </scroller>
    </div>
    <div class="selector-operate">
      <div class="selector-operate-btn" @click="cancelSelect">
        <text class="selector-operate-text">取消</text>
      </div>
      <div class="selector-operate-btn">
        <text class="selector-operate-text" @click="ensureSelect">确认</text>
      </div>
    </div>
  </div>
</template>
<script>
let dom = weex.requireModule("dom");
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    tabName: {
      type: String
    },
    showField: {
      type: String
    },
    filterField: {
      type: String,
      default: ""
    },
    filterData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      y: [],
      subIndexs: [],
      selectedList: []
    };
  },
  watch: {
    isShow() {
      this.y = [];
      this.subIndexs = [];
      this.selectedList = [];
    }
  },
  computed: {
    widthStyle() {
      let length = this.list.length;
      return length > 0
        ? {
            width: 750 / length + "px"
          }
        : {
            width: 750 + "px"
          };
    },
    level() {
      return this.filterData.length;
    },
    list() {
      let { subIndexs, level, filterData, filterField, selectedList } = this;
      let list = new Array(level);
      list[0] = filterData[0];
      for (let i = 0; i < level - 1; i++) {
        let scrollerTemp = { ...filterData[i + 1] };
        if (!scrollerTemp.data) {
          throw new Error("每个选择器对象下面必须有一个 data 数组");
          return;
        }
        let dataTemp = scrollerTemp.data;
        subIndexs[i] != undefined
          ? (scrollerTemp.data = filtered(i, dataTemp))
          : (scrollerTemp.data = []);
        list[i + 1] = scrollerTemp;
      }
      function filtered(i, data) {
        let selected = selectedList[i];
        let regE = new RegExp(`^${selected[filterField]}`);
        return data.filter(item => {
          return regE.test(item[filterField]);
        });
      }
      return list;
    }
  },
  methods: {
    scroll(index, event) {
      let y = event.contentOffset.y;
      this.y[index] = y;
    },
    scrollend(index, event) {
      // console.log("scrollend");
      const CELLHEIGHT = -100;
      let y = this.y[index];
      let length = this.list[index].data.length || 0;
      let subIndex = Math.round(y / CELLHEIGHT) - 1;
      this.selectedList[index] = this.list[index].data[subIndex];
      this.resetSubIndexs(index, subIndex);
      if (y >= 0 || y <= length * CELLHEIGHT) {
        return;
      }
      this.scrollTo(index);
    },
    resetSubIndexs(index, subIndex) {
      let { level } = this;
      if (subIndex < 0 && this.subIndexs[index] != undefined) {
        this.subIndexs = this.subIndexs.slice(0, index);
        return;
      }
      if (subIndex >= 0 && this.subIndexs[index] !== subIndex) {
        let temp = this.subIndexs.slice(0, index);
        temp[index] = subIndex;
        this.subIndexs = temp;
        // index + 1 < level ? this.scrollToTop(index + 1) : "";
        // 不知道为啥，当 scroller 的高度没有撑高起来的话，滚动到顶部会引起 bug ，整个容器会滚动到最下面，还有可能看不见
        return;
      }
    },
    scrollTo(index) {
      // console.log("scrollTo", index);
      let y = this.y[index];
      let subIndex = Math.round(y / -100) - 1;
      let refStr = `scroller${index}item${subIndex}`;
      let subref = this.$refs[refStr][0];
      dom.scrollToElement(subref, {
        offset: -200,
        animated: true
      });
    },
    scrollToTop(index) {
      // console.log("scrollToTop", index);
      let subref = this.$refs[`scroller${index}item-1`][0];
      dom.scrollToElement(subref, {
        offset: -200,
        animated: true
      });
    },
    cancelSelect() {
      this.$emit("selected", {
        status: false
      });
      this.$emit("update:isShow", false);
    },
    ensureSelect() {
      let { selectedList } = this;
      // console.log("ensureSelect");
      this.$emit("selected", {
        status: true,
        data: selectedList
      });
      this.$emit("update:isShow", false);
    }
  }
};
</script>
<style>
.select-wrapper {
  width: 750px;
  height: 580px;
  background-color: #fff;
  overflow: hidden;
  position: fixed;
  left: 0;
  bottom: 0;
}
.selector-indicator {
  position: absolute;
  top: 280px;
  width: 750px;
  height: 100px;
  border-top-color: #d9d9d9;
  border-top-width: 2px;
  border-top-style: solid;
  border-bottom-color: #d9d9d9;
  border-bottom-width: 2px;
  border-bottom-style: solid;
}
.selector-column {
  flex-direction: row;
  margin-top: 80px;
  overflow: hidden;
  flex: 1;
}
.selector {
  flex-direction: column;
}
.selector-top {
  height: 200px;
}
.selector-bottom {
  height: 200px;
}
.txt-wrapper {
  height: 100px;
  width: 40px;
  justify-content: center;
}
.txt {
  text-align: center;
  font-size: 36px;
  color: #666;
  lines: 1;
  text-overflow: clip;
}
.txt-plus {
  color: #000;
}
.selector-operate {
  position: absolute;
  top: 0;
  left: 0;
  width: 750px;
  height: 80px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  border-top-color: #d9d9d9;
  border-top-width: 2px;
  border-top-style: solid;
  border-bottom-color: #d9d9d9;
  border-bottom-width: 2px;
  border-bottom-style: solid;
}
.selector-operate-btn {
  width: 150px;
  height: 80px;
  justify-content: center;
}
.selector-operate-text {
  font-size: 40px;
  text-align: center;
  color: #444;
}
</style>