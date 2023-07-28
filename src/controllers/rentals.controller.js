import {db} from "../db/database.connection.js"


export async function getGames(req, res) {

    try {
        const games = await db.query(`SELECT * FROM games;`)
        
        res.send(games.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}