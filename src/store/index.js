import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import localforage from 'localforage'
// import createPersistedState from 'vuex-persistedstate'
import _ from "lodash"
// import shared from '../shared/shared.js'


Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        userData: {
            tvs: [],
            mvs: [],
        },
        api_key: "",
        username: "",
        avatar: "",
        token: "",
        gist: "",
        loginCode: "",
        mode: false,
        tvSort: "LE",
        tvSearch: "",
        tvMode: "catching",
        mvSort: "LE",
        mvSearch: "",
        mvMode: "listed"

    },
    getters: {
        getGist: (state) => {
            return state.gist
        },
        getToken: (state) => {
            return state.token
        },
        getMode: (state) => {
            return state.mode
        },

        getMVMode: (state) => {
            return state.mvMode
        },

        getMVSearch: (state) => {
            return state.mvSearch
        },

        getMVSort: (state) => {
            return state.mvSort
        },

        getTVMode: (state) => {
            return state.tvMode
        },

        getTVSearch: (state) => {
            return state.tvSearch
        },

        getTVSort: (state) => {
            return state.tvSort
        },


        getAPI: (state) => {
            return state.api_key
        },

        getUsername: (state) => {
            return state.username
        },

        getAvatar: (state) => {
            return state.avatar
        },

        getTVNumber: (state) => {
            return state.userData.tvs.length
        },
        getMVNumber: (state) => {
            return state.userData.mvs.length
        },

        getTVByIdx: (state) => {
            return (tvidx) => {
                return state.userData.tvs[tvidx]
            }
        },

        getMVByIdx: (state) => {
            return (mvidx) => {
                return state.userData.mvs[mvidx]
            }
        },

        getTotalWatchedTV: (state) => {
            return state.userData.tvs.reduce((acc, tv) => acc + (tv.seasons.reduce((acc, season) => acc + season.episodes.filter(episode => episode.isFinished).length, 0)), 0)
        },


        getTotalWatchedMV: (state) => {
            return state.userData.mvs.reduce((acc, mv) => acc + (mv.isFinished ? 1 : 0), 0)
        },

        getMVWatchedTime: (state) => {
            let totalTime = state.userData.mvs.reduce((acc, mv) => acc + (mv.isFinished ? mv.runtime : 0), 0)
            let month = Math.floor(totalTime / 43200)
            totalTime -= month * 43200
            let day = Math.floor(totalTime / 1440)
            totalTime -= day * 1440
            let hour = Math.floor(totalTime / 60)

            return [month, day, hour]
        },

        getMVWatchedTimeBy: (state) => {
            return (para, num) => {
                Date.prototype.getWeekNumber = function () {
                    var d = new Date(
                        Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
                    );
                    var dayNum = d.getUTCDay() || 7;
                    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
                    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
                    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
                };

                let mvs = state.userData.mvs.filter(mv => mv.isFinished && para == 0 ? (new Date(mv.finishedDate).getTime() > new Date().getTime() - 1.051e+10 && new Date(mv.finishedDate).getWeekNumber() == num) : para == 1 ? (new Date(mv.finishedDate).getTime() >= new Date().getTime() - 3.469e+10 && new Date(mv.finishedDate).getMonth() == num) : (new Date(mv.finishedDate).getFullYear() == num))

                return Math.floor(mvs.reduce((acc, mv) => acc + mv.runtime, 0) / 60)
            }
        },

        getMVWatchedNumberBy: (state) => {
            return (para, num) => {
                Date.prototype.getWeekNumber = function () {
                    var d = new Date(
                        Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
                    );
                    var dayNum = d.getUTCDay() || 7;
                    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
                    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
                    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
                };

                return state.userData.mvs.filter(mv => mv.isFinished && para == 0 ? (new Date(mv.finishedDate).getTime() > new Date().getTime() - 1.051e+10 && new Date(mv.finishedDate).getWeekNumber() == num) : para == 1 ? (new Date(mv.finishedDate).getTime() >= new Date().getTime() - 3.469e+10 && new Date(mv.finishedDate).getMonth() == num) : (new Date(mv.finishedDate).getFullYear() == num)).length

            }
        },

        getTVWatchedNumberBy: (state) => {
            return (para, num) => {
                Date.prototype.getWeekNumber = function () {
                    var d = new Date(
                        Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
                    );
                    var dayNum = d.getUTCDay() || 7;
                    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
                    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
                    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
                };

                return state.userData.tvs.reduce((acc, tv) => acc + (tv.seasons.reduce((acc, season) => acc + season.episodes.filter(episode => episode.isFinished && para == 0 ? (new Date(episode.finishedDate).getTime() > new Date().getTime() - 1.051e+10 && new Date(episode.finishedDate).getWeekNumber() == num) : (para == 1 ? (new Date(episode.finishedDate).getTime() >= new Date().getTime() - 3.469e+10 && new Date(episode.finishedDate).getMonth() == num) : (new Date(episode.finishedDate).getFullYear() == num))).length, 0)), 0)
            }
        },

        getTVWatchedTimeBy: (state) => {
            return (para, num) => {
                Date.prototype.getWeekNumber = function () {
                    var d = new Date(
                        Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
                    );
                    var dayNum = d.getUTCDay() || 7;
                    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
                    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
                    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
                };



                return state.userData.tvs.reduce((acc, tv) => acc + (tv.seasons.reduce((acc, season) => acc + season.episodes.filter(episode => episode.isFinished && para == 0 ? (new Date(episode.finishedDate).getTime() > new Date().getTime() - 1.051e+10 && new Date(episode.finishedDate).getWeekNumber() == num) : (para == 1 ? (new Date(episode.finishedDate).getTime() >= new Date().getTime() - 3.469e+10 && new Date(episode.finishedDate).getMonth() == num) : (new Date(episode.finishedDate).getFullYear() == num))).length, 0)), 0)
            }
        },

        getTVWatchedTime: () => {
            return [0, 0, 0]
        },

        getTVIdxByID: (state) => {
            return (tvid) => {

                return state.userData.tvs.findIndex(tv => tv.id === tvid)
            }
        },

        getMVIdxByID: (state) => {
            return (mvid) => {

                return state.userData.mvs.findIndex(mv => mv.id === mvid)
            }
        },

        getTVIDByIdx: (state) => {
            return (tvidx) => {
                return state.userData.tvs[tvidx].id
            }
        },

        getMVIDByIdx: (state) => {
            return (mvidx) => {
                return state.userData.mvs[mvidx].id
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

        getMVsByMode: (state) => {
            return (mode) => {
                if (mode == "all") {
                    return state.userData.mvs
                }
                return state.userData.mvs.filter(mv => mv.mode === mode)
            }
        },

        getTVByID: (state) => {
            return (tvid) => {
                return state.userData.tvs.find(tv => tv.id === tvid)
            }
        },

        getTVLastUpDate: (state) => {
            return (tvidx) => {
                return state.userData.tvs[tvidx].lastUpDate
            }
        },

        getMVLastUpDate: (state) => {
            return (mvidx) => {
                return state.userData.mvs[mvidx].lastUpDate
            }
        },

        getUserData: (state) => {
            return state.userData
        },

        getSaveData: (state) => {
            return [state.userData.tvs.map(tv => ([
                tv.id,
                tv.mode,
                new Date(tv.addDate).toISOString().slice(0, 10),
                tv.finishedDate == null ? "" : new Date(tv.finishedDate).toISOString().slice(0, 10),
                tv.where_am_i.id,
                tv.seasons.map(season => ([
                    season.finishedDate == null ? "" : new Date(season.finishedDate).toISOString().slice(0, 10),
                    season.confidentEpisode,
                    season.episodes.map(episode => (
                        episode.finishedDate == null ? "" : new Date(episode.finishedDate).toISOString().slice(0, 10)
                    ))
                ]))
            ])),
            state.userData.mvs.map(mv => ([
                mv.id,
                mv.mode,
                new Date(mv.addDate).toISOString().slice(0, 10),
                mv.finishedDate == null ? "" : new Date(mv.finishedDate).toISOString().slice(0, 10)
            ]))
            ]
        },

        isAddable(state) {
            return (id) => {
                if (id === 0) {
                    return false
                }

                if (state.mode) {
                    let tvidx = state.userData.tvs.findIndex(tv => tv.id == id)
                    if (tvidx >= 0) {
                        return tvidx
                    }
                    else {
                        return true
                    }
                }
                else {
                    let mvidx = state.userData.mvs.findIndex(mv => mv.id == id)
                    if (mvidx >= 0) {
                        return mvidx
                    }
                    else {
                        return true
                    }
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
        setGist(state, id) {
            state.gist = id
        },
        setAccessToken(state, token) {
            state.token = token
        },
        // setLoginCode(state, code) {
        //     state.loginCode = code
        // },
        setApiKey(state, api_key) {
            api_key = "49ae83b320a43c660d6fa4b4dae9ea79"
            state.api_key = api_key
        },
        setUsername(state, username) {
            state.username = username
        },
        changeMode(state) {
            state.mode = !state.mode
            state.tvSearch = ""
            state.mvSearch = ""
        },
        addTV(state, newTV) {

            state.userData.tvs.unshift(newTV)

        },

        addMV(state, newMV) {

            state.userData.mvs.unshift(newMV)

        },

        setAvatar(state, url) {
            state.avatar = url
        },

        loadUserData(state, newUserData) {
            state.userData = newUserData
        },

        updateTV(state, { updater: updater, tvidx: tvidx }) {
            _.merge(state.userData.tvs[tvidx], updater)
            state.userData.tvs[tvidx].lastUpDate = JSON.parse(JSON.stringify(new Date()))
        },

        updateMV(state, { updater: updater, mvidx: mvidx }) {
            _.merge(state.userData.mvs[mvidx], updater)
            state.userData.mvs[mvidx].lastUpDate = JSON.parse(JSON.stringify(new Date()))
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

        changeEpisodeFinishedDate(state, { tvidx: tvidx, seasonidx: seasonidx, episodeidx: episodeidx, date: date }) {
            state.userData.tvs[tvidx].seasons[seasonidx].episodes[episodeidx].finishedDate = date
            if (state.userData.tvs[tvidx].seasons[seasonidx].isFinished) {
                state.userData.tvs[tvidx].seasons[seasonidx].finishedDate = Math.max.apply(Math, state.userData.tvs[tvidx].seasons[seasonidx].episodes.map(episode => new Date(episode.finishedDate).getTime()))
            }
            if (state.userData.tvs[tvidx].isfinished) {
                state.userData.tvs[tvidx].finishedDate = Math.max.apply(Math, state.userData.tvs[tvidx].seasons.map(season => new Date(season.finishedDate).getTime()))
            }
            if (state.userData.tvs[tvidx].seasons[seasonidx].episodes[episodeidx].id == state.userData.tvs[tvidx].where_am_i.id) {
                state.userData.tvs[tvidx].where_am_i.finishedDate = date
            }
        },

        markMVFinished(state, { mvidx: mvidx, curTime: curTime }) {
            state.userData.mvs[mvidx].isFinished = true
            state.userData.mvs[mvidx].finishedDate = curTime
            state.userData.mvs[mvidx].mode = "watched"
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

        unmarkMV(state, { mvidx: mvidx }) {
            state.userData.mvs[mvidx].isFinished = false
            state.userData.mvs[mvidx].finishedDate = null
            state.userData.mvs[mvidx].mode = (new Date(state.userData.mvs[mvidx].release_date).getTime() > new Date().getTime()) ? "upcoming" : "listed"
        },

        setWhereAmI(state, tvidx) {
            state.userData.tvs[tvidx].where_am_i = state.userData.tvs[tvidx].seasons.filter(season => season.season_number > 0 && season.episodes.some(episode => episode.isFinished == true)).slice(-1)[0].episodes.filter(episode => episode.isFinished == true).slice(-1)[0]

            if (state.userData.tvs[tvidx].where_am_i == undefined) {
                state.userData.tvs[tvidx].where_am_i = state.userData.tvs[tvidx].seasons.find(season => season.season_number === 1).episodes.find(episode => episode.episode_number === 1)
            }
            console.log("seted where am i in", state.userData.tvs[tvidx].name)
            console.log("I am", state.userData.tvs[tvidx])
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
            else if (state.userData.tvs[tvidx].last_episode_to_air.season_number <= state.userData.tvs[tvidx].where_am_i.season_number && state.userData.tvs[tvidx].last_episode_to_air.episode_number <= state.userData.tvs[tvidx].where_am_i.episode_number) {
                state.userData.tvs[tvidx].mode = "following"
            }
            else if ((new Date(state.userData.tvs[tvidx].addDate).getTime() + 12096e5) > new Date().getTime() || (new Date(state.userData.tvs[tvidx].where_am_i.finishedDate).getTime() + 12096e5) > new Date().getTime()) {
                state.userData.tvs[tvidx].mode = "catching"
            }
            else {
                state.userData.tvs[tvidx].mode = "waiting"
            }

        },

        // updateModeMV(state, mvidx) {
        //     if (state.userData.mvs[mvidx].isFinished) {
        //         state.userData.mvs[mvidx].mode = "watched"
        //     }
        //     else if (new Date(state.userData.mvs[mvidx].release_date).getTime() > new Date().getTime) {
        //         state.userData.mvs[mvidx].mode = "upcoming"
        //     }
        // },

        deleteTV(state, tvidx) {
            state.userData.tvs.splice(tvidx, 1)
        },

        deleteMV(state, mvidx) {
            state.userData.mvs.splice(mvidx, 1)
        },

        setProgress(state, { tvidx: tvidx, percentage: percentage }) {
            state.userData.tvs[tvidx].progress = percentage
        },

        setTVMode(state, mode) {
            state.tvMode = mode
        },

        setTVSearch(state, search) {
            state.tvSearch = search
        },

        setTVSort(state, sort) {
            state.tvSort = sort
        },
        setMVMode(state, mode) {
            state.mvMode = mode
        },

        setMVSearch(state, search) {
            state.mvSearch = search
        },

        setMVSort(state, sort) {
            state.mvSort = sort
        },

        changeMVFinishedDate(state, { mvidx: mvidx, date: date }) {
            state.userData.mvs[mvidx].finishedDate = date
        },
    },

    actions: {
        async setAccessToken(context, code) {
            console.log("start to process token", code)
            fetch(`https://pumpkincors.herokuapp.com/http://github.com/login/oauth/access_token?client_id=4a56fb45e857832a9fae&client_secret=bf8e1facecb0f2dc01f4b7c40b594fd3f12cd285&code=${code}`).then(res => res.text()).then(url => {
                console.log("got token", url)
                context.commit("setAccessToken", new URLSearchParams(url).get("access_token"))
                context.dispatch("setGist")
                context.dispatch("setUsername")
            });
        },

        async setGist(context) {
            fetch("https://api.github.com/gists", {
                method: "GET",
                headers: {
                    Accept: "application/vnd.github.v3+json",
                    Authorization: `bearer ${context.getters.getToken}`
                }
            }).then((res) => res.json()).then(json => {
                if (json.some(gist => "PumpkinTVSave.json" in gist.files)) {
                    context.commit("setGist", json.find(gist => "PumpkinTVSave.json" in gist.files).id)
                }
                else {
                    fetch("https://api.github.com/gists", {
                        method: "POST",
                        headers: {
                            Accept: "application/vnd.github.v3+json",
                            Authorization: `bearer ${context.getters.getToken} `,
                        },
                        body: JSON.stringify({
                            description: "PumpkinTV saved progress",
                            public: false,
                            files: {
                                ["PumpkinTVSave.json"]: {
                                    content: "",
                                },
                            },
                        }),
                    }).then((res) => res.json()).then((json) => context.commit("setGist", json.id));
                }
            })

        },

        setApiKey(context, api_key) {
            context.commit("setApiKey", api_key)
        },
        async setUsername(context) {
            fetch("https://api.github.com/user", {
                method: "GET",
                headers: {
                    // "Access-Control-Allow-Origin": "*",
                    Accept: "application/vnd.github.v3+json",
                    Authorization: `bearer ${context.getters.getToken}`
                }
            }).then((res) => res.json()).then(json => {
                context.commit("setUsername", json.login)
                context.commit("setAvatar", json.avatar_url)
            })
        },

        async recoverFromSave(context, saveData) {
            const genUpdater = require("../shared/shared.js").default.genUpdater
            const genUpdaterMV = require("../shared/shared.js").default.genUpdaterMV
            var tvs = saveData[0]
            var mvs = saveData[1]
            var newTVs = []
            var newMVs = []

            await Promise.all(tvs.map(async (tv) => {
                var genTV = await genUpdater(tv[0]);
                genTV.isFinished = tv[3] == "" ? false : true
                genTV.mode = tv[1]
                genTV.addDate = JSON.parse(JSON.stringify(new Date(tv[2])))
                genTV.finishedDate = tv[3] == "" ? null : JSON.parse(JSON.stringify(new Date(tv[3])))
                genTV.where_am_i = genTV.seasons.find(season => season.episodes.some(episode => episode.id == tv[4])).episodes.find(episode => episode.id == tv[4])
                genTV.lastUpDate = JSON.parse(JSON.stringify(new Date()))
                await Promise.all(genTV.seasons.map(async (genSeason, seasonidx) => {
                    if (seasonidx < tv[5].length) {
                        genSeason.isFinished = tv[5][seasonidx][0] == "" ? false : true
                        genSeason.finishedDate = tv[5][seasonidx][0] == "" ? null : JSON.parse(JSON.stringify(new Date(tv[5][seasonidx][0])))
                        genSeason.confidentEpisode = tv[5][seasonidx][1]
                        await Promise.all(genSeason.episodes.map(async (genEpisode, episodeidx) => {
                            genEpisode.isFinished = tv[5][seasonidx][2][episodeidx] == "" ? false : true
                            genEpisode.finishedDate = tv[5][seasonidx][2][episodeidx] == "" ? null : JSON.parse(JSON.stringify(new Date(tv[5][seasonidx][2][episodeidx])))
                        }))
                    }
                }))
                newTVs.push(genTV)
            }))

            await Promise.all(mvs.map(async (mv) => {
                var genMV = await genUpdaterMV(mv[0]);
                genMV.isFinished = mv[3] == "" ? false : true
                genMV.mode = mv[1]
                genMV.finishedDate = mv[3] == "" ? null : JSON.parse(JSON.stringify(new Date(mv[3])))
                genMV.addDate = JSON.parse(JSON.stringify(new Date(mv[2])))
                genMV.lastUpDate = JSON.parse(JSON.stringify(new Date()))

                newMVs.push(genMV)
            })
            )
            var userData = { tvs: newTVs, mvs: newMVs }
            console.log("I am userData", userData)
            context.commit("loadUserData", userData)
        },

        async addTV(context, tvid) {

            const genUpdater = require("../shared/shared.js").default.genUpdater

            var addable = context.getters.isAddable(tvid)
            if (addable === false) {
                // console.log("Nothing to update or add")
            } else {
                if (addable === true) {
                    var updater = await genUpdater(tvid)
                    var tv = JSON.parse(JSON.stringify(updater))

                    tv.isFinished = "false"
                    tv.mode = "catching"
                    tv.finishedDate = null
                    tv.addDate = JSON.parse(JSON.stringify(new Date()))
                    tv.lastUpDate = JSON.parse(JSON.stringify(new Date()))

                    await Promise.all(tv.seasons.map(async (season) => {
                        season.isFinished = false
                        season.finishedDate = null
                        season.confidentEpisode = 0

                        await Promise.all(season.episodes.map(episode => {
                            episode.isFinished = false
                            episode.finishedDate = null


                        }))
                    }))

                    tv.where_am_i = await tv.seasons.find(season => season.season_number === 1).episodes.find(episode => episode.episode_number === 1)

                    context.commit("addTV", tv)
                }
                else {
                    context.dispatch("updateTV", { tvidx: addable, force: false })
                }
            }


        },

        async addMV(context, mvid) {
            const genUpdater = require("../shared/shared.js").default.genUpdaterMV
            var addable = context.getters.isAddable(mvid)

            if (addable === false) {
                console.log("not addable no update")
            } else {
                if (addable === true) {
                    var updater = await genUpdater(mvid)
                    var mv = JSON.parse(JSON.stringify(updater))
                    mv.isFinished = false
                    mv.mode = (new Date(mv.release_date).getTime() > new Date().getTime()) ? "upcoming" : "listed"
                    mv.finishedDate = null
                    mv.addDate = JSON.parse(JSON.stringify(new Date()))
                    context.commit("addMV", mv)

                }
                else {
                    context.dispatch("updateMV", addable)
                }
            }


        },

        async updateTV(context, { tvidx: tvidx, force: force }) {
            console.log("updatetv", tvidx)
            var tvid = context.getters.getTVIDByIdx(tvidx)
            if (force) {
                const genUpdater = require("../shared/shared.js").default.genUpdater
                var updater = await genUpdater(tvid)
                context.commit("updateTV", { updater, tvidx })
            }
            else {


                if (new Date(context.getters.getTVLastUpDate(tvidx)).getTime() > new Date().getTime() - 24 * 60 * 60 * 1000) {
                    console.log("too soon to update")
                }
                else {
                    const genUpdater = require("../shared/shared.js").default.genUpdater
                    updater = await genUpdater(tvid)
                    context.commit("updateTV", { updater, tvidx })
                }
            }
            context.commit("updateMode", tvidx)
        },

        async updateMV(context, mvidx) {
            var mvid = context.getters.getMVIDByIdx(mvidx)
            // const bent = require("bent")
            // const getJson = bent("json")
            // let changeList = []
            // let page = 1
            // while (page) {
            //     let change = await getJson(`https://api.themoviedb.org/3/movie/changes?api_key=${context.getters.getAPI}&page=${page}`)

            //     if (change.results.length >= 100) {
            //         page++
            //         changeList.concat(change.results)
            //     }
            //     else {
            //         break;
            //     }

            // }

            if (new Date(context.getters.getMVLastUpDate(mvidx).getTime() > new Date().getTime() - 24 * 60 * 60 * 1000)) {
                console.log("no change no update")
            }
            else {
                const genUpdater = require("../shared/shared.js").default.genUpdaterMV
                var updater = await genUpdater(mvid)
                context.commit("updateMV", { updater, mvidx })
            }

            // context.commit("updateMode", tvidx)
        },

        markWatched(context, { isAll: isAll, info: { tvid: tvid, season_number: season_number, episode_number: episode_number } }) {
            var curTime = JSON.parse(JSON.stringify(new Date()))

            let tvidx = context.getters.getTVIdxByID(tvid)
            console.log("markWatched", tvidx)
            context.dispatch("updateTV", { tvidx: tvidx, force: false })
            let tv = context.getters.getTVByID(tvid)

            let seasonidx = context.getters.getSeasonIdxByNumber(tvidx, season_number)

            let episodeidx = context.getters.getEpisodeIdxByNumber(tvidx, seasonidx, episode_number)

            context.commit("markEpisodeFinished", { tvidx, seasonidx, episodeidx, curTime })


            if (isAll) {
                if (season_number > 1) {

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

        changeEpisodeFinishedDate(context, { tvidx: tvidx, season_number: season_number, episode_number: episode_number, date: date }) {
            let seasonidx = context.getters.getSeasonIdxByNumber(tvidx, season_number)

            let episodeidx = context.getters.getEpisodeIdxByNumber(tvidx, seasonidx, episode_number)

            context.commit("changeEpisodeFinishedDate", { tvidx, seasonidx, episodeidx, date })
        },

        markWatchedMV(context, mvid) {
            var curTime = JSON.parse(JSON.stringify(new Date()))
            let mvidx = context.getters.getMVIdxByID(mvid)
            context.commit("markMVFinished", { mvidx, curTime })
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
        },

        unmarkWatchedMV(context, mvid) {

            let mvidx = context.getters.getMVIdxByID(mvid)

            context.commit("unmarkMV", { mvidx })

        },

        deleteTV(context, tvid) {

            let tvidx = context.getters.getTVIdxByID(tvid)

            context.commit("deleteTV", tvidx)
        },


        deleteMV(context, mvid) {

            let mvidx = context.getters.getMVIdxByID(mvid)

            context.commit("deleteMV", mvidx)
        },

        setProgress(context, { tvid: tvid, percentage: percentage }) {
            let tvidx = context.getters.getTVIdxByID(tvid)
            context.commit("setProgress", { tvidx, percentage })
        },

        changeMVFinishedDate(context, { mvidx: mvidx, date: date }) {
            context.commit("changeMVFinishedDate", { mvidx, date })
        },



    },

    plugins: [new VuexPersistence({ storage: localforage, asyncStorage: true }).plugin]
});
export default store

