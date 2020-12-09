<template>
  <el-dropdown @command="handleCommand">
    <el-button type="primary" round>
      Sort<i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="NS">No Sort</el-dropdown-item>
      <el-dropdown-item command="AZ">Name A to Z</el-dropdown-item>
      <el-dropdown-item command="ZA">Name Z to A</el-dropdown-item>
      <el-dropdown-item command="NO">Release Date New to Old</el-dropdown-item>
      <el-dropdown-item command="ON">Release Date Old to New</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: "SortMV",
  methods: {
    handleCommand(command) {
      this.$store.commit("setMVSort", command);
    },
  },
};
</script>