<template>
  <div class="overflow-hiden table-wrapper" :style="totalStyle">
    <slot class="hidden-columns"></slot>
    <div class="overflow-hiden table-header" :style="headerTotalStyle">
      <div class="overflow-hiden table-header-y table-cell" :style="headerStyle">
        <text class="table-text">{{columnList[0]?columnList[0].label:""}}</text>
      </div>
      <div class="overflow-hiden table-header-tr-wrapper">
        <div class="overflow-hiden table-header-pan" ref="table-header-pan" :style="widthStyle" @touchstart="xHeaderPan">
          <div class="table-cell" @click="orderEmit(columnIndex)" :style="cellStyle[columnIndex]" v-for="(column,columnIndex) in columnList" :key="columnIndex" v-if="!(columnIndex == 0 && fixedHeader)">
            <text class="table-text">{{column.label}}</text>
            <div class="font-wrapper" v-if="order.index == columnIndex">
              <text class="font" v-if="order.flag == 0">&#xe737;</text>
              <text class="font" v-if="order.flag == 1">&#xe739;</text>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="overflow-hiden table-body-wrapper" :style="bodyTotalStyle">
      <div class="overflow-hiden" :style="bodyHeaderStyle">
        <div class="overflow-hiden" ref="table-body-header-pan" @touchstart="yHeaderPan">
          <div class="table-header-y table-cell" :style="cellStyle[0]" v-for="(subData,subIndex) in computeData" :key="subIndex">
            <text class="table-text">{{columnList[0]?subData[columnList[0].prop]:""}}</text>
          </div>
        </div>
      </div>
      <div class="overflow-hiden table-body-body">
        <div class="overflow-hiden table-body-body-pan" ref="table-body-body-pan" @touchstart="bodyPan" :style="widthStyle">
          <div class="table-body-tr" v-for="(subData,subIndex) in computeData" :key="subIndex" :class="[subIndex % 2 == 1 ? 'odd' : '']">
            <div class="table-cell" :style="cellStyle[columnIndex]" v-for="(column,columnIndex) in columnList" :key="columnIndex" v-if="!(columnIndex == 0 && fixedHeader)">
              <text class="table-text">{{subData[columnList[columnIndex].prop]}}</text>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TableStore from "./table-store.js";
