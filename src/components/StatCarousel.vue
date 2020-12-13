<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-row class="drawer-title">
          <span>{{ title }} Watched</span>
        </el-row>
        <el-row class="drawer-number">
          <span>{{
            tmode
              ? $store.getters.getTotalWatchedTV
              : $store.getters.getTotalWatchedMV
          }}</span>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row class="drawer-title">
          <span>{{ title }} Time</span>
        </el-row>
        <el-row class="drawer-number">
          <span>{{ genTime(watchedTime) }}</span>
        </el-row>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-carousel height="500px" :autoplay="false">
      <el-carousel-item key="added">
        <el-row class="drawer-title"
          ><span>{{ title }} Added</span></el-row
        >
        <el-row class="drawer-number"
          ><span>{{ number }}</span></el-row
        >
        <el-row
          ><v-chart :options="tmode ? tvsAddedChart : mvsAddedChart"
        /></el-row>
      </el-carousel-item>
      <el-carousel-item key="time">
        <el-row class="drawer-title"
          ><span>{{ title }} Time per </span
          ><el-button type="text" class="drawer-title" @click="changeScale">{{
            scale[scaleidx]
          }}</el-button></el-row
        >
        <el-row
          ><v-chart :options="tmode ? tvsTimeChart : mvsTimeChart"
        /></el-row>
      </el-carousel-item>
      <el-carousel-item key="number">
        <el-row class="drawer-title"
          ><span>{{ title }} Number per </span
          ><el-button type="text" class="drawer-title" @click="changeScale">{{
            scale[scaleidx]
          }}</el-button></el-row
        >
        <el-row
          ><v-chart :options="tmode ? tvsNumberChart : mvsNumberChart"
        /></el-row>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import "echarts/lib/chart/pie";
import "echarts/lib/chart/bar";

