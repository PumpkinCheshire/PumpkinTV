<template>
  <el-card :body-style="{ padding: '0px' }" shadow="hover" class="mv-card">
    <transition name="fade" mode="out-in">
      <el-image
        style="width: 298px; height: 447px"
        :src="genUrl(mv.poster_path)"
        fit="fill"
        v-if="!expand"
        v-on:click.native="expand = !expand"
      />
      <el-image
        style="width: 298px; height: 167px"
        :src="genUrl(mv.backdrop_path)"
        fit="fill"
        v-on:click.native="expand = !expand"
        v-else
      />
    </transition>
    <el-col v-if="expand" class="mv-card-main">
      <el-row class="mv-title-row">
        <el-col class="mv-title"> {{ mv.title }} </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-image
            :src="
              mv.production_companies.filter((comp) => comp.logo_path != null)
                .length > 0
                ? genUrl(
                    mv.production_companies
                      .filter((comp) => comp.logo_path != null)
                      .sort((a, b) => a.id - b.id)[0].logo_path
                  )
                : ''
            "
            style="width: 43px; height: 16px; margin-right: 5px; top: 5px"
            fit="scale-down"
          />
          <el-divider direction="vertical"></el-divider>
          <span>{{ mv.release_date }}</span>
          <el-divider direction="vertical"></el-divider>
          <span>{{ mv.runtime }} min</span>
        </el-col>
        <el-col :span="6" style="text-align: right; padding-right: 20px">
          <el-popconfirm
            title="Confirm to delete?"
            confirm-button-text="Yes"
            cancel-button-text="Cancel"
            @confirm="deleteMV"
          >
            <el-button
              slot="reference"
              type="danger"
              icon="el-icon-delete"
              style="padding: 5px"
              circle
            ></el-button>
          </el-popconfirm>
        </el-col>
      </el-row>
      <el-row
        ><el-divider class="mv-divider"></el-divider
        ><span class="movie-overview">{{ mv.overview }}</span>
      </el-row>

      <el-row class="mark-button" v-if="dateCompare(mv.release_date)">
        <el-col :span="20" style="line-height: 40px; padding-right: 10px"
          ><span v-if="mv.isFinished">Watched on </span>
          <el-date-picker
            v-model="finishedDate"
            align="right"
            type="date"
            size="mini"
            class="date-picker"
            @change="changeFinishedDate"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="2">
          <el-button
            icon="el-icon-check"
            :type="mv.isFinished ? 'primary' : ''"
            circle
            @click="mv.isFinished ? unmarkWatchedMV() : markWatchedMV()"
          />
        </el-col>
      </el-row>
    </el-col>
  </el-card>
</template>

<script>
export default {
  name: "MVCard",
  props: {
    mvid: Number,
  },
  data() {
    return {
      finishedDate: "",
      expand: false,
      backdrop_path:
        "https://image.tmdb.org/t/p/original/wzJRB4MKi3yK138bJyuL9nx47y6.jpg",
      poster_path:
        "https://image.tmdb.org/t/p/original/k68nPLbIST6NP96JmTxmZijEvCA.jpg",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "Today",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "Yesterday",
            onClick(picker) {
              picker.$emit(
                "pick",
                new Date().setTime(new Date().getTime() - 3600 * 1000 * 24)
              );
            },
          },
          {
            text: "Week Ago",
            onClick(picker) {
              picker.$emit(
                "pick",
                new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7)
              );
            },
          },
          {
            text: "Released Date",
            onClick: (picker) => {
              picker.$emit("pick", this.mv.release_date);
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.finishedDate = this.mv.finishedDate;
  },
  computed: {
    mvidx() {
      return this.$store.getters.getMVIdxByID(this.mvid);
    },
    mv() {
      return this.$store.getters.getMVByIdx(this.mvidx);
    },
  },
  methods: {
    genUrl(path) {
      return `https://image.tmdb.org/t/p/original${path}`;
    },
    dateCompare(date) {
      return new Date(date).getTime() < new Date().getTime();
    },
    unmarkWatchedMV() {
      this.$store.dispatch("unmarkWatchedMV", this.mvid);
    },
    markWatchedMV() {
      this.$store.dispatch("markWatchedMV", this.mvid);
    },
    deleteMV() {
      this.$store.dispatch("deleteMV", this.mvid);
    },
    changeFinishedDate() {
      console.log("onchange", this.finishedDate);
      this.$store.dispatch("changeMVFinishedDate", {
        mvidx: this.mvidx,
        date: JSON.parse(JSON.stringify(this.finishedDate)),
      });
    },
  },
};
</script>

<style>
.fade-enter-active {
  transition: opacity 1s;
}

.fade-leave-active {
  transition: opacity 0s;
}

.fade-enter {
  opacity: 0 !important;
}

.fade-leave-to {
  opacity: 0;
}

.mv-title {
  font-family: "Source Sans Pro", sans-serif !important;
  height: 40px;
  line-height: 20px;
  font-weight: bold;
  font-size: 16px;
  display: block;
  display: -webkit-box;
  margin-top: 10px;
  margin-bottom: 10px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-table .cell {
  word-break: break-word !important;
}

.mv-divider {
  margin: 10px 0px !important;
}

.mv-card {
  width: 300px;
  height: 450px;
}
/* .mv-title-row {
  padding-left: 15px;
} */

.mv-card-main {
  padding-left: 15px;
  padding-right: 15px;
}

.movie-overview {
  height: 112px;
  line-height: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 7;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.date-picker {
  width: 130px !important;
}
</style>