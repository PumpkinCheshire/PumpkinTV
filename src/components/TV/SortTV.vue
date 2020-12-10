<template>
  <el-dropdown @command="handleCommand">
    <el-button type="primary" round>
      Sort<i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="LE">Last Wathced</el-dropdown-item>
      <el-dropdown-item command="AZ">Name A to Z</el-dropdown-item>
      <el-dropdown-item command="ZA">Name Z to A</el-dropdown-item>
      <el-dropdown-item command="LH">Progress Low to Hight</el-dropdown-item>
      <el-dropdown-item command="HL">Progress High to Low</el-dropdown-item>
      <el-dropdown-item command="NO">Next Date New to Old</el-dropdown-item>
      <el-dropdown-item command="ON">Next Date Old to New</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: "SortTV",
  methods: {
    handleCommand(command) {
      this.$store.commit("setTVSort", command);
    },
  },
};
</script>