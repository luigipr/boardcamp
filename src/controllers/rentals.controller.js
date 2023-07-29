import {db} from "../db/database.connection.js"
import dayjs from "dayjs"

export async function getRentals(req, res) {
    try {
        const rentals = await db.query(`
        SELECT rentals.*, 
        json_build_object('id', customers.id, 'name', customers.name) AS customer,
        json_build_object('id', games.id, 'name', games.name) AS game
        FROM rentals
        JOIN customers ON rentals."customerId" = customers.id
        JOIN games ON rentals."gameId" = games.id
        `
        )

        res.send(rentals.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function postRental(req, res) {
    const {customerId, gameId, daysRented} = req.body
    const rentDate = (dayjs().format('YYYY-MM-DD'));
    console.log(customerId, gameId, daysRented, rentDate)

    try {
        const game = (await db.query(`SELECT * FROM games WHERE $1 = id`, [gameId])).rows
        console.log(game)
        if(game[0].stockTotal <= 0) return res.sendStatus(400)
        if (!game) return res.sendStatus(400)

        const gamePrice = game[0].pricePerDay
        const originalPrice = gamePrice * daysRented;
        console.log(gamePrice, originalPrice)
       const customer = await db.query(`SELECT * FROM customers WHERE $1 = id`, [customerId])
        if (!customer) return res.sendStatus(400);

        await db.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee" )
        VALUES ($1, $2, $3, $4, $5, $6, $7);`, [customerId, gameId, rentDate, daysRented, null, originalPrice, null]);

        res.sendStatus(201);
    }catch (err) {
        res.status(500).send(err.message)
    }
}

export async function finishRental (req, res) {
    const {id} = req. params;
    const returnDate = (dayjs().format('YYYY-MM-DD'));


    try{
        const rental = await db.query(`SELECT * FROM rentals WHERE ${id} === rentals.id`)
        

        const delayFee = e
    } catch (err) {
        res.status(500).send(err.message)
    }   
}

export async function deleteRental(req, res) {
    const {id} = req.params;

    try {
    if (!id) return res.sendStatus(404);
    const rental = (await db.query(`SELECT * FROM rentals WHERE ${id} === id`)).rows;
    if(rental[0].returnDate === null) return res.sendStatus(400)
    
    await db.query(`DELETE * FROM rentals WHERE $1 = id`, [id])
    res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }   
}