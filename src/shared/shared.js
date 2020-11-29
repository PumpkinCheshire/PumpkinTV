const bent = require("bent")
const getJson = bent("json")
import store from '../store'

async function genUpdater(tvid) {
    let api = await store.getters.getAPI
    let tv = await getJson(
        `https://api.themoviedb.org/3/tv/${tvid}?api_key=${api}&language=en-US`
    )
    console.log(tv)

    // try {
    //     tv.first_air_date = new Date(tv.first_air_date)
    //     tv.last_air_date = new Date(tv.last_air_date)
    //     tv.last_episode_to_air.air_date = new Date(tv.last_episode_to_air.air_date)
    //     if (tv.next_episode_to_air !== null) {
    //         tv.next_episode_to_air.air_date = new Date(tv.next_episode_to_air.air_date)
    //     }
    // }
    // catch {
    //     console.log("no tv air date")
    // }


    await Promise.all(tv.seasons.map(async (season) => {
        let detailSeason = await getJson(
            `https://api.themoviedb.org/3/tv/${tvid}/season/${season.season_number}?api_key=${api}&language=en-US`
        )



        try {
            season.episodes = await detailSeason.episodes
            // season.air_date = new Date(season.air_date)
        }
        catch {
            console.log("no season air date")
        }
        await Promise.all(season.episodes.map(episode => {
            delete episode.crew
            delete episode.guest_stars
            // episode.air_date = new Date(episode.air_date)
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

    console.log("check patch")
    try {
        if (tv.seasons.find(season => season.season_number > 1).episodes[0].episode_number !== 1) {
            console.log("patch")
            await Promise.all(tv.seasons.filter(season => season.season_number > 1).map((season) => {
                season.episodes.map(episode => {
                    episode.season_number = 1
                })
                tv.seasons.find(season => season.season_number === 1).episodes = tv.seasons.find(season => season.season_number === 1).episodes.concat(season.episodes)
                tv.seasons.find(season => season.season_number === 1).episode_count = tv.seasons.find(season => season.season_number === 1).episodes.length
            }))
            tv.seasons.splice(2)
            tv.seasons.find(season => season.season_number === 1).episodes.forEach(episode => episode.total_number = episode.episode_number)
            tv.seasons.find(season => season.season_number === 1).name = "Season 1"
        }
    }
    catch {
        console.log("no patch")
    }


    return await JSON.parse(JSON.stringify(tv))
}


export default { genUpdater }
