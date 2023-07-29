import {db} from "../db/database.connection.js"
import dayjs from "dayjs";


export async function getCustomers(req, res) {

    try {
        const customers = await db.query(`SELECT * FROM customers;`)

        const allCustomers = customers.rows.map(customer => {
            const { id, name, phone, cpf, birthday } = customer;
            const birthdayDate = birthday.toISOString().split('T')[0];
            return { id, name, phone, cpf, birthday: birthdayDate };
        });

        res.send(allCustomers)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getCustomerById(req, res) {
    const { id } = req.params

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1;`, [id])
        res.send(customer.rows[0])
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function postCustomer(req, res) {

    const {name, phone, cpf, birthday} = req.body;
    try {
    //const existe = await db.query(`SELECT * FROM customers WHERE customers.cpf = ${cpf}`)
    //if (existe.rowCount !== 0) return res.sendStatus(409)
    console.log(birthday)
    const birthdayDate = dayjs(birthday).format('YYYY-MM-DD')
    //birthday.split('T')[0];
    console.log(birthdayDate)
    
    await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthdayDate])
        //TO_CHAR(birthday, 'YYYY-MM-DD') as birthday) 
    res.sendStatus(201)
    } catch (err) {
    res.status(500).send(err.message)
    }
}

export async function putCustomer(req, res) {
    const { id } = req.params

    try {
    const {name, phone, cpf, birthday} = req.body;
    
    
    const existe = await db.query(`SELECT * FROM customers WHERE cpf = customers.$1`, [cpf])
    if (existe.rowCount !== 0) return res.sendStatus(409)

    await db.query(`UPDATE customers SET (name = $2, phone = $3, cpf = $4, birthday = $5) WHERE id = $1`, [id, name, phone, cpf, birthday])
    res.sendStatus(200)
    }catch (err) {
        res.status(500).send(err.message)
    }
}