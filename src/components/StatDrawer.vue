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
      <el-carousel
        height="calc(100vh - 167px)"
        direction="vertical"
        :autoplay="true"
      >
        <el-carousel-item key="tv">
          <el-row>
            <el-col :span="12">
              <el-row class="drawer-title">
                <span>TV Watched</span>
              </el-row>
              <el-row class="drawer-number">
                <span>{{ $store.getters.getTotalWatchedTV }}</span>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row class="drawer-title">
                <span>TV Time</span>
              </el-row>
              <el-row class="drawer-number">
                <span>{{ genTime($store.getters.getTVWatchedTime) }}</span>
              </el-row>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row class="drawer-title"><span>TV Added</span></el-row>
          <el-row class="drawer-number"
            ><span>{{ $store.getters.getUserData.tvs.length }}</span></el-row
          >
          <el-row><v-chart :options="tvsChart" /></el-row>
        </el-carousel-item>
        <el-carousel-item key="mv">
          <el-row>
            <el-col :span="12">
              <el-row class="drawer-title">
                <span>Movie Watched</span>
              </el-row>
              <el-row class="drawer-number">
                <span>{{ $store.getters.getTotalWatchedMV }}</span>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row class="drawer-title">
                <span>Movie Time</span>
              </el-row>
              <el-row class="drawer-number">
                <span>{{ genTime($store.getters.getMVWatchedTime) }}</span>
              </el-row>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row class="drawer-title"><span>Movie Added</span></el-row>
          <el-row class="drawer-number"
            ><span>{{ $store.getters.getUserData.mvs.length }}</span></el-row
          >
          <el-row><v-chart :options="mvsChart" /></el-row>
        </el-carousel-item>
      </el-carousel>
    </el-drawer>
  </div>
</template>

<script>
import "echarts/echarts.all";

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

    genTime([month, day, hour]) {
      return `${month}M ${day}D ${hour}H`;
    },
  },
  computed: {
    avatar() {
      this.$store.commit("addAvatar");
      return this.$store.getters.getAvatar;
    },

    tvsChart() {
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

    mvsChart() {
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