export default {
  props: {
    data: {
      type: Object,
      default: {}
    },
    cellHeight: {
      type: Number,
      default: 60
    },
    totalWidth: {
      type: Number,
      default: 750
    },
    totalHeight: {
      type: Number,
      default: 420
    },
    fixedHeader: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let store = new TableStore(this);
    return {
      store,
      y: 0,
      x: 0,
      gesToken: 0,
      isInAnimation: false
    };
  },
  mounted() {
    this.prepare();
  },
  methods: {
    prepare() {
      let xHeaderRef = this.$refs["table-header-pan"].ref;
      let yHeaderRef = this.$refs["table-body-header-pan"].ref;
      let bodyRef = this.$refs["table-body-body-pan"].ref;
      this.prepareBind(xHeaderRef);
      this.prepareBind(yHeaderRef);
      this.prepareBind(bodyRef);
    },
    prepareBind(ref) {
      this.$bindingx.prepare({
        anchor: ref,
        eventType: "pan"
      });
    },
    xHeaderPan() {
      let { isInAnimation, gesToken, x, y } = this;
      if (isInAnimation) return;
      if (gesToken != 0) {
        this.$bindingx.unbind({
          eventType: "pan",
          token: this.gesToken
        });
        this.gesToken = 0;
      }
      let xHeaderRef = this.$refs["table-header-pan"].ref;
      let bodyRef = this.$refs["table-body-body-pan"].ref;
      let gesTokenObj = this.$bindingx.bind(
        {
          anchor: xHeaderRef,
          eventType: "pan",
          props: [
            {
              element: bodyRef,
              property: "transform.translateX",
              expression: `x+${x}+0`
            },
            {
              element: bodyRef,
              property: "transform.translateY",
              expression: `${y}+0`
            },
            {
              element: xHeaderRef,
              property: "transform.translateX",
              expression: `x+${x}+0`
            }
          ]
        },
        e => {
          if (e.state === "end") {
            this.x += e.deltaX;
            this.bindTiming();
          }
        }
      );
      this.gesToken = gesTokenObj.token;
    },
    yHeaderPan() {
      let { isInAnimation, gesToken, x, y } = this;
      if (isInAnimation) return;
      if (gesToken != 0) {
        this.$bindingx.unbind({
          eventType: "pan",
          token: this.gesToken
        });
        this.gesToken = 0;
      }
      let yHeaderRef = this.$refs["table-body-header-pan"].ref;
      let bodyRef = this.$refs["table-body-body-pan"].ref;
      let gesTokenObj = this.$bindingx.bind(
        {
          anchor: yHeaderRef,
          eventType: "pan",
          props: [
            {
              element: bodyRef,
              property: "transform.translateY",
              expression: `y+${y}+0`
            },
            {
              element: bodyRef,
              property: "transform.translateX",
              expression: `${x}+0`
            },
            {
              element: yHeaderRef,
              property: "transform.translateY",
              expression: `y+${y}+0`
            }
          ]
        },
        e => {
          if (e.state === "end") {
            this.y += e.deltaY;
            this.bindTiming();
          }
        }
      );
      this.gesToken = gesTokenObj.token;
    },
    bodyPan() {
      let { x, y, isInAnimation, gesToken } = this;
      if (isInAnimation) return;
      if (gesToken != 0) {
        this.$bindingx.unbind({
          eventType: "pan",
          token: this.gesToken
        });
        this.gesToken = 0;
      }
      let xHeaderRef = this.$refs["table-header-pan"].ref;
      let yHeaderRef = this.$refs["table-body-header-pan"].ref;
      let bodyRef = this.$refs["table-body-body-pan"].ref;
      let gesTokenObj = this.$bindingx.bind(
        {
          anchor: bodyRef,
          eventType: "pan",
          props: [
            {
              element: bodyRef,
              property: "transform.translateX",
              expression: `x+${x}+0`
            },
            {
              element: bodyRef,
              property: "transform.translateY",
              expression: `y+${y}+0`
            },
            {
              element: xHeaderRef,
              property: "transform.translateX",
              expression: `x+${x}+0`
            },
            {
              element: yHeaderRef,
              property: "transform.translateY",
              expression: `y+${y}+0`
            }
          ]
        },
        e => {
          if (e.state === "end") {
            this.x += e.deltaX;
            this.y += e.deltaY;
            this.bindTiming();
          }
        }
      );
      this.gesToken = gesTokenObj.token;
    },
    bindTiming() {
      let {
        columnList,
        computeData,
        fixedHeader,
        totalWidth,
        totalHeight,
        cellHeight,
        x,
        y
      } = this;
      let xHeaderRef = this.$refs["table-header-pan"].ref;
      let yHeaderRef = this.$refs["table-body-header-pan"].ref;
      let bodyRef = this.$refs["table-body-body-pan"].ref;

      let changed_x, final_x, translate_x_origin;
      let changed_y, final_y, translate_y_origin;

      let xLength = columnList.length;
      let yLength = computeData.length;

      let yHeight,
        xWidth = 0;

      let i = 0;
      for (i; i < columnList.length; i++) {
        xWidth += new Number(columnList[i].width);
      }
      yHeight = yLength * cellHeight;

      let maxXLength, maxYLength;

      maxXLength = totalWidth - xWidth;
      maxYLength = totalHeight - yHeight - cellHeight;

      if (x >= 0 || maxXLength >= 0) {
        final_x = 0;
        changed_x = 0 - x;
      } else if (x < maxXLength && maxXLength < 0) {
        final_x = maxXLength;
        changed_x = maxXLength - x;
      } else {
        final_x = x;
        changed_x = 0;
      }

      if (y >= 0 || maxYLength >= 0) {
        final_y = 0;
        changed_y = 0 - y;
      } else if (y < maxYLength && maxYLength < 0) {
        final_y = maxYLength;
        changed_y = maxYLength - y;
      } else {
        final_y = y;
        changed_y = 0;
      }

      if (final_x == x && final_y == y) {
        return;
      }
      this.isInAnimation = true;

      translate_x_origin = `easeOutBack(t,${x},${changed_x},300)`;
      translate_y_origin = `easeOutBack(t,${y},${changed_y},300)`;

      let result = this.$bindingx.bind(
        {
          eventType: "timing",
          exitExpression: "t>300",
          props: [
            {
              element: bodyRef,
              property: "transform.translateX",
              expression: translate_x_origin
            },
            {
              element: xHeaderRef,
              property: "transform.translateX",
              expression: translate_x_origin
            },
            {
              element: bodyRef,
              property: "transform.translateY",
              expression: translate_y_origin
            },
            {
              element: yHeaderRef,
              property: "transform.translateY",
              expression: translate_y_origin
            }
          ]
        },
        e => {
          if (e.state === "end" || e.state === "exit") {
            this.x = final_x;
            this.y = final_y;
            this.isInAnimation = false;
          }
        }
      );
    },
    orderEmit(columnIndex) {
      this.store.orderColum(columnIndex);
    }
  },
  computed: {
    order() {
      return this.store.states.order;
    },
    columnList() {
      return this.store.states.columns;
    },
    computeData() {
      return this.store.states.data;
    },
    totalStyle() {
      let { totalWidth, totalHeight } = this;
      return {
        width: totalWidth + "px",
        height: totalHeight + "px"
      };
    },
    headerTotalStyle() {
      let { totalWidth, cellHeight } = this;
      return {
        width: totalWidth + "px",
        height: cellHeight + "px"
      };
    },
    bodyTotalStyle() {
      let { totalWidth, totalHeight, cellHeight } = this;
      return {
        width: totalWidth + "px",
        height: totalHeight - cellHeight + "px"
      };
    },
    widthStyle() {
      let { columnList, fixedHeader } = this;
      let i,
        width = 0;
      i = fixedHeader ? 1 : 0;
      for (i; i < columnList.length; i++) {
        width += new Number(columnList[i].width);
      }
      return {
        width: width + "px"
      };
    },
    cellStyle() {
      let { columnList, cellHeight } = this;
      let styles = [];
      if (columnList.length == 0) {
        return styles;
      }
      for (let i = 0; i < columnList.length; i++) {
        styles.push({
          width: columnList[i].width + "px",
          height: cellHeight + "px"
        });
      }
      return styles;
    },
    headerStyle() {
      let { fixedHeader, cellStyle, cellHeight } = this;
      return fixedHeader
        ? cellStyle[0]
        : {
            width: "0px",
            height: cellHeight + "px"
          };
    },
    bodyHeaderStyle() {
      let { fixedHeader } = this;
      return fixedHeader
        ? {}
        : {
            width: "0px"
          };
    }
  }
};
</script>
<style>
.table-wrapper {
  flex-direction: column;
  background-color: #eee;
}
.hidden-columns {
  width: 0px;
  height: 0px;
}
.overflow-hiden {
  overflow: hidden;
}
.table-header {
  flex-direction: row;
  flex-wrap: nowrap;
}
.table-header-tr-wrapper {
  flex: 1;
}
.table-header-pan {
  flex-direction: row;
  flex-wrap: nowrap;
}
.table-header-y {
  background-color: cadetblue;
}
.table-body-wrapper {
  flex-direction: row;
  flex-wrap: nowrap;
  flex: 1;
}
.table-body-body {
  flex: 1;
}
.table-body-tr {
  flex-direction: row;
  flex-wrap: nowrap;
}
.table-cell {
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-style: solid;
  border-color: #ddd;
  border-width: 1px;
}
.table-text {
  text-align: center;
  lines: 1;
  text-overflow: ellipsis;
  font-size: 25px;
}
.odd {
  background-color: coral;
}
.font {
  font-family: iconfont;
  font-size: 30px;
}
</style>
