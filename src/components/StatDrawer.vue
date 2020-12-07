<template>
  <div>
    <el-image
      :src="avatar"
      class="avatar-bar"
      @click="drawer = true"
    ></el-image>

    <el-drawer
      title="stat"
      :visible.sync="drawer"
      ref="drawer"
      :with-header="false"
    >
      <el-row>
        <el-image :src="avatar" class="avatar-large"></el-image>
      </el-row>
      <el-divider></el-divider>
      <el-row class="drawer-title">
        <span>Episodes Watched</span>
      </el-row>
      <el-row class="drawer-number">
        <span>{{ $store.getters.getTotalWatched }}</span>
      </el-row>
      <el-divider></el-divider>
      <el-row class="drawer-title"><span>TV Added</span></el-row>
      <el-row class="drawer-number"
        ><span>{{ $store.getters.getUserData.tvs.length }}</span></el-row
      >
      <el-row><v-chart :options="tvsChart" /></el-row>
    </el-drawer>
  </div>
</template>

<script>
import "echarts/echarts.all";
// import "echarts/lib/chart/line";
// import "echarts/lib/component/polar";
// import ECharts from "vue-echarts";

export default {
  name: "StatDrawer",
  components: {
    // "v-chart": ECharts,
  },
  data() {
    return {
      drawer: false,
    };
  },
  methods: {
    handleDrawer() {
      console.log(this.drawer);
      this.drawer = true;
    },
  },
  computed: {
    avatar() {
      this.$store.commit("addAvatar");
      return this.$store.getters.getAvatar;
    },

    tvsChart() {
      return {
        // tooltip: {
        //   trigger: "item",
        //   formatter: "{a} <br/>{b}: {c} ({d}%)",
        // },
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
  },
};
</script>

<style>
.avatar-bar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid #f06292;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #f06292;
  margin-top: 15px;
  margin-bottom: 15px;
}

.drawer-title {
  font-size: large;
  font-weight: bold;
}

.drawer-number {
  font-size: 40px;
  font-weight: bold;
}
</style>