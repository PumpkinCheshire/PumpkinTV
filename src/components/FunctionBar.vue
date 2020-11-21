<template>
  <el-row :gutter="20">
    <el-col :span="4">
      <AddTV />
    </el-col>
    <el-col :span="8">
      <BackupRecover />
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
};
</script>