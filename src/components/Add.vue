<template>
  <div>
    <el-button type="primary" round @click="dialogFormVisible = true">
      Add
    </el-button>
    <el-dialog
      :title="`Add a new ${tmode ? 'TV' : 'Movie'}`"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" label-width="100px" class="ruleForm">
        <el-form-item label="Show Name">
          <el-autocomplete
            class="inline-input"
            v-model="form.name"
            :fetch-suggestions="querySearch"
            placeholder="The Movie name"
            :trigger-on-focus="false"
            :debounce="900"
            @select="handleSelect"
          >
            <el-button type="text" disabled slot="append">
              TMDB id : {{ id }}
            </el-button>

            <template slot-scope="{ item }">
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
            </template>
          </el-autocomplete>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onSubmit">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const bent = require("bent");
const getJson = bent("json");

export default {
  name: "AddMV",

  data() {
    return {
      dialogFormVisible: false,
      form: {
        name: "",
      },
      id: 0,
    };
  },
  methods: {
    querySearch(queryString, cb) {
      var queryString_url = encodeURI(queryString);

      (async () => {
        var obj = await getJson(
          this.tmode
            ? `https://api.themoviedb.org/3/search/tv?api_key=${this.$store.getters.getAPI}&language=en-US&page=1&query=${queryString_url}&include_adult=false`
            : `https://api.themoviedb.org/3/search/movie?api_key=${this.$store.getters.getAPI}&language=en-US&page=1&query=${queryString_url}&include_adult=false`
        );
        var results = obj.results.map((v) => ({
          value: this.tmode ? v.name : v.title,
          id: v.id,
          date: this.tmode ? v.first_air_date : v.release_date,
          backdrop_path: `https://image.tmdb.org/t/p/w200/${v.backdrop_path}`,
        }));
        cb(results);
      })();
    },
    handleSelect(item) {
      this.id = item.id;
    },
    onSubmit() {
      this.dialogFormVisible = false;
      this.$store.dispatch(this.tmode ? "addTV" : "addMV", this.id);
    },
  },
  computed: {
    tmode() {
      return this.$store.getters.getMode;
    },
  },
};
</script>

<style>
.el-button {
  margin: 10px;
}
.el-col {
  line-height: normal;
}
.inline-input {
  width: 95%;
}

/* .row_item:hover {
  background-color: gainsboro;
} */

.preview_name {
  font-size: 14px;
  font-weight: bold;
}
.preview_data {
  font-size: 12px;
}
.preview_divider {
  margin-top: 5px !important;
  margin-bottom: 5px !important;
}
.image-slot {
  padding: 15px;
  text-align: center;
  vertical-align: middle;
  align-items: center;
}
</style>