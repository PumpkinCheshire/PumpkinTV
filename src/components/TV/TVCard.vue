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
                :src="
                  season_poster ? genUrl(season_poster) : genUrl(tv.poster_path)
                "
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
              <el-col :span="18">
                <el-image
                  :src="
                    tv.networks.length > 0
                      ? genUrl(tv.networks[0].logo_path)
                      : ''
                  "
                  style="width: 48px; height: 16px; padding-right: 5px"
                  fit="scale-down"
                />
                <!-- <span>{{ tv.networks[0].name }}</span> -->
                <el-divider direction="vertical"></el-divider>
                <span>{{ tv.status }}</span>
              </el-col>
              <el-col :span="8" style="text-align: right; padding-right: 20px">
                <el-button
                  icon="el-icon-refresh"
                  style="padding: 5px"
                  circle
                  @click="refresh"
                ></el-button>
                <el-divider direction="vertical"></el-divider>
                <el-popconfirm
                  title="Confirm to delete?"
                  confirm-button-text="Yes"
                  cancel-button-text="Cancel"
                  @confirm="deleteTV"
                >
                  <el-button
                    slot="reference"
                    type="danger"
                    icon="el-icon-delete"
                    style="padding: 5px"
                    circle
                  ></el-button>
                </el-popconfirm>
                <el-divider direction="vertical"></el-divider>
                <span>{{ next.word }}</span>
                <el-divider direction="vertical"></el-divider>
                <el-button
                  icon="el-icon-check"
                  :type="''"
                  circle
                  style="padding: 5px"
                  v-if="next.episode"
                  @click="
                    markWatched(
                      next.episode.season_number,
                      next.episode.episode_number,
                      false
                    )
                  "
                />
              </el-col>
            </el-row>
            <el-row class="progress">
              <el-progress
                :text-inside="true"
                :stroke-width="26"
                :percentage="percentage"
              ></el-progress>
            </el-row>
            <el-row class="season_tab" v-if="expand">
              <SeasonTabs
                v-bind:seasons="tv.seasons"
                v-bind:tvid="tvid"
                @passSeasonPoster="season_poster = $event"
              />
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
</template>


<script>
import SeasonTabs from "./SeasonTabs.vue";

export default {
  name: "TVCard",
  props: {
    tvid: Number,
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
      season_poster:
        "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
    };
  },
  computed: {
    tvidx() {
      return this.$store.getters.getTVIdxByID(this.tvid);
    },
    tv() {
      return this.$store.getters.getTVByIdx(this.tvidx);
    },
    percentage(total, watched) {
      total = this.tv.seasons
        .filter(
          (season) =>
            season.season_number !== 0 && new Date(season.air_date) < new Date()
        )
        .reduce(
          (acc, season) =>
            acc +
            season.episodes.filter(
              (episode) =>
                new Date(episode.air_date ? episode.air_date : "2099-12-31") <
                new Date()
            ).length,
          0
        );

      watched =
        this.tv.seasons
          .filter((season) => season.season_number !== 0 && season.isFinished)
          .reduce((acc, season) => acc + season.episode_count, 0) +
        this.tv.seasons
          .filter((season) => season.season_number !== 0 && !season.isFinished)
          .reduce(
            (acc, season) =>
              acc +
              season.episodes.filter((episode) => episode.isFinished).length,
            0
          );
      this.$store.dispatch("setProgress", {
        tvid: this.tv.id,
        percentage:
          total !== 0 ? parseFloat(((watched / total) * 100).toFixed(2)) : 0,
      });
      return total !== 0 ? parseFloat(((watched / total) * 100).toFixed(2)) : 0;
    },

    next() {
      // this.$store.dispatch("updateTV", {this.tvidx});
      if (this.tv.mode == "finished") {
        return { word: "You are finished", episode: null };
      } else if (this.tv.mode == "following" || this.tv.mode == "upcoming") {
        if (
          this.tv.next_episode_to_air &&
          this.tv.next_episode_to_air.air_date
        ) {
          return {
            word: `Next episode in ${
              this.tv.next_episode_to_air.air_date
            } (${Math.round(
              (new Date(this.tv.next_episode_to_air.air_date).getTime() -
                new Date().getTime()) /
                86400000
            )} Days)`,
            episode: null,
          };
        } else {
          return { word: `Next episode TBD`, episode: null };
        }
      } else if (this.tv.mode == "notstart") {
        return {
          word: `Start Watch S01E01`,
          episode: this.tv.seasons
            .find((season) => season.season_number == 1)
            .episodes.find((episode) => episode.episode_number == 1),
        };
      } else {
        if (
          this.tv.where_am_i.episode_number ==
          this.tv.seasons.find(
            (season) => season.season_number == this.tv.where_am_i.season_number
          ).episode_count
        ) {
          return {
            word: `Watch Next S${this.tv.where_am_i.season_number + 1}E01`,
            episode: this.tv.seasons.find(
              (season) =>
                season.season_number == this.tv.where_am_i.season_number + 1
            ).episodes[0],
          };
        } else {
          return {
            word: `Watch Next S${this.tv.where_am_i.season_number}E${
              this.tv.where_am_i.episode_number < 100
                ? ("0" + (this.tv.where_am_i.episode_number + 1)).slice(-2)
                : this.tv.where_am_i.episode_number + 1
            }`,
            episode: this.tv.seasons
              .find(
                (season) =>
                  season.season_number == this.tv.where_am_i.season_number
              )
              .episodes.find(
                (episode) =>
                  episode.episode_number ==
                  this.tv.where_am_i.episode_number + 1
              ),
          };
        }
      }
      // return { word: "unexpacted", epsiode: null };
    },
  },
  methods: {
    genUrl(path) {
      return `https://image.tmdb.org/t/p/original${path}`;
    },
    markWatched(season_number, episode_number, isAll) {
      // console.log("next", this.next, this.tv.where_am_i);
      this.$store.dispatch("markWatched", {
        isAll: isAll,
        info: {
          tvid: this.tvid,
          season_number: season_number,
          episode_number: episode_number,
        },
      });
    },
    deleteTV() {
      // console.log("delete tv", this.tvid);
      this.$store.dispatch("deleteTV", this.tvid);
    },

    refresh() {
      this.$store.dispatch("updateTV", { tvidx: this.tvidx, force: true });
    },
  },
  mounted() {
    this.tvid = this.$store.getters.getTVIDByIdx(this.tvidx);
    this.$store.dispatch("updateTV", { tvidx: this.tvidx, force: false });
  },
};
</script>

<style>
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
  font-family: "Source Sans Pro", sans-serif !important;
  height: 40px;
  font-weight: bold;
  font-size: 32px;
  text-align: left;
  margin-top: 10px;
  margin-bottom: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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
  padding-top: 25px;
  padding-bottom: 33px;
  height: 75px;
  padding-right: 20px;
}

.season_tab {
  margin-bottom: 10px;
  margin-right: 20px;
}
</style>
