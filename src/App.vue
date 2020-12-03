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
          <el-col :span="12">
            <SearchBar @setSearch="search = $event"
          /></el-col>
          <el-col :span="8" class="function-bar">
            <FunctionBar @setOrder="order = $event" />
          </el-col>
        </el-row>
      </el-header>
      <el-container style="overflow-y: hidden !important">
        <el-aside width="200px"><NavMenu @setMenu="mode = $event" /></el-aside>
        <el-main>
          <!-- <TVCard
            v-for="(item, index) in items"
            v-bind:key="index"
            :tvid="item.id"
          /> -->
          <CardTable
            v-bind:mode="mode"
            v-bind:search="search"
            v-bind:order="order"
          />
          <!-- <el-backtop target=".cardTable" :visibility-height="0"></el-backtop> -->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import CardTable from "./components/CardTable.vue";
import FunctionBar from "./components/FunctionBar.vue";
import NavMenu from "./components/NavMenu.vue";
import SearchBar from "./components/SearchBar.vue";

export default {
  name: "app",
  components: {
    CardTable,
    FunctionBar,
    NavMenu,
    SearchBar,
  },
  data() {
    return {
      mode: "catching",
      search: "",
      order: undefined,
    };
  },
};
</script>

<style>
/* ::-webkit-scrollbar {
  display: none;
} */
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  overflow: hidden;
  scroll-behavior: smooth;
}

.el-header,
.el-footer {
  height: auto !important;
  background-color: #fce4ec;
}

.el-aside {
  /* background-color: #ffb2dd; */
  color: #333;
  text-align: center;
  line-height: 200px;
  height: auto;
  border-right: solid 1px #e6e6e6;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  padding: 0px !important;
}

.row-bg-header {
  margin-top: 20px;
  margin-bottom: 20px;
}

.function-bar {
  text-align: center;
}

/* .cardTable {
  height: 100vh;
} */
</style>
