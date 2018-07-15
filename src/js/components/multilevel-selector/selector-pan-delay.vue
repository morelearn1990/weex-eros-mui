<template>
  <bmmask class="mask" animation="transition" position="bottom" :duration="300" ref="bmmask" :disableMaskEvent="true">
    <bmpop>
      <div class="select-container">
        <div class="selector-indicator"></div>
        <div class="selector-column">
          <div class="selector" :style="widthStyle" v-for="(scroller,sIndex) in list" :key="sIndex" :ref="'selector' + sIndex" @touchstart="bindPan(sIndex,$event)">
            <div class="txt-wrapper" :style="widthStyle">
              <text class="txt" :style="widthStyle">请选择{{ tabName?scroller[tabName]:''}}</text>
            </div>
            <div class="txt-wrapper" :style="widthStyle" v-for="(subItem,subIndex) in scroller.data" :key="subIndex">
              <text class="txt" :style="widthStyle" :class="[subIndexs[sIndex] == subIndex ? 'txt-plus' : '']">{{ subItem[showField] }}</text>
            </div>
          </div>
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
      default: false
    },
    tabName: {
      type: String,
      default: "tabname"
    },
    showField: {
      type: String
    },
    filterField: {
      type: String,
      default: ""
    },
    filterData: {
      type: [Object],
      default: []
    }
  },
  data() {
    return {
      y: [],
      subIndexs: [],
      selectedList: [],
      gesToken: [],
      isInAnimation: [],
      STEPHEIGHT: -100
    };
  },
  watch: {
    isShow() {
      let { isShow } = this;
      this.subIndexs = [];
      this.selectedList = [];
      this.isInAnimation = [];
      this.gesToken = [];
      isShow
        ? (this.$refs["bmmask"].show(), this.resetOther(-1))
        : this.$refs["bmmask"].hide();
      isShow ? this.parparePan() : "";
    }
  },
  computed: {
    widthStyle() {
      let { level } = this;
      let width = `${level > 0 ? 750 / level : 750}px`;
      return { width };
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
    parparePan() {
      let { level } = this;
      for (let i = 0; i < level; i++) {
        let selectorRef = this.$refs[`selector${i}`][0].ref;
        this.$bindingx.prepare({
          anchor: selectorRef,
          eventType: "pan"
        });
      }
    },
    unbindPan(index) {
      let { gesToken } = this;
      this.$bindingx.unbind({
        eventType: "pan",
        token: gesToken[index]
      });
      this.gesToken[index] = null;
    },
    bindPan(index, event) {
      let { y, selectedList, isInAnimation, gesToken } = this;
      if (index >= 1 && !selectedList[index - 1]) {
        return;
      }
      if (isInAnimation[index]) {
        return;
      }
      if (gesToken[index]) {
        this.unbindPan(index);
      }
      let refStr = `selector${index}`;
      let ref = this.$refs[refStr][0].ref;
      let expression = y[index] ? `y+${y[index]}+0` : `y+0`;
      let startTime, endTime;
      startTime = Date.now();
      let gesTokenObj = this.$bindingx.bind(
        {
          anchor: ref,
          eventType: "pan",
          props: [
            {
              element: ref,
              property: "transform.translateY",
              expression
            }
          ]
        },
        e => {
          if (e.state == "end" || e.state == "exit" || e.state == "cancel") {
            this.gesToken[index] = null;
            endTime = Date.now();
            this.y[index]
              ? (this.y[index] += e.deltaY)
              : (this.y[index] = e.deltaY);
            this.bindDelayeTiming(index, startTime, endTime, e.deltaY);
          }
        }
      );
      this.gesToken[index] = gesTokenObj.token;
    },
    bindDelayeTiming(index, startTime, endTime, deltaY) {
      let { y, list, STEPHEIGHT } = this;
      let selectorRef,
        listLength,
        totalHeight,
        changed_y,
        final_y,
        translate_y_origin,
        yCurrent;
      let t = 300; // 默认动画时长200ms
      this.isInAnimation[index] = true;

      selectorRef = this.$refs[`selector${index}`][0].ref;
      listLength = list[index].data.length || 0;
      totalHeight = listLength * STEPHEIGHT;

      yCurrent = y[index];
      if (yCurrent <= totalHeight) {
        final_y = totalHeight;
        changed_y = final_y - yCurrent;
      } else if (yCurrent > 0) {
        final_y = 0;
        changed_y = final_y - yCurrent;
      } else {
        let continueTime, velocity, distance, preDistance, yRemainder;
        continueTime = endTime - startTime;
        velocity = deltaY / continueTime / 2;
        distance = velocity * 2 * t;
        preDistance = yCurrent + distance;
        yRemainder = preDistance % STEPHEIGHT;
        changed_y =
          preDistance > 0
            ? 0 - yCurrent
            : preDistance <= totalHeight
              ? totalHeight - yCurrent
              : yRemainder > STEPHEIGHT / 2
                ? distance - yRemainder
                : distance + STEPHEIGHT - yRemainder;
        final_y =
          preDistance > 0
            ? 0
            : preDistance <= totalHeight
              ? totalHeight
              : yRemainder > STEPHEIGHT / 2
                ? preDistance - yRemainder
                : preDistance + STEPHEIGHT - yRemainder;
        continueTime = velocity = distance = preDistance = yRemainder = null;
      }
      listLength = totalHeight = null;

      translate_y_origin = `easeOutQuad(t,${yCurrent},${changed_y},${t})`;
      let subIndex = Math.round(Math.abs(final_y / STEPHEIGHT)) - 1;
      this.resetSubIndex(index, subIndex);
      let result = this.$bindingx.bind(
        {
          eventType: "timing",
          exitExpression: `t>${t}`,
          props: [
            {
              element: selectorRef,
              property: "transform.translateY",
              expression: translate_y_origin
            }
          ]
        },
        e => {
          if (e.state === "end" || e.state === "exit" || e.state === "cancel") {
            this.y[index] = final_y;
            this.isInAnimation[index] = false;
          }
        }
      );
    },
    resetSubIndex(index, subIndex) {
      let { subIndexs, selectedList, list } = this;
      if (subIndex < 0) {
        this.resetOther(index);
        this.subIndexs = subIndexs.slice(0, index);
        this.selectedList = selectedList.slice(0, index);
        return;
      }
      if (subIndex >= 0 && subIndexs[index] !== subIndex) {
        this.resetOther(index);
        let indexTemp = subIndexs.slice(0, index);
        let listTemp = selectedList.slice(0, index);
        indexTemp[index] = subIndex;
        listTemp[index] = list[index].data[subIndex];
        this.subIndexs = indexTemp;
        this.selectedList = listTemp;
        indexTemp = listTemp = null;
        return;
      }
    },
    resetOther(index) {
      let { level } = this;
      for (let i = index + 1; i < level; i++) {
        this.resetTiming(i);
      }
    },
    resetTiming(index) {
      let { y } = this;
      if (!y[index]) {
        return;
      }
      let subY = y[index];
      this.isInAnimation[index] = true;
      let selectorRef = this.$refs[`selector${index}`][0].ref;
      let translate_y_origin = `easeOutCubic(t,${subY},${-subY},200)`;
      let result = this.$bindingx.bind(
        {
          eventType: "timing",
          exitExpression: "t>200",
          props: [
            {
              element: selectorRef,
              property: "transform.translateY",
              expression: translate_y_origin
            }
          ]
        },
        e => {
          if (e.state === "end" || e.state === "exit" || e.state === "cancel") {
            this.y[index] = 0;
            this.isInAnimation[index] = false;
          }
        }
      );
    },
    cancelSelect() {
      this.$emit("selected", {
        status: false
      });
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
  padding-top: 200px;
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