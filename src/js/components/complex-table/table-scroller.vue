<template>
  <div class="table-wrapper" :style="totalStyle">
    <slot class="hidden-columns"></slot>
    <div class="table-header">
      <div class="cellCommon cellDefault" :style="cellWidthStyle(0)" v-if="fixedHeader">
        <text class="text">{{columnList[0].label}}</text>
      </div>
      <scroller class="table-headerx-scroll-wrapper" scroll-direction="horizontal" show-scrollbar=false :style="widthTotalStyle">
        <div :class="['cellCommon','labelCellDefault',labelCellClass(index)]" :style="cellWidthStyle(index)" v-for="(column,index) in columnList" :key="index">
          <text class="text">{{column.label}}</text>
        </div>
      </scroller>
    </div>
    <div class="table-body">
      <scroller class="table-headery-scroll-wrapper" scroll-direction="vertical" show-scrollbar=false v-if="fixedHeader"></scroller>
      <scroller class="table-bodyx-scroll-wrapper" scroll-direction="vertical" show-scrollbar=false>
        <scroller class="table-bodyy-scroll-wrapper" scroll-direction="horizontal" show-scrollbar=false>
          <div class="rowCommon" :class="['']" :style="widthTotalStyle" v-for="(subData,index) in data" :key="index">
            <div :class="['cellCommon',cellClass(columnIndex)]" :style="cellWidthStyle(columnIndex)" v-for="(column,columnIndex) in columnList" :key="columnIndex">
              <text class="text">{{subData[column.prop]}}</text>
            </div>
          </div>
        </scroller>
      </scroller>
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
    fixedHeader: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let store = new TableStore(this);
    return {
      store
    };
  },
  mounted() {
    console.log(JSON.stringify(this.columnList));
  },
  computed: {
    columnList() {
      return this.store.states.columns;
    },
    widthTotalStyle() {
      let { totalWidth, fixedHeader, cellHeight, columnList } = this;
      let width = fixedHeader ? totalWidth - columnList[0].width : totalWidth;
      return {
        width: width + "px",
        height: cellHeight + "px"
      };
    }
  },
  methods: {
    cellWidthStyle(index) {
      let { width } = this.columnList[index];
      return {
        width: width + "px"
      };
    },
    cellClass(index) {
      let { className } = this.columnList[index];
      return className;
    },
    labelCellClass(index) {
      let { labelClassName } = this.columnList[index];
      return labelClassName;
    }
  }
};
</script>

<style>
.table-header-scroll-wrapper {
  flex-direction: row;
  flex-wrap: nowrap;
}
.text {
  text-align: center;
}
.cellCommon {
  justify-content: center;
  align-items: center;
  border-style: solid;
  border-color: #ddd;
  border-width: 1px;
}
.labelCellDefault {
  background-color: #eee;
}
.headerCellDefault {
  background-color: cadetblue;
}
</style>
