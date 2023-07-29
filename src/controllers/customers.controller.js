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
    const { id } = req.params;

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1;`, [id]);
        if(!customer) return res.sendStatus(404)

        // const {name, phone, cpf, birthday } = customer;
        // const birthdayDate = birthday.toISOString().split('T')[0];
        // const user =  { id, name, phone, cpf, birthday: birthdayDate };
        // console.log(user)

        if (!customer.rows[0]) {
            return res.sendStatus(404);
        }

        const { birthday, ...rest } = customer.rows[0];
        const birthdayDate = birthday.toISOString().split('T')[0];
        const user = { ...rest, birthday: birthdayDate };
        

        res.send(user)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function postCustomer(req, res) {

    const {name, phone, cpf, birthday} = req.body;
    //if (!name || !phone || !cpf || !birthday) return res.sendStatus(400)
    try {
    const existe = await db.query(`SELECT * FROM customers WHERE customers.cpf = $1`, [cpf])
    if (existe.rowCount !== 0) return res.sendStatus(409)
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

    const existe = await db.query(`SELECT * FROM customers WHERE customers.cpf = $1 AND id <> $2`, [cpf, id])
    if (existe.rowCount !== 0) return res.sendStatus(409)

    await db.query(`UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`, [name, phone, cpf, birthday, id]);
    res.sendStatus(200)
    }catch (err) {
        res.status(500).send(err.message)
    }
}