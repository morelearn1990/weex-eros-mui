<template>
  <bmmask class="mask" animation="transition" position="bottom" :duration="300" ref="bmmask" :disableMaskEvent="true">
    <bmpop>
      <div class="select-container">
        <div class="selector-indicator"></div>
        <div class="selector-column">
          <list scroll-direction="vertical" show-scrollbar=false class="selector" :style="widthStyle" v-for="(scroller,sIndex) in list" :key="sIndex" :ref="'list' + sIndex" @scrollend="scrollend(sIndex,$event)" @scrollstart="scrollstart(sIndex)" @scroll="scroll(sIndex,$event)">
            <cell class="selector-top"></cell>
            <cell class="txt-wrapper" :style="widthStyle">
              <text class="txt" :style="widthStyle">请选择{{tabName?scroller[tabName]:""}}</text>
            </cell>
            <cell class="txt-wrapper" :style="widthStyle" v-for="(subItem,subIndex) in scroller.data" :key="subIndex">
              <text class="txt" :style="widthStyle" :class="[subIndexs[sIndex] == subIndex ? 'txt-plus' : '']">{{ subItem[showField] }}</text>
            </cell>
            <cell class="selector-bottom"></cell>
          </list>
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
    </bmpop>
  </bmmask>
</template>
<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: true
    },
    showField: {
      type: String,
      default: "name"
    },
    filterField: {
      type: String,
      default: "id"
    },
    filterData: {
      type: Array,
      default: []
    },
    tabName: {
      type: String,
      default: "tabname"
    }
  },
  data() {
    return {
      y: [],
      subIndexs: [],
      selectedList: [],
      isAnimation: [],
      gesToken: []
    };
  },
  watch: {
    isShow() {
      let { isShow } = this;
      this.subIndexs = [];
      this.y = [];
      this.gesToken = [];
      this.selectedList = [];
      isShow
        ? (this.$refs["bmmask"].show(), this.resetOther(-1))
        : this.$refs["bmmask"].hide();
    }
  },
  computed: {
    level() {
      return this.filterData.length;
    },
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
    scrollend(index, event) {
      let ref = event.target.ref;
      let y = this.y[index];
      let length = this.list[index].data.length || 0;
      const CELLHEIGHT = 100;
      this.resetSubIndex(index, y, length);
      if (y > 0 || y <= -length * CELLHEIGHT) {
        return;
      }
      this.bindTiming(index, ref);
    },
    scrollstart(index) {
      let token = this.gesToken[index];
      if (token) {
        this.$bindingx.unbind({
          token: token,
          eventType: "timing"
        });
        this.gesToken[index] = 0;
      }
    },
    scroll(index, event) {
      this.y[index] = event.contentOffset.y;
    },
    bindTiming(index, ref) {
      let y = this.y[index];
      let content_y_expression;
      // scroll.contentOffsetY 值和 event.contentOffset.y 相反 这儿需要转换成正值
      const CELLHEIGHT = -100;
      let toLength = Math.round(y / CELLHEIGHT) * CELLHEIGHT;
      let changeLength = -toLength + y;
      content_y_expression = `easeOutExpo(t,${-y},${changeLength},200)`;
      let bindObj = this.$bindingx.bind(
        {
          eventType: "timing",
          exitExpression: "t>200",
          props: [
            {
              element: ref,
              property: "scroll.contentOffsetY",
              expression: content_y_expression
            }
          ]
        },
        event => {
          this.gesToken[index] = 0;
        }
      );
      this.gesToken[index] = bindObj.token;
    },
    resetSubIndex(index, y, length) {
      let subIndex;
      let { subIndexs, selectedList, list } = this;
      y > 0
        ? (subIndex = -1)
        : y <= length * -100
          ? (subIndex = length - 1)
          : (subIndex = Math.round(y / -100) - 1);
      if (subIndex < 0) {
        this.subIndexs = subIndexs.slice(0, index);
        this.selectedList = selectedList.slice(0, index);
        this.resetOther(index);
        return;
      }
      if (subIndex >= 0 && subIndexs[index] !== subIndex) {
        let indexTemp = subIndexs.slice(0, index);
        let listTemp = selectedList.slice(0, index);
        indexTemp[index] = subIndex;
        listTemp[index] = list[index].data[subIndex];
        this.subIndexs = indexTemp;
        this.selectedList = listTemp;
        this.resetOther(index);
        return;
      }
    },
    resetOther(index) {
      let { level } = this;
      for (let i = index + 1; i < level; i++) {
        this.y[i] = 0;
        let ref = this.$refs[`list${i}`][0].ref;
        this.bindTiming(i, ref);
      }
    },
    cancelSelect() {
      this.$emit("update:isShow", false);
    },
    ensureSelect() {
      let { selectedList } = this;
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
.mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
}
.select-container {
  width: 750px;
  height: 580px;
  background-color: #fff;
  overflow: hidden;
  left: 0;
  bottom: 0;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
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
  flex: 1;
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
  color: #999;
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
  border-bottom-color: #d9d9d9;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
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