<template>
  <el-table :show-header="false" :data="userData.tvs">
    <el-table-column label="name">
      <template slot-scope="scope">
        <TVCard v-bind:tv="scope.row" />
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
    return {
      userData: { api: "49ae83b320a43c660d6fa4b4dae9ea79", tvs: [] },
    };
  },
  mounted() {
    if (localStorage.getItem("userData")) {
      try {
        this.userData = JSON.parse(localStorage.getItem("userData"));
      } catch (e) {
        console.log("Error, local data damaged.");
      }
    }
  },
};
</script>
