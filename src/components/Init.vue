<template>
  <el-dialog title="Welcome to use PumpkinTV." :visible.sync="apiKeyExist">
    <el-form :model="form">
      <el-alert
        title="I need a TMDB API key to sync shows data."
        type="warning"
        show-icon
        style="margin-bottom: 10px"
      />
      <!-- <el-divider /> -->
      <el-form-item label="API KEY" label-width="120px">
        <el-input v-model="form.apiKey" autocomplete="off"></el-input>
      </el-form-item>
      <el-alert
        title="I can also use your github account to save your progress to Gist. I will
      only use those info locally."
        type="warning"
        show-icon
        style="margin-bottom: 10px"
      />
      <el-form-item label="GitHub Login" label-width="120px">
        <el-button
          ><a
            href="https://github.com/login/oauth/authorize?
  client_id=4a56fb45e857832a9fae&redirect_uri=https://pumpkincheshire.github.io/PumpkinTV/#/oauth&scope=gist"
            >Github</a
          ></el-button
        >
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!-- <el-button @click="dialogFormVisible = false">Cancel</el-button> -->
      <el-button type="primary" @click="handleForm">Confirm</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "Init",
  data() {
    return {
      apiKeyExist: false,
      form: {
        apiKey: "",
      },
    };
  },
  mounted() {
    setTimeout(() => {
      this.apiKeyExist = this.$store.getters.getAPI == "";
    }, 5000);
  },
  methods: {
    handleForm() {
      this.$store.dispatch("setApiKey", this.form.apiKey);
      this.apiKeyExist = this.$store.getters.getAPI == "";
    },
  },
};
</script>