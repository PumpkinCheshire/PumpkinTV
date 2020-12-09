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
          <el-col :span="4" style="height: 40px">
            <el-switch
              style="padding: 10px"
              v-model="tmode"
              @change="changeMode"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
            <span class="logo"> Pumpkin {{ tmode ? "TV" : "Movie" }}</span>
          </el-col>
          <el-col :span="20">
            <SearchBar @setSearch="search = $event"
          /></el-col>
          <el-col :span="6" class="function-bar">
            <FunctionBar />
          </el-col>
        </el-row>
      </el-header>
      <el-container style="overflow-y: hidden !important">
        <el-aside width="200px"
          ><TVNavMenu v-if="tmode" /><MVNavMenu v-else
        /></el-aside>
        <el-main>
          <TVTable v-if="tmode" />
          <MVTable v-else />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import TVTable from "./components/TV/TVTable.vue";
import MVTable from "./components/MV/MVTable.vue";
import FunctionBar from "./components/FunctionBar.vue";
import TVNavMenu from "./components/TV/TVNavMenu.vue";
import MVNavMenu from "./components/MV/MVNavMenu.vue";
import SearchBar from "./components/SearchBar.vue";

export default {
  name: "app",
  components: {
    TVTable,
    MVTable,
    FunctionBar,
    TVNavMenu,
    MVNavMenu,
    SearchBar,
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

.logo {
  padding: 10px;
  font-weight: bold;
  font-size: 20px;
  text-align: center;
}

/* .cardTable {
  height: 100vh;
} */
</style>
