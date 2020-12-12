<template>
  <el-input
    class="inline-input"
    v-model="search"
    :placeholder="`The ${tmode ? 'TV show' : 'Movie'} name`"
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
  computed: {
    tmode() {
      return this.$store.getters.getMode;
    },
  },
  methods: {
    handleSearch() {
      this.$store.commit(
        this.tmode ? "setTVSearch" : "setMVSearch",
        this.search
      );
    },
  },
};
</script>