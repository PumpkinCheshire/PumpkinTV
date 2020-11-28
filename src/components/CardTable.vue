<template>
  <el-table :show-header="false" :data="tvs">
    <el-table-column label="name">
      <template slot-scope="scope">
        <TVCard v-bind:tvidx="scope.$index" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import TVCard from "./TVCard.vue";

export default {
  name: "app",
  components: {
    TVCard,
  },
  props: {
    mode: String,
  },
  computed: {
    tvs() {
      console.log(this.$store.getters.getTVsByMode(this.mode));
      return this.$store.getters.getTVsByMode(this.mode);
    },
  },
};
</script>

<style>
</style>