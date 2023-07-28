import {db} from "../db/database.connection.js"


export async function getRentals(req, res) {



    try {
        const resultado = await db.query(`
        SELECT rentals.*, customers FROM customers JOIN customers ON customers.id = rentals."customerId" JOIN games ON 
            games.id = rentals."gameId" `)

        res.send(resultado.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function postRental(req, res) {
    const {customerId, gameId, daysRented} = req.body
    if (daysRented <= 0) return res.sendStatus(400)
    const rentDate = (dayjs().format('YYYY-MM-DD'));
    try {
        const game = await db.query(`SELECT * FROM games WHERE ${gameId} === games.id`)
        if(game.stockTotal <= 0) return res.sendStatus(400)
        if (!game) return res.sendStatus(400)
        const gamePrice = game.pricePerDay
        const originalPrice = gamePrice * rentDate;
        let returnDate = null;
        let delayFee = null

       const customer = await db.query(`SELECT * FROM customers WHERE ${customerId} === games.id`)
        if (!customer) return res.sendStatus(400)

        delete game.image;
        delete game.stockTotal;
        delete game.pricePerDay;
        //game.delete(image, stockTotal, pricePerDay)
        //customer.delete(phone, cpf. birthday)
        delete customer.phone
        delete customer.cpf
        delete customer.birthday

        await db.query(`INSERT INTO rentals "customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee", customer, game
        VALUES ${customerId}, ${gameId}, ${rentDate}, ${daysRented}, ${returnDate}, ${originalPrice}, ${delayFee}, ${customer}, ${game} `)

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
        

        const delayFee = 
    } catch (err) {
        res.status(500).send(err.message)
    }   
}