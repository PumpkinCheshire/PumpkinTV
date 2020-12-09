<template>
  <el-table
    :show-header="false"
    :data="mvs"
    height="100vh"
    v-el-table-infinite-scroll="load"
    :infinite-scroll-immediate="false"
    style="display: block; scroll-behavior: smooth !important"
  >
    <el-table-column label="mv1">
      <template slot-scope="scope">
        <MVCard v-if="scope.row[0]" v-bind:mvid="scope.row[0].id" />
      </template>
    </el-table-column>
    <el-table-column label="mv2">
      <template slot-scope="scope">
        <MVCard v-if="scope.row[1]" v-bind:mvid="scope.row[1].id" />
      </template>
    </el-table-column>
    <el-table-column label="mv3">
      <template slot-scope="scope">
        <MVCard v-if="scope.row[2]" v-bind:mvid="scope.row[2].id" />
      </template>
    </el-table-column>
    <el-table-column label="mv4">
      <template slot-scope="scope">
        <MVCard v-if="scope.row[3]" v-bind:mvid="scope.row[3].id" />
      </template>
    </el-table-column>
    <el-table-column label="mv5">
      <template slot-scope="scope">
        <MVCard v-if="scope.row[4]" v-bind:mvid="scope.row[4].id" />
      </template>
    </el-table-column>
  </el-table>
</template>


<script>
import MVCard from "./MVCard.vue";
import elTableInfiniteScroll from "el-table-infinite-scroll";

export default {
  name: "MVTable",
  components: {
    MVCard,
  },
  directives: {
    "el-table-infinite-scroll": elTableInfiniteScroll,
  },
  computed: {
    mode() {
      return this.$store.getters.getMVMode;
    },
    search() {
      return this.$store.getters.getMVSearch;
    },
    sort() {
      let sortMethods = {
        NS: undefined,
        AZ: (a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0),
        ZA: (a, b) => (a.title < b.title ? 1 : b.title < a.title ? -1 : 0),
        NO: (a, b) => {
          if (a.release_date != null && b.release_date != null) {
            return (
              new Date(b.release_date).getTime() -
              new Date(a.release_date).getTime()
            );
          } else if (a.release_date == null && b.release_date == null) {
            return 0;
          } else if (a.release_date == null) {
            return 1;
          } else if (b.release_date == null) {
            return -1;
          }
        },
        ON: (a, b) => {
          if (a.release_date != null && b.release_date != null) {
            return (
              new Date(a.release_date).getTime() -
              new Date(b.release_date).getTime()
            );
          } else if (a.release_date == null && b.release_date == null) {
            return 0;
          } else if (a.release_date == null) {
            return 1;
          } else if (b.release_date == null) {
            return -1;
          }
        },
      };
      return sortMethods[this.$store.getters.getMVSort];
    },
    mvs() {
      var mvList = JSON.parse(
        JSON.stringify(
          this.$store.getters
            .getMVsByMode(this.mode ? this.mode : "listed")
            .filter((mv) =>
              mv.title.toLowerCase().includes(this.search.toLowerCase())
            )
            .sort(this.sort)
            .slice(0, this.loader)
        )
      );
      var newList = [];
      while (mvList.length) newList.push(mvList.splice(0, 5));
      return newList;
    },
  },
  methods: {
    load() {
      this.loader += 5;
      // console.log("loader", this.loader);
    },
  },
  data() {
    return {
      loader: 15,
    };
  },
};
</script>

<style>
</style>