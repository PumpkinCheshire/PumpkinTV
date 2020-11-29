<template>
  <el-table
    :show-header="false"
    :data="tvs"
    height="100vh"
    v-el-table-infinite-scroll="load"
    :infinite-scroll-immediate="false"
    style="display: block"
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
  name: "app",
  components: {
    TVCard,
  },
  data() {
    return {
      loader: 4,
      loadList: this.$store.getters.getTVsByMode(this.mode).slice(0, 5),
    };
  },
  props: {
    mode: String,
  },
  directives: {
    "el-table-infinite-scroll": elTableInfiniteScroll,
  },
  methods: {
    load() {
      this.loader += 2;
      console.log("loader", this.loader);
    },
  },
  computed: {
    tvs() {
      return this.$store.getters.getTVsByMode(this.mode).slice(0, this.loader);
    },
  },
};
</script>

<style>
::-webkit-scrollbar {
  display: inline;
}
</style>