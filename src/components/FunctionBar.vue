<template>
  <el-row :gutter="20">
    <el-col :span="4">
      <AddTV />
    </el-col>
    <el-col :span="6">
      <BackupRecover />
    </el-col>
    <el-col :span="8">
      <el-dropdown @command="handleCommand">
        <el-button type="primary" round>
          Sort<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="AZ">Name A to Z</el-dropdown-item>
          <el-dropdown-item command="ZA">Name Z to A</el-dropdown-item>
          <el-dropdown-item command="LH"
            >Progress Low to Hight</el-dropdown-item
          >
          <el-dropdown-item command="HL">Progress High to Low</el-dropdown-item>
          <el-dropdown-item command="NO">Next Date New to Old</el-dropdown-item>
          <el-dropdown-item command="ON">Next Date Old to New</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
import AddTV from "./AddTV.vue";
import BackupRecover from "./BackupRecover.vue";

export default {
  name: "FunctionBar",
  components: {
    AddTV,
    BackupRecover,
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "AZ":
          this.$emit("setOrder", (a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
          break;
        case "ZA":
          this.$emit("setOrder", (a, b) =>
            a.name < b.name ? 1 : b.name < a.name ? -1 : 0
          );
          break;
        case "LH":
          this.$emit("setOrder", (a, b) => a.progress - b.progress);
          break;
        case "HL":
          this.$emit("setOrder", (a, b) => b.progress - a.progress);
          break;
        case "NO":
          this.$emit("setOrder", (a, b) => {
            if (
              a.next_episode_to_air != null &&
              b.next_episode_to_air != null
            ) {
              return (
                new Date(a.next_episode_to_air.air_date).getTime() -
                new Date(b.next_episode_to_air.air_date).getTime()
              );
            } else if (
              a.next_episode_to_air == null &&
              b.next_episode_to_air == null
            ) {
              return 0;
            } else if (a.next_episode_to_air == null) {
              return 1;
            } else if (b.next_episode_to_air == null) {
              return -1;
            }
          });
          break;
        case "ON":
          this.$emit("setOrder", (a, b) => {
            if (
              a.next_episode_to_air != null &&
              b.next_episode_to_air != null
            ) {
              return (
                new Date(b.next_episode_to_air.air_date).getTime() -
                new Date(a.next_episode_to_air.air_date).getTime()
              );
            } else if (
              a.next_episode_to_air == null &&
              b.next_episode_to_air == null
            ) {
              return 0;
            } else if (a.next_episode_to_air == null) {
              return 1;
            } else if (b.next_episode_to_air == null) {
              return -1;
            }
          });
      }
    },
  },
};
</script>