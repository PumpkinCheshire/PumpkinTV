import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
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
                console.log("Store", mode)
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
            console.log("Update", updater, tvidx)
            _.merge(state.userData.tvs[tvidx], updater)

        },

        markEpisodeFinished(state, { tvidx: tvidx, seasonidx: seasonidx, episodeidx: episodeidx, curTime: curTime }) {
            state.userData.tvs[tvidx].seasons[seasonidx].episodes[episodeidx].isFinished = true
            state.userData.tvs[tvidx].seasons[seasonidx].episodes[episodeidx].finishedDate = curTime
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
            var where_am_i = state.userData.tvs[tvidx].seasons.filter(season =>
                season.episodes.some(episode => episode.isFinished === true)
            ).slice(-1)[0].episodes.filter(episode => episode.isFinished === true).slice(-1)[0]

            state.userData.tvs[tvidx].where_am_i = {
                season_number: where_am_i.season_number, episode_number: where_am_i.episode_number
            }

        },

        // markWatched(state, infoAll) {
        //     var { isAll, info } = infoAll

        //     var { tvid, season_number, episode_number } = info
        //     var curTime = JSON.parse(JSON.stringify(new Date()))

        //     let tvidx = state.userData.tvs.findIndex(tv => tv.id === tvid)

        //     let seasonidx = state.userData.tvs[tvidx].seasons.findIndex(season => season.season_number === season_number)

        //     let episodeidx = state.userData.tvs[tvidx].seasons[seasonidx].episodes.findIndex(episode => episode.episode_number === episode_number)

        //     state.userData.tvs[tvidx].seasons[seasonidx].episodes[episodeidx].isFinished = true
        //     state.userData.tvs[tvidx].seasons[seasonidx].episodes[episodeidx].finishedDate = curTime

        //     if (isAll) {
        //         if (season_number > 1) {
        //             state.userData.tvs[tvidx].seasons.filter(season => season.season_number < season_number && season.season_number > 0).forEach(season => {
        //                 season.episodes.forEach(episode => {
        //                     episode.isFinished = true
        //                     episode.finishedDate = curTime
        //                 })
        //                 season.isFinished = true
        //                 season.finishedDate = curTime
        //             })
        //         }
        //         if (episode_number > 1) {
        //             state.userData.tvs[tvidx].seasons[seasonidx].episodes.filter(episode => episode.episode_number < episode_number).forEach(episode => {
        //                 episode.isFinished = true
        //                 episode.finishedDate = curTime
        //             })
        //         }

        //     }

        //     if (state.userData.tvs[tvidx].seasons[seasonidx].episodes.every(episode => episode.isFinished)) {
        //         state.userData.tvs[tvidx].seasons[seasonidx].isFinished = true
        //         state.userData.tvs[tvidx].seasons[seasonidx].finishedDate = curTime
        //     }

        //     if (state.userData.tvs[tvidx].seasons.every(season => season.isFinished)) {
        //         state.userData.tvs[tvidx].isFinished = true
        //         state.userData.tvs[tvidx].finishedDate = curTime
        //     }

        //     var where_am_i = state.userData.tvs[tvidx].seasons.filter(season =>
        //         season.episodes.some(episode => episode.isFinished === true)
        //     ).slice(-1)[0].episodes.filter(episode => episode.isFinished === true).slice(-1)[0]

        //     state.userData.tvs[tvidx].where_am_i = {
        //         season_number: where_am_i.season_number, episode_number: where_am_i.episode_number
        //     }
        // },
        unmarkWatched(state, info) {
            var { tvid, season_number, episode_number } = info
            console.log(tvid, season_number, episode_number)
            let tvidx = state.userData.tvs.findIndex(tv => tv.id === tvid)

            let seasonidx = state.userData.tvs[tvidx].seasons.findIndex(season => season.season_number === season_number)

            let episodeidx = state.userData.tvs[tvidx].seasons[seasonidx].episodes.findIndex(episode => episode.episode_number === episode_number)

            state.userData.tvs[tvidx].seasons[seasonidx].episodes[episodeidx].isFinished = false
            state.userData.tvs[tvidx].seasons[seasonidx].episodes[episodeidx].finishedDate = null

            state.userData.tvs[tvidx].seasons[seasonidx].isFinished = false
            state.userData.tvs[tvidx].seasons[seasonidx].finishedDate = null

            state.userData.tvs[tvidx].isFinished = false
            state.userData.tvs[tvidx].finishedDate = null

            var where_am_i = state.userData.tvs[tvidx].seasons.filter(season =>
                season.episodes.some(episode => episode.isFinished === true)
            ).slice(-1)[0].episodes.filter(episode => episode.isFinished === true).slice(-1)[0]

            state.userData.tvs[tvidx].where_am_i = {
                season_number: where_am_i.season_number, episode_number: where_am_i.episode_number
            }
        },
        // updateMode(state, tvid) {
        //     var tv = state.getters.getTVByID(tvid)

        //     // following: already at the newest episode or one episode behind:


        // }
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

                    await Promise.all(tv.seasons.map(async (season) => {
                        season.isFinished = false
                        season.finishedDate = null

                        await Promise.all(season.episodes.map(episode => {
                            episode.isFinished = false
                            episode.finishedDate = null


                        }))
                    }))
                    var where_am_i = await tv.seasons.find(season => season.season_number === 1).episodes.find(episode => episode.episode_number === 1)

                    tv.where_am_i = {
                        season_number: where_am_i.season_number,
                        episode_number: where_am_i.episode_number
                    }
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
                    tv.seasons.filter(season => season.season_number < season_number && season.season_number > 0).forEach((season, seasonidx) => {
                        season.episodes.forEach((episode, episodeidx) => {
                            context.commit("markEpisodeFinished", { tvidx, seasonidx, episodeidx, curTime })
                        })
                        context.commit("markSeasonFinished", { tvidx, seasonidx, curTime })
                    })

                    tv.seasons[seasonidx].episodes.filter(episode => episode.episode_number < episode_number).forEach((episode, episodeidx) => {
                        context.commit("markEpisodeFinished", { tvidx, seasonidx, episodeidx, curTime })
                    })
                }

            }

            if (context.getters.getSeasonByIdx(tvidx, seasonidx).episodes.every(episode => episode.isFinished)) {
                context.commit("markSeaonFinished", { tvidx, seasonidx, curTime })
            }

            if (context.getters.getTVByIdx(tvidx).seasons.every(season => season.isFinished)) {
                context.commit("markTVFinished", { tvidx, curTime })
            }

            context.commit("setWhereAmI", tvidx)
        },

        unmarkWatched(context, { tvid: tvid, season_number: season_number, episode_number: episode_number }) {

            let tvidx = context.getters.getTVIdxByID(tvid)

            let seasonidx = context.getters.getSeasonIdxByNumber(tvidx, season_number)

            let episodeidx = context.getters.getEpisodeIdxByNumber(tvidx, seasonidx, episode_number)

            context.commit("unmarkEpisode", { tvidx, seasonidx, episodeidx })
            context.commit("unmarkSeason", { tvidx, seasonidx })
            context.commit("unmarkTV", { tvidx })

            context.commit("setWhereAmI")
        }


    },

    plugins: [createPersistedState()]
});
export default store

