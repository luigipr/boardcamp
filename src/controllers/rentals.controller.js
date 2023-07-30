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
        const game = (await db.query(`SELECT * FROM games WHERE $1 = id`, [gameId])).rows;
        if (!game) return res.sendStatus(400);
        const stock = (await db.query('SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL;',[gameId]));
        if (stock.rowCount >= game[0].stockTotal) return res.sendStatus(400);
        const gamePrice = game[0].pricePerDay;
        const originalPrice = gamePrice * daysRented;
        console.log(gamePrice, originalPrice);
        const customer = await db.query(`SELECT * FROM customers WHERE $1 = id`, [customerId]);
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
    const returnDate = dayjs().format('YYYY-MM-DD');
 
    try{
        const rental = (await db.query(`SELECT * FROM rentals WHERE $1 = id`, [id])).rows;
        if(!rental[0]) return res.sendStatus(404);
        console.log(rental)

        if(rental[0].returnDate !== null) res.sendStatus(400);

        const rentDate = dayjs(rental[0].rentDate);
        const daysRented = rental[0].daysRented;
        console.log(daysRented , returnDate);
        const delayDays = dayjs().diff(rentDate, 'day') - daysRented;
        console.log(delayDays);
        const pricePerDay = rental[0].originalPrice / daysRented;
        console.log(pricePerDay);
        const delayFee = Math.max(0, delayDays) * pricePerDay;
        console.log(delayFee);

        await db.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE $3 = id`, [returnDate, delayFee, id])

        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }   
}

export async function deleteRental(req, res) {
    const {id} = req.params;

    try {
    if (!id) return res.sendStatus(404);

    const rental = (await db.query(`SELECT * FROM rentals WHERE $1 = id`, [id])).rows;
    if (!rental[0]) return res.sendStatus(404);
    console.log(rental[0].rentDate)
    if(rental[0].returnDate === null) return res.sendStatus(400);
    
    await db.query(`DELETE * FROM rentals WHERE $1 = id`, [id])
    res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }   
}