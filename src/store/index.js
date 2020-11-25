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

                console.log(idx)
                if (idx >= 0) {
                    let tvState = state.userData.tvs[idx].status
                    let userState = state.userData.tvs[idx].mode
                    if (tvState === "Ended" || tvState === "Stopped" || (userState === "Finished" && tvState === "Ended")) {
                        return false
                    }
                    return idx
                }

                if (idx < 0) {
                    return true
                }
            }
        },


        isAllable(state) {
            return (info) => {
                var { tvid, season_number, episode_number } = info

                let tvidx = state.userData.tvs.findIndex(tv => tv.id === tvid)

                let seasonidx = state.userData.tvs[tvidx].seasons.findIndex(season => season.season_number === season_number)

                // let episodeidx = state.userData.tvs[tvidx].seasons[seasonidx].episodes.findIndex(episode => episode.episode_number === episode_number)

                if (season_number > 1 && episode_number > 1) {
                    return !(state.userData.tvs[tvidx].seasons.filter(season => season.season_number < season_number).every(season => season.isFinished) && state.userData.tvs[tvidx].seasons[seasonidx].episodes.filter(episode => episode.episode_number < episode_number).every(episode => episode.isFinished))
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

        updateTV(state, { updater: updater, addable: idx }) {
            console.log("Update", updater, idx)
            _.merge(state.userData.tvs[idx], updater)
            console.log(idx, "Updated")
        },

        markWatched(state, infoAll) {
            var { isAll, info } = infoAll
            console.log("mark isall", isAll)
            var { tvid, season_number, episode_number } = info
            var curTime = new Date()

            let tvidx = state.userData.tvs.findIndex(tv => tv.id === tvid)

            let seasonidx = state.userData.tvs[tvidx].seasons.findIndex(season => season.season_number === season_number)

            let episodeidx = state.userData.tvs[tvidx].seasons[seasonidx].episodes.findIndex(episode => episode.episode_number === episode_number)

            state.userData.tvs[tvidx].seasons[seasonidx].episodes[episodeidx].isFinished = true
            state.userData.tvs[tvidx].seasons[seasonidx].episodes[episodeidx].finishedDate = curTime

            if (isAll) {
                if (season_number > 1) {
                    state.userData.tvs[tvidx].seasons.filter(season => season.season_number < season_number && season.season_number > 0).forEach(season => {
                        season.episodes.forEach(episode => {
                            episode.isFinished = true
                            episode.finishedDate = curTime
                        })
                        season.isFinished = true
                        season.finishedDate = curTime
                    })
                }
                if (episode_number > 1) {
                    state.userData.tvs[tvidx].seasons[seasonidx].episodes.filter(episode => episode.episode_number < episode_number).forEach(episode => {
                        episode.isFinished = true
                        episode.finishedDate = curTime
                    })
                }

            }

            if (state.userData.tvs[tvidx].seasons[seasonidx].episodes.every(episode => episode.isFinished)) {
                state.userData.tvs[tvidx].seasons[seasonidx].isFinished = true
                state.userData.tvs[tvidx].seasons[seasonidx].finishedDate = curTime
            }

            if (state.userData.tvs[tvidx].seasons.every(season => season.isFinished)) {
                state.userData.tvs[tvidx].isFinished = true
                state.userData.tvs[tvidx].finishedDate = curTime
            }

            var where_am_i = state.userData.tvs[tvidx].seasons.filter(season =>
                season.episodes.some(episode => episode.isFinished === true)
            ).slice(-1)[0].episodes.filter(episode => episode.isFinished === true).slice(-1)[0]

            state.userData.tvs[tvidx].where_am_i = {
                season_number: where_am_i.season_number, episode_number: where_am_i.episode_number
            }
        },
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

    },

    actions: {
        async addTV(context, tvid) {
            const bent = require("bent")
            const getJson = bent("json")

            var addable = context.getters.isAddable(tvid)
            if (addable === false) {
                console.log("Nothing to update or add")
            } else {
                let api = await context.getters.getAPI
                let tv = await getJson(
                    `https://api.themoviedb.org/3/tv/${tvid}?api_key=${api}&language=en-US`
                )
                tv.first_air_date = new Date(tv.first_air_date)
                tv.last_air_date = new Date(tv.last_air_date)
                tv.last_episode_to_air.air_date = new Date(tv.last_episode_to_air.air_date)
                if (tv.next_episode_to_air !== null) {
                    tv.next_episode_to_air.air_date = new Date(tv.next_episode_to_air.air_date)
                }
                await Promise.all(tv.seasons.map(async (season) => {
                    let detailSeason = await getJson(
                        `https://api.themoviedb.org/3/tv/${tvid}/season/${season.season_number}?api_key=${api}&language=en-US`
                    )
                    season.episodes = await detailSeason.episodes
                    season.air_date = new Date(season.air_date)
                    await Promise.all(season.episodes.map(episode => {
                        episode.air_date = new Date(episode.air_date)
                        if (episode.season_number === 0) {
                            episode.total_number = episode.episode_number
                        }

                        if (episode.season_number === 1) {
                            episode.total_number = episode.episode_number
                        }

                        episode.total_number = tv.seasons.filter((season) =>
                            season.season_number < episode.season_number &&
                            season.season_number > 0).reduce((acc, season) => acc + season.episode_count, 0) + episode.episode_number
                    }))
                }))

                var updater = await JSON.parse(JSON.stringify(tv))

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

                tv = await JSON.parse(JSON.stringify(tv))

                if (addable === true) {
                    context.commit("addTV", tv)
                }
                else {
                    console.log("Update because", addable)
                    context.commit("updateTV", { updater: updater, addable: addable })
                }

            }


        }


    },
    plugins: [createPersistedState()]
});

export default store