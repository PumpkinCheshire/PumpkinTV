<template>
  <el-dropdown @command="handleCommand">
    <el-button type="primary" round>
      Backup & Recovery<i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="dl">Download Backup</el-dropdown-item>
      <el-dropdown-item command="ul">Recover from Backup</el-dropdown-item>
    </el-dropdown-menu>
    <el-dialog
      title="Upload JSON Backup File"
      :visible.sync="dialogTableVisible"
      width="30%"
    >
      <el-upload
        class="upload-demo"
        drag
        action=""
        :multiple="false"
        :file-list="fileList"
        accept=".json"
        :http-request="handleFile"
        :limit="1"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          Drag your JSON here，or <em>Click to upload</em>
        </div>
        <div class="el-upload__tip" slot="tip">JSON file only</div>
      </el-upload>
      <el-button
        type="primary"
        class="ul-button"
        @click="dialogTableVisible = false"
        >Finish</el-button
      >
    </el-dialog>
  </el-dropdown>
</template>

<script>
// import shared from "../shared/shared.js";

export default {
  name: "BackupRecover",
  data() {
    return {
      dialogTableVisible: false,
      // userData: { api_key: "49ae83b320a43c660d6fa4b4dae9ea79", tvs: [] },
      fileList: [],
    };
  },
  created() {
    // this.saveUserData = shared.saveUserData;
  },
  methods: {
    dlJson() {
      const data = JSON.stringify(this.$store.getters.getUserData);
      const blob = new Blob([data], { type: "text/plain" });
      const a = document.createElement("a");
      a.download = "userData.json";
      a.href = window.URL.createObjectURL(blob);
      a.click();
      URL.revokeObjectURL(a.href);
    },
    handleFile(param) {
      console.log(param);

      const reader = new FileReader();
      reader.readAsText(param.file);
      reader.onload = async (e) => {
        try {
          this.$store.commit("loadUserData", JSON.parse(e.target.result));
          console.log(this.$store.getters.getUserData);
          // this.saveUserData(this.$store.getters.getUserData);
          await param.onSuccess();
        } catch (err) {
          console.log(`Load JSON file error: ${err.message}`);
        }
      };
    },
    handleCommand(command) {
      if (command === "dl") {
        this.dlJson();
      } else if (command === "ul") {
        this.dialogTableVisible = true;
      }
    },
  },
};
</script>

<style>
.ul-button {
  margin-top: 20px;
}
</style>