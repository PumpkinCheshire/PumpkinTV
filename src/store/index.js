import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import localforage from 'localforage'
// import createPersistedState from 'vuex-persistedstate'
import _ from "lodash"

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        userData: { api_key: "49ae83b320a43c660d6fa4b4dae9ea79", tvs: [] },

    },
    getters: {
        getAPI: (state) => {
            return state.userData.api_key
        },

        getTVByIdx: (state) => {
            return (tvidx) => {
                return state.userData.tvs[tvidx]
            }
        },

        getTVIdxByID: (state) => {
            return (tvid) => {
                console.log("Getting tvidx by ID", tvid)
                return state.userData.tvs.findIndex(tv => tv.id === tvid)
            }
        },

        getTVIDByIdx: (state) => {
            return (tvidx) => {
                return state.userData.tvs[tvidx].id
            }
        },

        getSeasonByIdx: (state) => {
            return (tvidx, seasonidx) => {
                return state.userData.tvs[tvidx].seasons[seasonidx]
            }
        },

        getSeasonIdxByNumber: (state) => {
            return (tvidx, season_number) => {
                return state.userData.tvs[tvidx].seasons.findIndex(season => season.season_number === season_number)
            }
        },

        getEpisodeIdxByNumber: (state) => {
            return (tvidx, seasonidx, episode_number) => {
                return state.userData.tvs[tvidx].seasons[seasonidx].episodes.findIndex(episode => episode.episode_number === episode_number)
            }
        },

        getTVsByMode: (state) => {
            return (mode) => {
                if (mode == "all") {
                    return state.userData.tvs
                }
                return state.userData.tvs.filter(tv => tv.mode === mode)
            }
        },

        getTVByID: (state) => {
            return (tvid) => {
                return state.userData.tvs.find(tv => tv.id === tvid)
            }
        },

        getUserData: (state) => {
            return state.userData
        },

        isAddable(state) {
            return (tvid) => {
                if (tvid === 0) {
                    return false
                }

                let idx = state.userData.tvs.findIndex(tv => tv.id === tvid)

                if (idx >= 0) {
                    return idx
                }
                else {
                    return true
                }
            }
        },


        isAllable(state) {
            return (info) => {
                var { tvid, season_number, episode_number } = info

                let tvidx = state.userData.tvs.findIndex(tv => tv.id === tvid)

                let seasonidx = state.userData.tvs[tvidx].seasons.findIndex(season => season.season_number === season_number)

                if (season_number > 1 && episode_number > 1) {
                    return !(state.userData.tvs[tvidx].seasons.filter(season => season.season_number !== 0 && season.season_number < season_number).every(season => season.isFinished) && state.userData.tvs[tvidx].seasons[seasonidx].episodes.filter(episode => episode.episode_number < episode_number).every(episode => episode.isFinished))
                }
                if (season_number > 1 && episode_number == 1) {
                    return !state.userData.tvs[tvidx].seasons.filter(season => season.season_number !== 0 && season.season_number < season_number).every(season => season.isFinished)
                }
                else if (season_number === 1 && episode_number > 1) {
                    return !state.userData.tvs[tvidx].seasons[seasonidx].episodes.filter(episode => episode.episode_number < episode_number).every(episode => episode.isFinished)
                }
                return false
            }
        }

    },

    mutations: {
        addTV(state, newTV) {
            console.log(newTV)
            state.userData.tvs.unshift(newTV)
        },
        loadUserData(state, newUserData) {
            state.userData = newUserData
        },

        updateTV(state, { updater: updater, tvidx: tvidx }) {
            _.merge(state.userData.tvs[tvidx], updater)
        },

        markEpisodeFinished(state, { tvidx: tvidx, seasonidx: seasonidx, episodeidx: episodeidx, curTime: curTime }) {
            state.userData.tvs[tvidx].seasons[seasonidx].episodes[episodeidx].isFinished = true
            state.userData.tvs[tvidx].seasons[seasonidx].episodes[episodeidx].finishedDate = curTime
            state.userData.tvs[tvidx].seasons[seasonidx].confidentEpisode = state.userData.tvs[tvidx].seasons[seasonidx].episodes.findIndex(episode => episode.isFinished == false)
        },

        markSeasonFinished(state, { tvidx: tvidx, seasonidx: seasonidx, curTime: curTime }) {
            state.userData.tvs[tvidx].seasons[seasonidx].isFinished = true
            state.userData.tvs[tvidx].seasons[seasonidx].finishedDate = curTime
        },

        markTVFinished(state, { tvidx: tvidx, curTime: curTime }) {
            state.userData.tvs[tvidx].isFinished = true
            state.userData.tvs[tvidx].finishedDate = curTime
        },

        unmarkEpisode(state, { tvidx: tvidx, seasonidx: seasonidx, episodeidx: episodeidx }) {
            state.userData.tvs[tvidx].seasons[seasonidx].episodes[episodeidx].isFinished = false
            state.userData.tvs[tvidx].seasons[seasonidx].episodes[episodeidx].finishedDate = null
            state.userData.tvs[tvidx].seasons[seasonidx].confidentEpisode = state.userData.tvs[tvidx].seasons[seasonidx].episodes.findIndex(episode => episode.isFinished == false)
        },

        unmarkSeason(state, { tvidx: tvidx, seasonidx: seasonidx }) {
            state.userData.tvs[tvidx].seasons[seasonidx].isFinished = false
            state.userData.tvs[tvidx].seasons[seasonidx].finishedDate = null
        },

        unmarkTV(state, { tvidx: tvidx }) {
            state.userData.tvs[tvidx].isFinished = false
            state.userData.tvs[tvidx].finishedDate = null
        },

        setWhereAmI(state, tvidx) {
            try {
                console.log("setting where am i")
                state.userData.tvs[tvidx].where_am_i = state.userData.tvs[tvidx].seasons.filter(season => season.season_number > 0 && season.episodes.some(episode => episode.isFinished == true)).slice(-1)[0].episodes.filter(episode => episode.isFinished == true).slice(-1)[0]
                // console.log(state.userData.tvs[tvidx].where_am_i)
            }
            catch {
                console.log("error setting where am i, catching", state.userData)
                state.userData.tvs[tvidx].where_am_i = state.userData.tvs[tvidx].seasons.find(season => season.season_number === 1).episodes.find(episode => episode.episode_number === 1)
                console.log('setting where am i to S01E01')
            }

        },

        updateMode(state, tvidx) {
            if (state.userData.tvs[tvidx].mode === "stopped") {
                return
            }

            if (state.userData.tvs[tvidx].status === "In Production") {
                state.userData.tvs[tvidx].mode = "upcoming"
            }
            else if (state.userData.tvs[tvidx].isFinished === true && (state.userData.tvs[tvidx].status == "Ended" || state.userData.tvs[tvidx].status == "Canceled")) {
                state.userData.tvs[tvidx].mode = "finished"
            }
            else if (!state.userData.tvs[tvidx].seasons.some(season => season.isFinished == true || season.episodes.some(episode => episode.isFinished == true))) {
                state.userData.tvs[tvidx].mode = "notstart"
            }
            else if (state.userData.tvs[tvidx].last_episode_to_air.id === state.userData.tvs[tvidx].where_am_i.id) {
                state.userData.tvs[tvidx].mode = "following"
            }
            else if ((new Date(state.userData.tvs[tvidx].addDate).getTime() + 12096e5) > new Date().getTime() || (new Date(state.userData.tvs[tvidx].where_am_i.finishedDate).getTime() + 12096e5) > new Date().getTime()) {
                state.userData.tvs[tvidx].mode = "catching"
            }
            else {
                state.userData.tvs[tvidx].mode = "waiting"
            }

        }
    },

    actions: {
        async addTV(context, tvid) {
            // const bent = require("bent")
            const genUpdater = require("../shared/shared.js").default.genUpdater
            console.log(genUpdater)
            var addable = context.getters.isAddable(tvid)
            if (addable === false) {
                console.log("Nothing to update or add")
            } else {
                var updater = await genUpdater(tvid)
                if (addable === true) {
                    var tv = JSON.parse(JSON.stringify(updater))

                    tv.isFinished = "false"
                    tv.mode = "catching"
                    tv.finishedDate = null
                    tv.addDate = JSON.parse(JSON.stringify(new Date()))

                    await Promise.all(tv.seasons.map(async (season) => {
                        season.isFinished = false
                        season.finishedDate = null
                        season.confidentEpisode = 0

                        await Promise.all(season.episodes.map(episode => {
                            episode.isFinished = false
                            episode.finishedDate = null


                        }))
                    }))
                    var where_am_i = await tv.seasons.find(season => season.season_number === 1).episodes.find(episode => episode.episode_number === 1)

                    tv.where_am_i = where_am_i

                    context.commit("addTV", tv)
                }
                else {
                    context.commit("updateTV", { updater: updater, tvidx: addable })
                }
            }


        },

        async updateTV(context, tvidx) {
            const genUpdater = require("../shared/shared.js").default.genUpdater
            var tvid = context.getters.getTVIDByIdx(tvidx)
            var updater = await genUpdater(tvid)
            context.commit("updateTV", { updater, tvidx })
            context.commit("updateMode", tvidx)
        },

        markWatched(context, { isAll: isAll, info: { tvid: tvid, season_number: season_number, episode_number: episode_number } }) {
            var curTime = JSON.parse(JSON.stringify(new Date()))

            let tvidx = context.getters.getTVIdxByID(tvid)
            context.dispatch("updateTV", tvidx)
            let tv = context.getters.getTVByID(tvid)

            let seasonidx = context.getters.getSeasonIdxByNumber(tvidx, season_number)

            let episodeidx = context.getters.getEpisodeIdxByNumber(tvidx, seasonidx, episode_number)

            context.commit("markEpisodeFinished", { tvidx, seasonidx, episodeidx, curTime })


            if (isAll) {
                if (season_number > 1) {
                    console.log("running previous episodes");
                    for (var i = 0; i < seasonidx; i++) {
                        let season = context.getters.getSeasonByIdx(tvidx, i)
                        if (season.season_number !== 0 && season.isFinished !== true) {
                            for (var j = season.confidentEpisode; j < season.episode_count; j++) {
                                if (season.episodes[j].isFinished == false) {
                                    context.commit("markEpisodeFinished", { tvidx: tvidx, seasonidx: i, episodeidx: j, curTime: curTime })
                                }
                            }
                            context.commit("markSeasonFinished", { tvidx: tvidx, seasonidx: i, curTime: curTime })
                        }
                    }
                }
                for (var h = tv.seasons[seasonidx].confidentEpisode; h < episodeidx; h++) {
                    context.commit("markEpisodeFinished", { tvidx: tvidx, seasonidx: seasonidx, episodeidx: h, curTime: curTime })
                }

            }

            if (context.getters.getSeasonByIdx(tvidx, seasonidx).episodes.every(episode => episode.isFinished)) {
                context.commit("markSeasonFinished", { tvidx, seasonidx, curTime })
            }

            if (context.getters.getTVByIdx(tvidx).seasons.filter(season => season.season_number > 0).every(season => season.isFinished)) {
                context.commit("markTVFinished", { tvidx, curTime })
            }

            context.commit("setWhereAmI", tvidx)
            context.commit("updateMode", tvidx)
        },

        unmarkWatched(context, { tvid: tvid, season_number: season_number, episode_number: episode_number }) {

            let tvidx = context.getters.getTVIdxByID(tvid)

            let seasonidx = context.getters.getSeasonIdxByNumber(tvidx, season_number)

            let episodeidx = context.getters.getEpisodeIdxByNumber(tvidx, seasonidx, episode_number)

            context.commit("unmarkEpisode", { tvidx, seasonidx, episodeidx })
            context.commit("unmarkSeason", { tvidx, seasonidx })
            context.commit("unmarkTV", { tvidx })

            context.commit("setWhereAmI", tvidx)
            context.commit("updateMode", tvidx)
        }


    },

    plugins: [new VuexPersistence({ storage: localforage, asyncStorage: true }).plugin]
});
export default store

