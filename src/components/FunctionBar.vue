<template>
  <el-row :gutter="20" type="flex" justify="end">
    <el-col :span="6">
      <AddTV v-if="$store.getters.getMode" />
      <AddMV v-else />
    </el-col>
    <el-col :span="8">
      <BackupRecover :span="5" />
    </el-col>
    <el-col :span="7">
      <SortTV v-if="$store.getters.getMode" />
      <SortMV v-else />
    </el-col>
    <el-col :span="3">
      <StatDrawer />
    </el-col>
  </el-row>
</template>

<script>
import AddTV from "./TV/AddTV.vue";
import AddMV from "./MV/AddMV.vue";
import SortTV from "./TV/SortTV.vue";
import SortMV from "./MV/SortMV.vue";
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
  /* text-align: right; */
}
</style>