<template>
  <el-row type="flex" class="row-bg-card" justify="space-around">
    <el-col :span="22">
      <el-card shadow="hover" :body-style="{ padding: '0px' }">
        <el-row :gutter="20">
          <el-col
            :span="8"
            v-bind:class="{
              backdrop_col_expand: expand,
              backdrop_col: !expand,
            }"
            v-on:click.native="expand = !expand"
          >
            <transition name="fade" mode="out-in">
              <el-image
                key="backdrop"
                style="width: 100%; height: 100%"
                :src="genUrl(tv.backdrop_path)"
                v-if="!expand"
              />

              <el-image
                key="poster"
                style="width: 100%; height: 100%"
                :src="genUrl(tv.poster_path)"
                v-else
              />
            </transition>
          </el-col>
          <el-col :span="16" class="title_col">
            <el-row
              type="flex"
              justify="space-between"
              v-on:click="expand = !expand"
            >
              <el-col :span="16" class="show_title">
                {{ tv.name }}
              </el-col>
              <el-col :span="8" class="show_rate">
                <el-rate
                  v-model="tv.vote_average"
                  disabled
                  show-score
                  :max="10"
                  text-color="#ff9900"
                  score-template="{value}"
                >
                </el-rate>
              </el-col>
            </el-row>
            <el-row type="flex">
              <span>{{ tv.networks[0].name }}</span>
              <el-divider direction="vertical"></el-divider>
              <span>{{ tv.status }}</span>
            </el-row>
            <el-row class="progress">
              <el-progress
                :text-inside="true"
                :stroke-width="26"
                :percentage="percentage"
              ></el-progress>
            </el-row>
            <el-row class="season_tab" v-if="expand">
              <SeasonTabs v-bind:tvid="tv.id" />
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
</template>

<style>
.row-bg-card {
  /* margin-bottom: 20px; */
}

.backdrop_col {
  width: 300px !important;
  height: 169px !important;
}

.backdrop_col_expand {
  width: 300px !important;
  height: 450px !important;
}

.fade-enter-active {
  transition: opacity 1s;
}

.fade-leave-active {
  transition: opacity 0s;
}

.fade-enter {
  opacity: 0 !important;
}

.fade-leave-to {
  opacity: 0;
}

.title_col {
  width: calc(100% - 300px) !important;
  height: 169px !important;
}

.el-card {
  border-radius: 15px !important;
}

.poster {
  height: 100%;
  display: block;
  float: left;
}

.show_title {
  height: 40px;
  font-size: 32px;
  text-align: left;
  margin-top: 10px;
  margin-bottom: 10px;
}

.show_rate {
  min-width: 380px !important;
  font-size: 32px;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: right !important;
  padding-left: 20px;
  padding-right: 20px;
}

.el-rate__icon {
  font-size: 24px !important;
}

.el-rate__text {
  font-size: 24px !important;
}

.progress {
  padding-top: 33px;
  padding-bottom: 33px;
  height: 93px;
  padding-right: 20px;
}

.season_tab {
  margin-bottom: 10px;
  margin-right: 20px;
}
</style>

<script>
import SeasonTabs from "./SeasonTabs.vue";

export default {
  name: "TVCard",
  props: {
    tvidx: Number,
  },
  components: {
    SeasonTabs,
  },
  data() {
    return {
      expand: false,
      backdrop_url:
        "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
      poster_url: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
      // tv: {},
    };
  },
  computed: {
    tv() {
      return this.$store.getters.getUserData.tvs[this.tvidx];
    },
    percentage(total, watched) {
      total = this.tv.seasons.reduce(
        (acc, season) => acc + season.episode_count,
        0
      );
      watched =
        this.tv.seasons
          .filter((season) => season.isFinished)
          .reduce((acc, season) => acc + season.episode_count, 0) +
        this.tv.seasons
          .filter((season) => !season.isFinished)
          .reduce(
            (acc, season) =>
              acc +
              season.episodes.filter((episode) => episode.isFinished).length,
            0
          );
      // console.log(total, watched);
      return parseInt(((watched / total) * 100).toFixed(0));
    },
  },
  methods: {
    genUrl(path) {
      return `https://image.tmdb.org/t/p/w300${path}`;
    },
  },
  mounted() {},
};
</script>
