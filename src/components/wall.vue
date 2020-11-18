<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>
        <TVCard
          v-for="(item, index) in items"
          v-bind:key="index"
          :tvid="item.id"
        />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import TVCard from "./TVCard.vue";

export default {
  name: "wall",
  components: {
    TVCard,
  },
  data() {
    return {
      items: [{ id: "82856" }, { id: "82857" }, { id: "82858" }],
    };
  },
};
</script>

<style>
.el-header,
.el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

.el-container {
  margin-bottom: 40px;
}
</style>>