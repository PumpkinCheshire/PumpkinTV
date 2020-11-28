<template>
  <el-tabs
    type="border-card"
    v-model="activeName"
    style="season-tab"
    @tab-click="changeSeason"
  >
    <el-tab-pane
      v-for="season in seasons"
      :key="season.id"
      :label="season.name"
      :name="season.name"
      lazy
      ref="tabs"
    >
      <EpisodeCarousel v-bind:season="season" v-bind:tvid="tvid" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import EpisodeCarousel from "./EpisodeCarousel.vue";

export default {
  name: "SeasonTabs",
  props: {
    seasons: Array,
    tvid: Number,
  },
  components: {
    EpisodeCarousel,
  },

  created() {
    // this.seasons = this.$store.getters.getTVByID(this.tvid).seasons;

    this.activeName = this.seasons.find(
      (season) =>
        season.season_number ===
        this.$store.getters.getTVByID(this.tvid).where_am_i.season_number
    ).name;

    this.$emit(
      "passSeasonPoster",
      this.seasons.find(
        (season) =>
          season.season_number ===
          this.$store.getters.getTVByID(this.tvid).where_am_i.season_number
      ).poster_path
    );
  },
  computed: {
    isAllable() {
      return this.$store.getters.isAllable;
    },
  },
  methods: {
    changeSeason(tab) {
      this.$emit(
        "passSeasonPoster",
        this.$store.getters.getTVByID(this.tvid).seasons[tab.index].poster_path
      );
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

.el-tabs__item {
  user-select: none;
}
</style>
