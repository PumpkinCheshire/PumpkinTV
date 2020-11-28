<template>
  <el-menu default-active="1" class="el-menu-vertical" @select="handleSelect">
    <el-menu-item index="0">
      <i class="el-icon-menu"></i>
      <span slot="title">Following</span>
    </el-menu-item>
    <el-menu-item index="1">
      <i class="el-icon-menu"></i>
      <span slot="title">Catching</span>
    </el-menu-item>
    <el-menu-item index="2">
      <i class="el-icon-menu"></i>
      <span slot="title">Waiting</span>
    </el-menu-item>
    <el-menu-item index="3">
      <i class="el-icon-menu"></i>
      <span slot="title">Finished</span>
    </el-menu-item>
    <el-menu-item index="4">
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
          mode = "following";
          break;
        case "1":
          mode = "catching";
          break;
        case "2":
          mode = "waiting";
          break;
        case "3":
          mode = "stopped";
          break;
        case "4":
          mode = "finished";
          break;
      }
      console.log("index and mode", index, mode);
      this.$emit("setMenu", mode);
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