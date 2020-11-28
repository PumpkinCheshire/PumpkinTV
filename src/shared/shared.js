const bent = require("bent")
const getJson = bent("json")
import store from '../store'

async function genUpdater(tvid) {
    let api = await store.getters.getAPI
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

    return await JSON.parse(JSON.stringify(tv))
}

function saveUserData(userData) {
    const parsedUserData = JSON.stringify(userData);
    localStorage.setItem('userData', parsedUserData);
}

async function initTV(api_key, tvid) {
    var tv = await genUpdater(api_key, tvid).then(updater => updater)
    console.log("Im initTV", tv)
    tv.isFinished = "false"
    tv.mode = "catching"
    await Promise.all(tv.seasons.map(async (season) => {
        season.isFinished = false

        await Promise.all(season.episodes.map(episode => {
            episode.isFinished = false
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
    return tv
}

export default { genUpdater, saveUserData, initTV }
