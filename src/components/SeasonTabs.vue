<template>
  <el-tabs
    type="border-card"
    v-model="activeName"
    @tab-click="handleClick"
    style="season_tab"
  >
    <el-tab-pane
      v-for="season in SeasonList"
      :key="season.id"
      :label="season.name"
      :name="season.name"
    >
      <el-carousel
        :autoplay="false"
        :loop="false"
        type="card"
        height="175px"
        :initial-index="4"
      >
        <el-carousel-item v-for="item in 6" :key="'carousel' + item">
          <h3 class="medium">{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: "SeasonTabs",
  props: {
    SeasonList: Array,
  },
  data() {
    const type = typeof this.SeasonList;
    return {
      test: [{ name: "Season 2" }, { name: "Season 1" }],
      type,
      activeName: "Season 1",
      //      SeasonObj: JSON.parse(this.SeasonList),
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.el-tabs__content {
  padding-bottom: 0px !important;
}
</style>
