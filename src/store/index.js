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
                console.log("allable, input", info)
                let tvidx = state.userData.tvs.findIndex(tv => tv.id === tvid)

                let seasonidx = state.userData.tvs[tvidx].seasons.findIndex(season => season.season_number === season_number)

                // let episodeidx = state.userData.tvs[tvidx].seasons[seasonidx].episodes.findIndex(episode => episode.episode_number === episode_number)
                console.log("allable, idxs", tvidx, seasonidx)
                if (season_number > 1 && episode_number > 1) {
                    return !(state.userData.tvs[tvidx].seasons.filter(season => season.season_number < season_number).every(season => season.isFinished) && state.userData.tvs[tvidx].seasons[seasonidx].episodes.filter(episode => episode.episode_number < episode_number).every(episode => episode.isFinished))
                }
                else if (season_number === 1 && episode_number > 1) {
                    return !state.userData.tvs[tvidx].seasons[seasonidx].episodes.filter(episode => episode.episode_number < episode_number).every(episode => episode.isFinished)
                }
                return false
            }
        }

    }, mutations: {
        addTV2UserData(state, newTV) {
            console.log(newTV)
            state.userData.tvs.unshift(newTV)
        },
        loadUserData(state, newUserData) {
            state.userData = newUserData
        },

        updateUserDataTV(state, tv, idx) {
            _.extend(state.tvs[idx], tv)
        },

        markWatched(state, infoAll) {
            var { isAll, info } = infoAll
            console.log("mark isall", isAll)
            var { tvid, season_number, episode_number } = info

            let tvidx = state.userData.tvs.findIndex(tv => tv.id === tvid)

            let seasonidx = state.userData.tvs[tvidx].seasons.findIndex(season => season.season_number === season_number)

            let episodeidx = state.userData.tvs[tvidx].seasons[seasonidx].episodes.findIndex(episode => episode.episode_number === episode_number)
            console.log("mark, idxs", tvidx, seasonidx, episodeidx)
            state.userData.tvs[tvidx].seasons[seasonidx].episodes[episodeidx].isFinished = true

            if (isAll) {
                if (season_number > 1) {
                    state.userData.tvs[tvidx].seasons.filter(season => season.season_number < season_number && season.season_number > 0).forEach(season => {
                        season.episodes.forEach(episode => episode.isFinished = true)
                        season.isFinished = true
                    })
                }
                if (episode_number > 1) {
                    state.userData.tvs[tvidx].seasons[seasonidx].episodes.filter(episode => episode.episode_number < episode_number).forEach(episode => episode.isFinished = true)
                }

            }

            if (state.userData.tvs[tvidx].seasons[seasonidx].episodes.every(episode => episode.isFinished)) {
                state.userData.tvs[tvidx].seasons[seasonidx].isFinished = true
            }

            if (state.userData.tvs[tvidx].seasons.every(season => season.isFinished)) {
                state.userData.tvs[tvidx].isFinished = true
            }
        },

    },
    plugins: [createPersistedState()]
});

export default store