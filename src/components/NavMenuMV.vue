<template>
  <el-menu default-active="1" class="el-menu-vertical" @select="handleSelect">
    <el-menu-item index="0">
      <i class="el-icon-menu"></i>
      <span slot="title">All</span>
    </el-menu-item>
    <el-menu-item index="1">
      <i class="el-icon-menu"></i>
      <span slot="title">Listed</span>
    </el-menu-item>
    <el-menu-item index="2">
      <i class="el-icon-menu"></i>
      <span slot="title">Watched</span>
    </el-menu-item>
    <el-menu-item index="3">
      <i class="el-icon-menu"></i>
      <span slot="title">Upcoming</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "NavMenuMV",
  methods: {
    handleSelect(index) {
      var mode = "";
      switch (index) {
        case "0":
          mode = "all";
          break;
        case "1":
          mode = "listed";
          break;
        case "2":
          mode = "watched";
          break;
        case "3":
          mode = "upcoming";
          break;
      }
      this.$store.commit("setMVMode", mode);
    },
  },
};
</script>

<style>
.el-menu-vertical {
  text-align: left !important;
  user-select: none;
}
</style>>