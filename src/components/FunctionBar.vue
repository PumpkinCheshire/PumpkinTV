<template>
  <el-row :gutter="20" class="function-bar">
    <el-col :span="4">
      <AddTV v-if="$store.getters.getMode" />
      <AddMV v-else />
    </el-col>
    <el-col :span="8">
      <BackupRecover />
    </el-col>
    <el-col :span="4">
      <SortTV v-if="$store.getters.getMode" />
      <SortMV v-else />
    </el-col>
    <el-col :span="4">
      <StatDrawer />
    </el-col>
  </el-row>
</template>

<script>
import AddTV from "./AddTV.vue";
import AddMV from "./AddMV.vue";
import SortTV from "./SortTV.vue";
import SortMV from "./SortMV.vue";
import BackupRecover from "./BackupRecover.vue";
import StatDrawer from "./StatDrawer.vue";

export default {
  name: "FunctionBar",
  components: {
    AddTV,
    AddMV,
    SortTV,
    SortMV,
    BackupRecover,
    StatDrawer,
  },
};
</script>

<style>
.function-bar {
  text-align: right;
}
</style>