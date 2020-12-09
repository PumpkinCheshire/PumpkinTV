<template>
  <el-menu
    :default-active="$store.getters.getMVMode"
    class="el-menu-vertical"
    @select="handleSelect"
  >
    <el-menu-item index="all">
      <i class="el-icon-menu"></i>
      <span slot="title">All</span>
    </el-menu-item>
    <el-menu-item index="listed">
      <i class="el-icon-menu"></i>
      <span slot="title">Listed</span>
    </el-menu-item>
    <el-menu-item index="watched">
      <i class="el-icon-menu"></i>
      <span slot="title">Watched</span>
    </el-menu-item>
    <el-menu-item index="upcoming">
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
      this.$store.commit("setMVMode", index);
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