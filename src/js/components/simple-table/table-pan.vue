<template>
  <div class="table-wrapper" :style="totalStyle">
    <div class="table-header">
      <div class="table-cell table-th" :style="cellStyle" v-if="data.tableHeader">
        <text class="table-text">{{data.tableHeader}}</text>
      </div>
      <div class="table-data">
        <div class="table-scroll-x" ref="tbXHeader" @touchstart="tbXHeaderPan">
          <div class="table-cell" :style="cellStyle" v-if="showIndex">
            <text class="table-text">序号</text>
          </div>
          <div class="table-cell" :style="cellStyle" v-for="(xHeaderItem,xHeaderIndex) in data.xHeader" :key="xHeaderIndex">
            <text class="table-text">{{xHeaderItem}}</text>
          </div>
        </div>
      </div>
    </div>
    <div class="table-body">
      <div class="table-data">
        <div class="table-scroll-y" ref="tbYHeader" @touchstart="tbYHeaderPan">
          <div class="table-tr table-th" v-for="(yHeaderItem,yHeaderIndex) in data.yHeader" :key="yHeaderIndex">
            <div class="table-cell" :style="cellStyle">
              <text class="table-text">{{yHeaderItem}}</text>
            </div>
          </div>
        </div>
      </div>
      <div class="table-data">
        <div ref="tbData" @touchstart="tbDataPan">
          <div class="table-tr" :class="[yHeaderIndex%2 == 1 ? 'table-trodd' : '']" v-for="(yHeaderItem,yHeaderIndex) in data.yHeader" :key="yHeaderIndex">
            <div class="table-cell table-td" :style="cellStyle" v-if="showIndex">
              <text class="table-text">{{yHeaderIndex}}</text>
            </div>
            <div class="table-cell table-td" :style="cellStyle" v-for="(seriesItem,seriesIndex) in data.series[yHeaderIndex]" :key="seriesIndex">
              <text class="table-text">{{seriesItem}}</text>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: {}
    },
    cellWidth: {
      type: Number,
      default: 200
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
    showIndex: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isInAnimation: false,
      gesToken: 0,
      x: 0,
      y: 0
    };
  },
  mounted() {
    let tbDataRef = this.$refs.tbData.ref;
    let tbXHeaderRef = this.$refs.tbXHeader.ref;
    let tbYHeaderRef = this.$refs.tbYHeader.ref;
    this.prepare(tbDataRef);
    this.prepare(tbXHeaderRef);
    this.prepare(tbYHeaderRef);
  },
  computed: {
    cellStyle() {
      let { cellWidth, cellHeight } = this;
      return {
        height: cellHeight + "px",
        width: cellWidth + "px"
      };
    },
    totalStyle() {
      let { totalWidth, totalHeight } = this;
      return {
        width: totalWidth + "px",
        height: totalHeight + "px"
      };
    }
  },
  methods: {
    prepare(ref) {
      // 在 mounted 时 prepare 一下 pan 手势，能让操作更顺畅
      this.$bindingx.prepare({
        anchor: ref,
        eventType: "pan"
      });
    },
    tbXHeaderPan() {
      if (this.isInAnimation) return;
      if (this.gesToken != 0) {
        this.$bindingx.unbind({
          eventType: "pan",
          token: this.gesToken
        });
        this.gesToken = 0;
      }
      let tbDataRef = this.$refs.tbData.ref;
      let tbXHeaderRef = this.$refs.tbXHeader.ref;
      let gesTokenObj = this.$bindingx.bind(
        {
          anchor: tbXHeaderRef,
          eventType: "pan",
          props: [
            {
              element: tbDataRef,
              property: "transform.translateX",
              expression: `x+${this.x}+0`
            },
            {
              element: tbDataRef,
              property: "transform.translateY",
              expression: `${this.Y}+0`
            },
            {
              element: tbXHeaderRef,
              property: "transform.translateX",
              expression: `x+${this.x}+0`
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
    tbYHeaderPan() {
      if (this.isInAnimation) return;
      if (this.gesToken != 0) {
        this.$bindingx.unbind({
          eventType: "pan",
          token: this.gesToken
        });
        this.gesToken = 0;
      }
      let tbDataRef = this.$refs.tbData.ref;
      let tbYHeaderRef = this.$refs.tbYHeader.ref;
      let gesTokenObj = this.$bindingx.bind(
        {
          anchor: tbYHeaderRef,
          eventType: "pan",
          props: [
            {
              element: tbDataRef,
              property: "transform.translateY",
              expression: `y+${this.y}+0`
            },
            {
              element: tbDataRef,
              property: "transform.translateX",
              expression: `${this.x}+0`
            },
            {
              element: tbYHeaderRef,
              property: "transform.translateY",
              expression: `y+${this.y}+0`
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
    tbDataPan() {
      if (this.isInAnimation) return;
      let tbDataRef = this.$refs.tbData.ref;
      let tbXHeaderRef = this.$refs.tbXHeader.ref;
      let tbYHeaderRef = this.$refs.tbYHeader.ref;
      let gesTokenObj = this.$bindingx.bind(
        {
          anchor: tbDataRef,
          eventType: "pan",
          props: [
            {
              element: tbDataRef,
              property: "transform.translateX",
              expression: `x+${this.x}+0`
            },
            {
              element: tbDataRef,
              property: "transform.translateY",
              expression: `y+${this.y}+0`
            },
            {
              element: tbXHeaderRef,
              property: "transform.translateX",
              expression: `x+${this.x}+0`
            },
            {
              element: tbYHeaderRef,
              property: "transform.translateY",
              expression: `y+${this.y}+0`
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
      let tbDataRef = this.$refs.tbData.ref;
      let tbXHeaderRef = this.$refs.tbXHeader.ref;
      let tbYHeaderRef = this.$refs.tbYHeader.ref;

      let changed_x, final_x, translate_x_origin;
      let changed_y, final_y, translate_y_origin;

      let xHeader = this.data.xHeader || [];
      let yHeader = this.data.yHeader || [];

      let { totalWidth, cellWidth, cellHeight, totalHeight } = this;

      let xWidth, yHeight;

      this.showIndex
        ? (xWidth = (xHeader.length + 1) * cellWidth)
        : (xWidth = xHeader.length * cellWidth);
      yHeight = yHeader.length * cellHeight;

      let maxXLength, maxYLength;

      maxXLength = totalWidth - xWidth - cellWidth;
      maxYLength = totalHeight - yHeight - cellHeight;

      if (this.x >= 0 || maxXLength >= 0) {
        final_x = 0;
        changed_x = 0 - this.x;
      } else if (this.x < maxXLength && maxXLength < 0) {
        final_x = maxXLength;
        changed_x = maxXLength - this.x;
      } else {
        final_x = this.x;
        changed_x = 0;
      }

      if (this.y >= 0 || maxYLength >= 0) {
        final_y = 0;
        changed_y = 0 - this.y;
      } else if (this.y < maxYLength && maxYLength < 0) {
        final_y = maxYLength;
        changed_y = maxYLength - this.y;
      } else {
        final_y = this.y;
        changed_y = 0;
      }

      if (final_x == this.x && final_y == this.y) {
        return;
      }
      this.isInAnimation = true;

      translate_x_origin = `easeOutBack(t,${this.x},${changed_x},300)`;
      translate_y_origin = `easeOutBack(t,${this.y},${changed_y},300)`;

      let result = this.$bindingx.bind(
        {
          eventType: "timing",
          exitExpression: "t>300",
          props: [
            {
              element: tbDataRef,
              property: "transform.translateX",
              expression: translate_x_origin
            },
            {
              element: tbXHeaderRef,
              property: "transform.translateX",
              expression: translate_x_origin
            },
            {
              element: tbDataRef,
              property: "transform.translateY",
              expression: translate_y_origin
            },
            {
              element: tbYHeaderRef,
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
    }
  }
};
</script>

<style>
.table-wrapper {
  flex-direction: column;
  overflow: hidden;
  background-color: #eee;
}
.table-header {
  flex-direction: row;
  flex-wrap: nowrap;
  overflow: hidden;
}
.table-scroll-x {
  flex-direction: row;
  flex-wrap: nowrap;
}
.table-scroll-y {
  flex-direction: column;
}
.table-data {
  overflow: hidden;
}
.table-body {
  flex-direction: row;
  flex-wrap: nowrap;
  overflow: hidden;
}
.table-tr {
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: #fff;
}
.table-trodd {
  background-color: bisque;
}
.table-th {
  background-color: cadetblue;
}
.table-cell {
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
</style>

