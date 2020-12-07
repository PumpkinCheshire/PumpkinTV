<template>
  <el-menu default-active="1" class="el-menu-vertical" @select="handleSelect">
    <el-menu-item index="0">
      <i class="el-icon-menu"></i>
      <span slot="title">All</span>
    </el-menu-item>
    <el-menu-item index="1">
      <i class="el-icon-menu"></i>
      <span slot="title">Catching</span>
    </el-menu-item>
    <el-menu-item index="2">
      <i class="el-icon-menu"></i>
      <span slot="title">Following</span>
    </el-menu-item>
    <el-menu-item index="3">
      <i class="el-icon-menu"></i>
      <span slot="title">Waiting</span>
    </el-menu-item>
    <el-menu-item index="4">
      <i class="el-icon-menu"></i>
      <span slot="title">Upcoming</span>
    </el-menu-item>
    <el-menu-item index="5">
      <i class="el-icon-menu"></i>
      <span slot="title">Finished</span>
    </el-menu-item>
    <el-menu-item index="6">
      <i class="el-icon-menu"></i>
      <span slot="title">Haven't Start</span>
    </el-menu-item>
    <el-menu-item index="7">
      <i class="el-icon-menu"></i>
      <span slot="title">Stopped</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "NavMenu",
  methods: {
    handleSelect(index) {
      var mode = "";
      switch (index) {
        case "0":
          mode = "all";
          break;
        case "1":
          mode = "catching";
          break;
        case "2":
          mode = "following";
          break;
        case "3":
          mode = "waiting";
          break;
        case "4":
          mode = "upcoming";
          break;
        case "5":
          mode = "finished";
          break;
        case "6":
          mode = "notstart";
          break;
        case "7":
          mode = "stopped";
          break;
      }
      this.$store.commit("setTVMode", mode);
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