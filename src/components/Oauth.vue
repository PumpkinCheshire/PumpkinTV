<template>
  <div>Logging in</div>
</template>

<script>
export default {
  name: "Oauth",
  beforeCreate() {
    console.log("I am processing oauth");
    console.log(this.$store.state.loginCode);
    this.$store.dispatch("setAccessToken", this.$route.query.code);
    console.log(this.$store.getters.getLoginCode);
    this.$router.replace({ name: "root" });
  },
};
</script>

<style>
</style>