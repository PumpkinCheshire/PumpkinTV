<template>
  <el-dropdown @command="handleCommand">
    <el-button type="primary" round>
      B & R<i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="dl">Download Backup</el-dropdown-item>
      <el-dropdown-item command="ul">Recover from Backup</el-dropdown-item>
      <el-dropdown-item command="cdl">Sync to Gist</el-dropdown-item>
      <el-dropdown-item command="cul">Recover from Gist</el-dropdown-item>
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
// import { Octokit } from "@octokit/core";

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
      let data = JSON.stringify(this.$store.getters.getSaveData);
      let blob = new Blob([data], { type: "text/plain" });
      let a = document.createElement("a");
      a.download = "PumpkinTVSave.json";
      a.href = window.URL.createObjectURL(blob);
      a.click();
      URL.revokeObjectURL(a.href);
    },

    async dlGist() {
      fetch(`https://api.github.com/gists/${this.$store.getters.getGist}`, {
        method: "PATCH",
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `bearer ${this.$store.getters.getToken} `,
        },
        body: JSON.stringify({
          description: "PumpkinTV saved progress",
          public: false,
          files: {
            ["PumpkinTVSave.json"]: {
              content: JSON.stringify(this.$store.getters.getSaveData),
            },
          },
        }),
      })
        .then((res) => res.json())
        .then((json) => console.log(json));
    },

    async ulGist() {
      fetch(`https://api.github.com/gists/${this.$store.getters.getGist}`, {
        method: "GET",
        headers: {
          // "Access-Control-Allow-Origin": "*",
          Accept: "application/vnd.github.v3+json",
          Authorization: `bearer ${this.$store.getters.getToken}`,
        },
      })
        .then((res) => res.json())
        .then((json) =>
          this.$store.dispatch(
            "recoverFromSave",
            JSON.parse(json.files["PumpkinTVSave.json"].content)
          )
        );
    },

    handleFile(param) {
      console.log(param);

      const reader = new FileReader();
      reader.readAsText(param.file);
      reader.onload = async (e) => {
        try {
          // this.$store.commit("loadUserData", JSON.parse(e.target.result));
          this.$store.commit("recoverFromSave", JSON.parse(e.target.result));
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
      } else if (command == "cdl") {
        this.dlGist();
      } else if (command == "cul") {
        this.ulGist();
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