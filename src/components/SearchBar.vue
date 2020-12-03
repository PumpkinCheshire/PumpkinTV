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
    <!-- <template slot-scope="{ item }">
      <el-row :gutter="10" class="row_item">
        <el-col :span="4">
          <el-image
            style="width: 100px; height: 50px"
            :src="item.backdrop_path"
            fit="scale-down"
            lazy
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </el-col>
        <el-col :span="20">
          <el-row class="preview_name">{{ item.value }}</el-row>
          <el-row class="preview_data">{{ item.date }}</el-row>
        </el-col>
      </el-row>
      <el-divider class="preview_divider"></el-divider>
    </template> -->
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
  methods: {
    handleSearch() {
      this.$emit("setSearch", this.search);
    },
  },
};
</script>