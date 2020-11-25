<template>
  <el-tabs type="border-card" v-model="activeName" style="season-tab">
    <el-tab-pane
      v-for="season in SeasonList"
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
    tvid: Number,
  },
  components: {
    EpisodeCarousel,
  },

  created() {
    this.SeasonList = this.$store.getters.getTVByID(this.tvid).seasons;

    this.activeName = this.SeasonList.find(
      (season) =>
        season.season_number ===
        this.$store.getters.getTVByID(this.tvid).where_am_i.season_number
    ).name;
  },
  computed: {
    isAllable() {
      return this.$store.getters.isAllable;
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
