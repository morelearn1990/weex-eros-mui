<template>
  <div class="table-wrapper" :style="totalStyle">
    <div class="table-header">
      <div class="table-cell table-th" :style="cellStyle">
        <text class="table-text">{{data.tableHeader}}</text>
      </div>
      <div class="table-data">
        <scroller show-scrollbar=false scroll-direction="horizontal" offset-accuracy=1 :style="xHeaderStyle" class="table-scroll-x" ref="tbXHeader" @scrollstart="xHeaderScroll">
          <div class="table-cell" :style="cellStyle" v-for="(xHeaderItem,xHeaderIndex) in data.xHeader" :key="xHeaderIndex">
            <text class="table-text">{{xHeaderItem}}</text>
          </div>
        </scroller>
      </div>
    </div>
    <div class="table-body">
      <div class="table-data">
        <scroller show-scrollbar=false offset-accuracy=1 :style="yHeaderStyle" class="table-scroll-y" ref="tbYHeader" @scrollstart="yHeaderScroll">
          <div class="table-tr table-th" v-for="(yHeaderItem,yHeaderIndex) in data.yHeader" :key="yHeaderIndex">
            <div class="table-cell" :style="cellStyle">
              <text class="table-text">{{yHeaderItem}}</text>
            </div>
          </div>
        </scroller>
      </div>
      <div class="table-data">
        <scroller show-scrollbar=false ref="tbYData" class="table-scroll-y" :style="yTableStyle" @scrollstart="yDataScroll">
          <scroller show-scrollbar=false scroll-direction="horizontal" ref="tbXData" class="table-scroll-x" :style="xTableStyle" @scrollstart="xDataScroll">
            <div class="table-data-contain" :style="tableStyle">
              <div class="table-tr" :class="[yHeaderIndex%2 == 1 ? 'table-trodd' : '']" v-for="(yHeaderItem,yHeaderIndex) in data.yHeader" :key="yHeaderIndex">
                <div class="table-cell table-td" :style="cellStyle" v-for="(seriesItem,seriesIndex) in data.series[yHeaderIndex]" :key="seriesIndex">
                  <text class="table-text">{{seriesItem}}</text>
                </div>
              </div>
            </div>
          </scroller>
        </scroller>
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
    }
  },
  data() {
    return {
      gesToken: {}
    };
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
    },
    xHeaderStyle() {
      let { totalWidth, cellWidth, cellHeight } = this;
      return {
        width: totalWidth - cellWidth + "px",
        height: cellHeight + "px"
      };
    },
    yHeaderStyle() {
      let { totalHeight, cellHeight, cellWidth } = this;
      return {
        height: totalHeight - cellHeight + "px",
        width: cellWidth + "px"
      };
    },
    yTableStyle() {
      let { totalHeight, totalWidth, cellHeight, cellWidth } = this;
      return {
        height: totalHeight - cellHeight + "px",
        width: totalWidth - cellWidth + "px"
      };
    },
    xTableStyle() {
      let { totalWidth, cellWidth, cellHeight, data } = this;
      let yLength;
      Array.isArray(data.yHeader)
        ? (yLength = data.yHeader.length)
        : (yLength = 0);
      return {
        width: totalWidth - cellWidth + "px",
        height: yLength * cellHeight + "px"
      };
    },
    tableStyle() {
      let { totalWidth, cellWidth, cellHeight, data } = this;
      let yLength, xLength;
      Array.isArray(data.yHeader)
        ? (yLength = data.yHeader.length)
        : (yLength = 0);
      Array.isArray(data.xHeader)
        ? (xLength = data.xHeader.length)
        : (xLength = 0);
      return {
        width: xLength * cellWidth + "px",
        height: yLength * cellHeight + "px"
      };
    },
    yHeaderRef() {
      return this.$refs.tbYHeader.ref;
    },
    xHeaderRef() {
      return this.$refs.tbXHeader.ref;
    },
    xDataRef() {
      return this.$refs.tbXData.ref;
    },
    yDataRef() {
      return this.$refs.tbYData.ref;
    }
  },
  methods: {
    xHeaderScroll() {
      let { xHeaderRef, xDataRef, gesToken } = this;
      if (gesToken.xData) {
        this.$bindingx.unbind({
          eventType: "scroll",
          token: gesToken.xData
        });
        gesToken.xData = null;
      }
      let gesTokenObj = this.$bindingx.bind({
        anchor: xHeaderRef,
        eventType: "scroll",
        props: [
          {
            element: xDataRef,
            property: "scroll.contentOffsetX",
            expression: `x+0`
          }
        ]
      });
      this.gesToken.xHeader = gesTokenObj.token;
    },
    yHeaderScroll() {
      let { yHeaderRef, yDataRef, gesToken } = this;
      if (gesToken.yData) {
        this.$bindingx.unbind({
          eventType: "scroll",
          token: gesToken.yData
        });
        gesToken.yData = null;
      }
      let gesTokenObj = this.$bindingx.bind({
        anchor: yHeaderRef,
        eventType: "scroll",
        props: [
          {
            element: yDataRef,
            property: "scroll.contentOffsetY",
            expression: `y+0`
          }
        ]
      });
      this.gesToken.yHeader = gesTokenObj.token;
    },
    yDataScroll() {
      let { yHeaderRef, yDataRef, gesToken } = this;
      let gesTokenObj = this.$bindingx.bind({
        anchor: yDataRef,
        eventType: "scroll",
        props: [
          {
            element: yHeaderRef,
            property: "scroll.contentOffsetY",
            expression: `y+0`
          }
        ]
      });
      // this.gesToken.yData = gesTokenObj.token;
    },
    xDataScroll() {
      let { xHeaderRef, xDataRef, gesToken } = this;
      // if (gesToken.xHeader) {
      //   this.$bindingx.unbind({
      //     eventType: "scroll",
      //     token: gesToken.xHeader
      //   });
      //   gesToken.xHeader = null;
      // }
      let gesTokenObj = this.$bindingx.bind({
        anchor: xDataRef,
        eventType: "scroll",
        props: [
          {
            element: xHeaderRef,
            property: "scroll.contentOffsetX",
            expression: `x+0`
          }
        ]
      });
      // this.gesToken.xData = gesTokenObj.token;
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
}
</style>