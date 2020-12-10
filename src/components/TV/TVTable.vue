<template>
  <el-table
    :show-header="false"
    :data="tvs"
    height="100vh"
    v-el-table-infinite-scroll="load"
    :infinite-scroll-immediate="false"
    style="display: block; scroll-behavior: smooth !important"
  >
    <el-table-column label="name">
      <template slot-scope="scope">
        <TVCard v-bind:tvid="scope.row.id" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import TVCard from "./TVCard.vue";
import elTableInfiniteScroll from "el-table-infinite-scroll";

export default {
  name: "TVTable",
  components: {
    TVCard,
  },
  data() {
    return {
      loader: 4,
    };
  },
  directives: {
    "el-table-infinite-scroll": elTableInfiniteScroll,
  },
  methods: {
    load() {
      this.loader += 2;
      // console.log("loader", this.loader);
    },
  },
  computed: {
    mode() {
      return this.$store.getters.getTVMode;
    },
    search() {
      return this.$store.getters.getTVSearch;
    },
    sort() {
      let sortMethods = {
        LE: (a, b) =>
          new Date(b.where_am_i.finishedDate).getTime() -
          new Date(a.where_am_i.finishedDate).getTime(),
        AZ: (a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0),
        ZA: (a, b) => (a.name < b.name ? 1 : b.name < a.name ? -1 : 0),
        LH: (a, b) => a.progress - b.progress,
        HL: (a, b) => b.progress - a.progress,
        NO: (a, b) => {
          if (a.next_episode_to_air != null && b.next_episode_to_air != null) {
            return (
              new Date(a.next_episode_to_air.air_date).getTime() -
              new Date(b.next_episode_to_air.air_date).getTime()
            );
          } else if (
            a.next_episode_to_air == null &&
            b.next_episode_to_air == null
          ) {
            return 0;
          } else if (a.next_episode_to_air == null) {
            return 1;
          } else if (b.next_episode_to_air == null) {
            return -1;
          }
        },
        ON: (a, b) => {
          if (a.next_episode_to_air != null && b.next_episode_to_air != null) {
            return (
              new Date(b.next_episode_to_air.air_date).getTime() -
              new Date(a.next_episode_to_air.air_date).getTime()
            );
          } else if (
            a.next_episode_to_air == null &&
            b.next_episode_to_air == null
          ) {
            return 0;
          } else if (a.next_episode_to_air == null) {
            return 1;
          } else if (b.next_episode_to_air == null) {
            return -1;
          }
        },
      };
      return sortMethods[this.$store.getters.getTVSort];
    },
    tvs() {
      return this.$store.getters
        .getTVsByMode(this.mode)
        .filter((tv) =>
          tv.name.toLowerCase().includes(this.search.toLowerCase())
        )
        .sort(this.sort)
        .slice(0, this.loader);
    },
  },
};
</script>

<style>
::-webkit-scrollbar {
  display: inline;
}
</style>