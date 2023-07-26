import db from "../db/db.js"


export async function getGames(req, res) {

    try {
        const games = await db.query(`SELECT * FROM games;`)
        res.send(games.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function postGame(req, res) {

    const {id, name, image, stockTotal, pricePerDay} = req.body;

    await db.query(`INSERT INTO games (id, name, image, stockTotal, pricePerDay) VALUES ($1, $2, $3, $4, $5)`, [id, name, image, stockTotal, pricePerDay])

    res.send("postGame")
}

