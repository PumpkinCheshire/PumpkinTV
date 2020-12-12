<template>
  <el-card
    class="episode-card"
    v-bind:style="`background-image: -webkit-cross-fade(url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=),url(https://image.tmdb.org/t/p/original${
      episode.still_path ? episode.still_path : tv.backdrop_path
    }),30%);border:transparent;background-size:cover;background-repeat:no-repeat`"
    v-if="
      episode.episode_number >= slide - 2 && episode.episode_number <= slide + 2
    "
  >
    <el-row class="episode-card-title">
      <span>{{ "S" + getFormattedNumber(episode.season_number) }} </span>
      <el-divider direction="vertical" class="SE-divider"></el-divider>
      <span>
        {{ "E" + getFormattedNumber(episode.episode_number) }}
      </span>
      <span
        >({{
          getTotalNumber(episode.season_number, episode.total_number)
        }})</span
      >
      <el-divider direction="vertical" class="title-divider"></el-divider>
    </el-row>
    <el-row style="padding: 5px 0">
      <span
        style="
          display: inline-block;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          heigt: 16px;
          width: 420px;
        "
        >{{ episode.name }}</span
      >
      <el-divider direction="vertical" class="title-divider"></el-divider>
      <i class="el-icon-date" style="margin-right: 5px" />
      <span>{{
        episode.air_date ? episode.air_date.slice(0, 10) : "No air day yet"
      }}</span>
    </el-row>
    <el-row class="episode-overview">
      <span style="visibility: visible">{{ episode.overview }}</span>
    </el-row>
    <el-row class="mark-button" v-if="dateCompare(episode.air_date)">
      <el-col :span="22" style="line-height: 40px; padding-right: 10px"
        ><span v-if="episode.isFinished">Watched on </span>
        <el-date-picker
          v-model="finishedDate"
          align="right"
          type="date"
          size="mini"
          class="date-picker"
          :picker-options="pickerOptions"
          @change="changeFinishedDate"
          v-if="episode.isFinished"
        >
        </el-date-picker>
        <el-divider direction="vertical"></el-divider>
      </el-col>
      <el-col :span="2">
        <el-popconfirm
          confirm-button-text="Yes"
          cancel-button-text="No"
          title="Mark all previous episodes as watched？"
          v-if="
            !episode.isFinished &&
            isAllable({
              tvid: tvid,
              season_number: season.season_number,
              episode_number: episode.episode_number,
            })
          "
          @confirm="
            markWatched(season.season_number, episode.episode_number, true)
          "
          @cancel="
            markWatched(season.season_number, episode.episode_number, false)
          "
        >
          <el-button
            slot="reference"
            icon="el-icon-check"
            :type="episode.isFinished ? 'primary' : ''"
            circle
            :data-season="season.season_number"
            :data-episode="episode.episode_number"
          />
        </el-popconfirm>
        <el-button
          icon="el-icon-check"
          :type="episode.isFinished ? 'primary' : ''"
          circle
          @click="
            episode.isFinished
              ? unmarkWatched(season.season_number, episode.episode_number)
              : markWatched(season.season_number, episode.episode_number, false)
          "
          v-else
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: "EpisodeCard",
  props: {
    episode: Object,
    slide: Number,
    tvid: Number,
    season: Object,
  },
  data() {
    return {
      finishedDate: "",
      pickerOptions: {
        disabledDate: (time) => {
          return (
            time.getTime() > Date.now() ||
            time.getTime() < new Date(this.episode.air_date).getTime() - 8.64e7
          );
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
            text: "Air Date",
            onClick: (picker) => {
              picker.$emit("pick", this.episode.air_date);
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.finishedDate = this.episode.finishedDate;
  },
  computed: {
    tvidx() {
      return this.$store.getters.getTVIdxByID(this.tvid);
    },

    isAllable() {
      return this.$store.getters.isAllable;
    },
    tv() {
      return this.$store.getters.getTVByID(this.tvid);
    },
  },
  methods: {
    getFormattedNumber(number) {
      if (number > 9) {
        return `${number}`;
      } else {
        return `${"0" + number}`;
      }
    },
    markWatched(season_number, episode_number, isAll) {
      this.finishedDate = new Date();
      this.$store.dispatch("markWatched", {
        isAll: isAll,
        info: {
          tvid: this.tvid,
          season_number: season_number,
          episode_number: episode_number,
        },
      });
    },
    unmarkWatched(season_number, episode_number) {
      this.$store.dispatch("unmarkWatched", {
        tvid: this.tvid,
        season_number: season_number,
        episode_number: episode_number,
      });
    },
    getTotalNumber(season_number, total_number) {
      if (season_number === 0) {
        return `SP${this.getFormattedNumber(total_number)}`;
      } else {
        return `E${this.getFormattedNumber(total_number)}`;
      }
    },
    dateCompare(date) {
      return new Date(date).getTime() < new Date().getTime();
    },

    changeFinishedDate() {
      this.$store.dispatch("changeEpisodeFinishedDate", {
        tvidx: this.tvidx,
        season_number: this.episode.season_number,
        episode_number: this.episode.episode_number,
        date: JSON.parse(JSON.stringify(this.finishedDate)),
      });
    },
  },
};
</script>