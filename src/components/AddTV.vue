<template>
  <div>
    <el-button type="primary" round @click="dialogFormVisible = true">
      Add
    </el-button>

    <el-dialog title="Add a new TV show" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="100px" class="ruleForm">
        <!-- <el-form-item label="API-KEY">
          <el-input
            placeholder="Your TMDB api-key"
            v-model="form.api"
            clearable
          >
          </el-input>
        </el-form-item> -->
        <el-form-item label="Show Name">
          <el-autocomplete
            class="inline-input"
            v-model="form.name"
            :fetch-suggestions="querySearch"
            placeholder="The TV show name"
            :trigger-on-focus="false"
            :debounce="900"
            @select="handleSelect"
          >
            <el-button type="text" disabled slot="append">
              TMDB id : {{ tvid }}
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
import shared from "../shared/shared.js";
import _ from "lodash";

export default {
  name: "AddTV",

  data() {
    return {
      dialogFormVisible: false,
      form: {
        name: "",
      },
      tvid: 0,
      userData: { api_key: "49ae83b320a43c660d6fa4b4dae9ea79", tvs: [] },
    };
  },
  created() {
    this.initTV = shared.initTV;
    this.saveUserData = shared.saveUserData;
  },
  mounted() {
    if (localStorage.getItem("userData")) {
      try {
        this.userData = JSON.parse(localStorage.getItem("userData"));
      } catch (e) {
        console.log("Error, local data damaged.");
      }
    }
  },
  methods: {
    querySearch(queryString, cb) {
      var queryString_url = encodeURI(queryString);
      console.log(queryString_url);
      (async () => {
        var obj = await getJson(
          `https://api.themoviedb.org/3/search/tv?api_key=49ae83b320a43c660d6fa4b4dae9ea79&language=en-US&page=1&query=${queryString_url}&include_adult=false`
        );
        var results = obj.results.map((tv) => ({
          value: tv.name,
          id: tv.id,
          date: tv.first_air_date,
          backdrop_path: `https://image.tmdb.org/t/p/w200/${tv.backdrop_path}`,
        }));
        cb(results);
      })();
    },
    handleSelect(item) {
      this.tvid = item.id;
    },
    onSubmit() {
      this.dialogFormVisible = false;
      if (this.tvid === 0) {
        return;
      }
      var idx = this.userData.tvs.map((tv) => tv.id).indexOf(this.tvid);
      console.log(idx);
      if (
        idx >= 0 &&
        (this.userData.tvs[idx].status === "Ended" ||
          this.userData.tvs[idx].mode === "stopped" ||
          (this.userData.tvs[idx].mode === "finished" &&
            this.userData.tvs[idx].status !== "Ended"))
      ) {
        console.log("Already existed and no need to update");
        return;
      }

      (async () => {
        var newTV = await this.initTV(this.userData.api_key, this.tvid);
        console.log(newTV);
        if (idx < 0) {
          this.userData.tvs.push(newTV);
          console.log(`${newTV.name} added`);
        } else {
          _.extend(this.userData.tvs[idx], newTV);
          console.log(`${this.userData.tvs[idx].name} got updated`);
        }
        this.userData.tvs = await this.userData.tvs.filter(
          (item) => item !== null
        );
        this.tvid = await 0;
        this.saveUserData(await this.userData);
      })();
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