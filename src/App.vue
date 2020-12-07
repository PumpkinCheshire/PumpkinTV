<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-switch
          v-model="tmode"
          @change="changeMode"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
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
            <FunctionBar />
          </el-col>
        </el-row>
      </el-header>
      <el-container style="overflow-y: hidden !important">
        <el-aside width="200px"
          ><NavMenu v-if="tmode" /><NavMenuMV v-else
        /></el-aside>
        <el-main>
          <CardTable v-if="tmode" />
          <MovieTable v-else />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import CardTable from "./components/CardTable.vue";
import FunctionBar from "./components/FunctionBar.vue";
import NavMenu from "./components/NavMenu.vue";
import NavMenuMV from "./components/NavMenuMV.vue";
import SearchBar from "./components/SearchBar.vue";
import MovieTable from "./components/MovieTable.vue";
export default {
  name: "app",
  components: {
    CardTable,
    FunctionBar,
    NavMenu,
    NavMenuMV,
    SearchBar,
    MovieTable,
  },

  computed: {
    tmode() {
      return this.$store.getters.getMode;
    },
  },
  methods: {
    changeMode() {
      this.$store.commit("changeMode");
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap");
/* ::-webkit-scrollbar {
  display: none;
} */
#app {
  font-family: "Source Sans Pro", sans-serif;
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
