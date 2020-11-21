<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-row
          :gutter="20"
          type="flex"
          class="row-bg-header"
          justify="space-between"
        >
          <el-col :span="4"> Logo </el-col>
          <el-col :span="12"> Search Bar </el-col>
          <el-col :span="8" class="function-bar">
            <FunctionBar />
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>
          <!-- <TVCard
            v-for="(item, index) in items"
            v-bind:key="index"
            :tvid="item.id"
          /> -->
          <CardTable />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import CardTable from "./components/CardTable.vue";
import FunctionBar from "./components/FunctionBar.vue";

export default {
  name: "app",
  components: {
    CardTable,
    FunctionBar,
  },
  data() {
    return {
      items: [{ id: "82856" }, { id: "82857" }, { id: "82858" }],
    };
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-header,
.el-footer {
  height: auto !important;
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
}

.el-container {
  margin-bottom: 40px;
}
.row-bg-header {
  margin-top: 20px;
  margin-bottom: 20px;
}

.function-bar {
  text-align: center;
}
</style>