Date.prototype.getWeekNumber = function () {
  var d = new Date(
    Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
  );
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

export default {
  name: "StatCarousel",
  data() {
    return {
      scaleidx: 0,
      scale: ["Week", "Month", "Year"],
      months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    };
  },
  props: {
    tmode: Boolean,
  },
  methods: {
    changeScale() {
      this.scaleidx += 1;
      if (this.scaleidx > 2) {
        this.scaleidx = 0;
      }
      return this.scaleidx;
    },
    genTime([month, day, hour]) {
      return `${month}M ${day}D ${hour}H`;
    },

    getMonthIdx(month) {
      if (month > 11) {
        month -= 12;
      } else if (month < 0) {
        month += 12;
      }
      return month;
    },

    getWeekIdx(week) {
      if (week > 52) {
        week -= 52;
      } else if (week < 0) {
        week += 52;
      }
      return week;
    },
  },
  computed: {
    title() {
      return this.tmode ? "TV" : "Movie";
    },
    number() {
      return this.tmode
        ? this.$store.getters.getTVNumber
        : this.$store.getters.getMVNumber;
    },
    watchedTime() {
      return this.tmode
        ? this.$store.getters.getTVWatchedTime
        : this.$store.getters.getMVWatchedTime;
    },
    tvsAddedChart() {
      return {
        series: {
          name: "Added Shows",
          type: "pie",
          radius: ["60%", "80%"],
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "30",
              fontWeight: "bold",
            },
          },
          data: [
            {
              name: `Catching \n ${
                this.$store.getters.getTVsByMode("catching").length
              }`,
              value: this.$store.getters.getTVsByMode("catching").length,
              //   children: [],
            },
            {
              name: `Following \n ${
                this.$store.getters.getTVsByMode("following").length
              }`,
              value: this.$store.getters.getTVsByMode("following").length,
              //   children: [],
            },
            {
              name: `Finished \n ${
                this.$store.getters.getTVsByMode("finished").length
              }`,
              value: this.$store.getters.getTVsByMode("finished").length,
              //   children: [],
            },
            {
              name: `Waiting \n ${
                this.$store.getters.getTVsByMode("Waiting").length
              }`,
              value: this.$store.getters.getTVsByMode("Waiting").length,
              //   children: [],
            },
            {
              name: `Others \n ${
                this.$store.getters.getTVsByMode("notstart").length +
                this.$store.getters.getTVsByMode("upcoming").length +
                this.$store.getters.getTVsByMode("stopped").length
              }`,
              value:
                this.$store.getters.getTVsByMode("notstart").length +
                this.$store.getters.getTVsByMode("upcoming").length +
                this.$store.getters.getTVsByMode("stopped").length,
              //   children: [],
            },
          ],
        },
      };
    },

    mvsAddedChart() {
      return {
        series: {
          name: "Added Movies",
          type: "pie",
          radius: ["60%", "80%"],
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "30",
              fontWeight: "bold",
            },
          },
          data: [
            {
              name: `Watched \n ${
                this.$store.getters.getMVsByMode("watched").length
              }`,
              value: this.$store.getters.getMVsByMode("watched").length,
              //   children: [],
            },
            {
              name: `Listed \n ${
                this.$store.getters.getMVsByMode("listed").length
              }`,
              value: this.$store.getters.getMVsByMode("listed").length,
              //   children: [],
            },
            {
              name: `Upcoming \n ${
                this.$store.getters.getMVsByMode("upcoming").length
              }`,
              value: this.$store.getters.getMVsByMode("upcoming").length,
              //   children: [],
            },
          ],
        },
      };
    },

    mvsTimeChart() {
      return {
        xAxis: {
          data: Array.from({ length: 12 }, (v, k) =>
            this.scaleidx == 0
              ? this.getWeekIdx(new Date().getWeekNumber() - 11 + k) + 1
              : this.scaleidx == 1
              ? this.months[this.getMonthIdx(new Date().getMonth() - 11 + k)]
              : new Date().getFullYear() - 11 + k
          ),
          splitLine: {
            show: false,
          },
        },
        yAxis: {},
        series: {
          name: "time",
          type: "bar",
          label: {
            show: true,
            position: "top",
          },
          data: Array.from({ length: 12 }, (v, k) =>
            this.$store.getters.getMVWatchedTimeBy(
              this.scaleidx,
              this.scaleidx == 0
                ? this.getWeekIdx(new Date().getWeekNumber() - 11 + k)
                : this.scaleidx == 1
                ? this.getMonthIdx(new Date().getMonth() - 11 + k)
                : new Date().getFullYear() - 11 + k
            )
          ),
        },
      };
    },

    tvsTimeChart() {
      return {
        xAxis: {
          data: Array.from({ length: 12 }, (v, k) =>
            this.scaleidx == 0
              ? this.getWeekIdx(new Date().getWeekNumber() - 11 + k) + 1
              : this.scaleidx == 1
              ? this.months[this.getMonthIdx(new Date().getMonth() - 11 + k)]
              : new Date().getFullYear() - 11 + k
          ),
          splitLine: {
            show: false,
          },
        },
        yAxis: {},
        series: {
          name: "time",
          type: "bar",
          label: {
            show: true,
            position: "top",
          },
          data: Array.from({ length: 12 }, (v, k) =>
            this.$store.getters.getTVWatchedTimeBy(
              this.scaleidx,
              this.scaleidx == 0
                ? this.getWeekIdx(new Date().getWeekNumber() - 11 + k)
                : this.scaleidx == 1
                ? this.getMonthIdx(new Date().getMonth() - 11 + k)
                : new Date().getFullYear() - 11 + k
            )
          ),
        },
      };
    },

    mvsNumberChart() {
      return {
        xAxis: {
          data: Array.from({ length: 12 }, (v, k) =>
            this.scaleidx == 0
              ? this.getWeekIdx(new Date().getWeekNumber() - 11 + k) + 1
              : this.scaleidx == 1
              ? this.months[this.getMonthIdx(new Date().getMonth() - 11 + k)]
              : new Date().getFullYear() - 11 + k
          ),
          splitLine: {
            show: false,
          },
        },
        yAxis: {},
        series: {
          name: "time",
          type: "bar",
          label: {
            show: true,
            position: "top",
          },
          data: Array.from({ length: 12 }, (v, k) =>
            this.$store.getters.getMVWatchedNumberBy(
              this.scaleidx,
              this.scaleidx == 0
                ? this.getWeekIdx(new Date().getWeekNumber() - 11 + k)
                : this.scaleidx == 1
                ? this.getMonthIdx(new Date().getMonth() - 11 + k)
                : new Date().getFullYear() - 11 + k
            )
          ),
        },
      };
    },

    tvsNumberChart() {
      return {
        xAxis: {
          data: Array.from({ length: 12 }, (v, k) =>
            this.scaleidx == 0
              ? this.getWeekIdx(new Date().getWeekNumber() - 11 + k) + 1
              : this.scaleidx == 1
              ? this.months[this.getMonthIdx(new Date().getMonth() - 11 + k)]
              : new Date().getFullYear() - 11 + k
          ),
          splitLine: {
            show: false,
          },
        },
        yAxis: {},
        series: {
          name: "time",
          type: "bar",
          label: {
            show: true,
            position: "top",
          },
          data: Array.from({ length: 12 }, (v, k) =>
            this.$store.getters.getTVWatchedNumberBy(
              this.scaleidx,
              this.scaleidx == 0
                ? this.getWeekIdx(new Date().getWeekNumber() - 11 + k)
                : this.scaleidx == 1
                ? this.getMonthIdx(new Date().getMonth() - 11 + k)
                : new Date().getFullYear() - 11 + k
            )
          ),
        },
      };
    },
  },
};
</script>

<style>
</style>