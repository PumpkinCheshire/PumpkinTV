<template>
  <el-tabs
    type="border-card"
    v-model="activeName"
    @tab-click="handleClick"
    style="season-tab"
    ref="tab"
  >
    <el-tab-pane
      v-for="season in SeasonList"
      :key="season.id"
      :label="season.name"
      :name="season.name"
      lazy
      ref="tabs"
    >
      <el-carousel
        :autoplay="false"
        :loop="false"
        type="card"
        height="175px"
        :initial-index="slide - 1"
        indicator-position="none"
        @change="carouselSet"
        ref="carousel"
      >
        <!-- <lazy-component @show="lazyShow"> -->
        <el-carousel-item
          v-for="episode in season.episodes"
          :key="'carousel' + episode.id"
          style="
            background-color: grey;
            border-radius: 20px;
            border: transparent;
          "
        >
          <!-- <img
            :src="getImg(episode)"
            style="width: 100%; height: 100%; object-fit: cover"

          /> -->
          <el-card
            class="episode-card"
            v-bind:style="`background-image: -webkit-cross-fade(url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=),url(https://image.tmdb.org/t/p/original${episode.still_path}),40%);border:transparent;background-size:cover;background-repeat:no-repeat`"
            v-if="
              episode.episode_number >= slide - 2 &&
              episode.episode_number <= slide + 2
            "
          >
            <el-row class="episode-card-title">
              <span
                >{{ "S" + getFormattedNumber(episode.season_number) }}
              </span>
              <el-divider direction="vertical" class="SE-divider"></el-divider>
              <span>
                {{ "E" + getFormattedNumber(episode.episode_number) }}
              </span>
              <span
                >({{
                  getTotalNumber(episode.season_number, episode.total_number)
                }})</span
              >
              <el-divider
                direction="vertical"
                class="title-divider"
              ></el-divider>
            </el-row>
            <el-row style="padding: 5px 0">
              <span>{{ episode.name }}</span>
              <el-divider
                direction="vertical"
                class="title-divider"
              ></el-divider>
              <i class="el-icon-date" style="margin-right: 5px" />
              <span>{{ episode.air_date }}</span>
            </el-row>
            <el-row>
              <el-popconfirm
                confirm-button-text="Yes"
                cancel-button-text="No"
                title="Mark all previous episodes as watched？"
                v-if="
                  isAllable({
                    tvid: tvid,
                    season_number: season.season_number,
                    episode_number: episode.episode_number,
                  })
                "
                @confirm="
                  markWatched(
                    season.season_number,
                    episode.episode_number,
                    true
                  )
                "
                @cancel="
                  markWatched(
                    season.season_number,
                    episode.episode_number,
                    false
                  )
                "
              >
                <el-button
                  slot="reference"
                  icon="el-icon-check"
                  :type="episode.isFinished ? 'primary' : ''"
                  circle
                  :data-season="season.season_number"
                  :data-episode="episode.episode_number"
                />
              </el-popconfirm>
              <el-button
                icon="el-icon-check"
                :type="episode.isFinished ? 'primary' : ''"
                circle
                @click="
                  markWatched(
                    season.season_number,
                    episode.episode_number,
                    false
                  )
                "
                v-else
              />
            </el-row>
          </el-card>
        </el-carousel-item>
      </el-carousel>
      <el-slider
        v-model="slide"
        :step="1"
        :max="slideMax"
        :min="1"
        @input="setActiveItem"
        ref="slider"
        class="episode-slider"
        show-input
      >
      </el-slider>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: "SeasonTabs",
  props: {
    tvid: Number,
  },
  data() {
    return {
      activeName: "Season 1",
      tab_idx: 1,
      slide: 1,
    };
  },
  mounted() {
    this.tab = this.$refs.tabs.find((tab) => tab.active);
    console.log(this.tab);
  },
  created() {
    this.SeasonList = this.$store.getters.getUserData.tvs.find(
      (tv) => tv.id === this.tvid
    ).seasons;
  },
  computed: {
    slideMax() {
      return this.SeasonList[this.tab_idx].episode_count;
    },
    isAllable() {
      return this.$store.getters.isAllable;
    },
  },
  methods: {
    getImg(episode) {
      return `https://image.tmdb.org/t/p/w600${episode.still_path}`;
    },
    getFormattedNumber(number) {
      if (number > 9) {
        return `${number}`;
      } else {
        return `${"0" + number}`;
      }
    },
    getTotalNumber(season_number, total_number) {
      if (season_number === 0) {
        return `SP${this.getFormattedNumber(total_number)}`;
      } else {
        return `E${this.getFormattedNumber(total_number)}`;
      }
    },
    updateCarousel() {
      this.carousel = this.tab.$children[0];
    },
    handleClick(tab) {
      console.log(tab);
      this.tab_idx = tab.index;
      this.tab = tab;
      this.carousel = this.tab.$children[0];
      this.carousel.setActiveItem(this.slide - 1);
    },
    setActiveItem(index) {
      this.updateCarousel();
      console.log("Now set slider", index);
      this.carousel.setActiveItem(index - 1);
    },
    carouselSet(now) {
      console.log("Now set carousel", now);
      this.slide = now + 1;
    },
    markWatched(season_number, episode_number, isAll) {
      this.$store.commit("markWatched", {
        isAll: isAll,
        info: {
          tvid: this.tvid,
          season_number: season_number,
          episode_number: episode_number,
        },
      });
      // console.log(event);
      // if (Object.keys(event.target.dataset).length === 0) {
      //   let info = {
      //     tvid: this.tvid,
      //     season_number: parseInt(event.target.parentElement.dataset.season),
      //     episode_number: parseInt(event.target.parentElement.dataset.episode),
      //   };
      //   this.$store.commit("markWatched", {
      //     isAll: this.$store.getters.isAllable(info),
      //     info: info,
      //   });
      // } else {
      //   let info = {
      //     tvid: this.tvid,
      //     season_number: parseInt(event.target.dataset.season),
      //     episode_number: parseInt(event.target.dataset.episode),
      //   };
      //   console.log("I am button");
      //   this.$store.commit("markWatched", {
      //     isAll: this.$store.getters.isAllable(info),
      //     info: info,
      //   });
      // }
    },
  },
};
</script>

<style>
.el-tabs--border-card {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.el-tabs__content {
  padding-bottom: 5px !important;
}

.episode-card {
  height: 175px;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 4px;
}

.episode-card-title {
  font-size: 16pt;
  font-weight: bold;
}

.SE-divider {
  background-color: black !important;
  margin: 0 -2px !important  ;
}

.title-divider {
  background-color: transparent !important;
}
</style>
