<template>
  <el-input
    class="inline-input"
    v-model="search"
    placeholder="The TV show name"
    :trigger-on-focus="false"
    :debounce="900"
    @input="handleSearch"
    :clearable="true"
  >
  </el-input>
</template>

<script>
export default {
  name: "SearchBar",
  data() {
    return {
      search: "",
    };
  },
  mounted() {
    this.$store.commit("setTVSearch", "");
    this.$store.commit("setMVSearch", "");
  },
  methods: {
    handleSearch() {
      this.$store.commit(
        this.$store.getters.getMode ? "setTVSearch" : "setMVSearch",
        this.search
      );
    },
  },
};
</script>