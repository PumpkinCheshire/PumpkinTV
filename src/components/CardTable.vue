<template>
  <el-table :show-header="false" :data="this.$store.getters.getUserData.tvs">
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
  data() {
    return {};
  },
};
</script>

<style>
</style>