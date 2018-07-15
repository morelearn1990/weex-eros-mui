<template>
  <div>
    <gcanvas ref="canvas_holder" v-bind:style="{width:width,height:height,backgroundColor:'rgba(255,255,255,1)'}"></gcanvas>
  </div>
</template>

<script>
const data = [
  {
    name: "芳华",
    percent: 0.4,
    a: "1"
  },
  {
    name: "妖猫传",
    percent: 0.2,
    a: "1"
  },
  {
    name: "机器之血",
    percent: 0.18,
    a: "1"
  },
  {
    name: "心理罪",
    percent: 0.15,
    a: "1"
  },
  {
    name: "寻梦环游记",
    percent: 0.05,
    a: "1"
  },
  {
    name: "其他",
    percent: 0.12,
    a: "1"
  }
];
export default {
  data() {
    return {
      width: 750,
      height: 1000,
      timeStamp: 0
    };
  },
  mounted() {
    let ref = this.$refs.canvas_holder;
    let chart = this.$createChart(ref, {
      padding: [100, "auto", 50, "auto"]
    });
    this.chart = chart;
    chart.source(data, {
      percent: {
        formatter: function formatter(val) {
          return val * 100 + "%";
        }
      }
    });
    chart.legend({
      position: "top",
      align: "center"
    });
    chart.tooltip(false);
    chart.coord("polar", {
      transposed: true,
      radius: 0.85,
      innerRadius: 0.618
    });
    chart.axis(false);
    chart
      .interval()
      .position("a*percent")
      .color("name", [
        "#1890FF",
        "#13C2C2",
        "#2FC25B",
        "#FACC14",
        "#F04864",
        "#8543E0"
      ])
      .adjust("stack")
      .style({
        lineWidth: 1,
        stroke: "#fff",
        lineJoin: "round",
        lineCap: "round"
      });
    // chart.interaction("pie-select", {});
    chart.render();
  },
  methods: {
    // touchstart(ev) {
    //   const { x, y } = this.$F2.Util.createEvent(ev, this.chart);
    //   const lastTimeStamp = this.timeStamp;
    //   const timeStamp = +new Date();
    //   if (timeStamp - lastTimeStamp > 16) {
    //     this.chart.showTooltip({ x, y });
    //     this.timeStamp = timeStamp;
    //   }
    // },
    // touchend(ev) {
    //   // this.chart.hideTooltip();
    // }
  }
};
</script>