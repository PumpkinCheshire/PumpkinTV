const bent = require("bent")
const getJson = bent("json")

async function genUpdater(api, tvid) {
    let tv = await getJson(
        `https://api.themoviedb.org/3/tv/${tvid}?api_key=${api}&language=en-US`
    )
    await Promise.all(tv.seasons.map(async (season) => {
        let detailSeason = await getJson(
            `https://api.themoviedb.org/3/tv/${tvid}/season/${season.season_number}?api_key=${api}&language=en-US`
        )
        season.episodes = await detailSeason.episodes
    }))
    return tv
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
