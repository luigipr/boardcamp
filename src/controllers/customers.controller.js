import db from "../db/db.js"


export async function getCustomers(req, res) {

    try {
        const customers = await db.query(`SELECT * FROM customers;`)
        res.send(customers.rows)
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

    const {id, name, phone, cpf, birthday} = req.body;

    await db.query(`INSERT INTO customers (id, name, phone, cpf, birthday) VALUES ($1, $2, $3, $4, $5)`, [id, name, phone, cpf, birthday])

    res.send("postCustomer")
}

export async function putCustomer(req, res) {
    const { id } = req.params

    const {id, name, phone, cpf, birthday} = req.body;

    await db.query(`UPDATE customers SET (name = $2, phone = $3, cpf = $4, birthday = $5) WHERE id = $1`, [id, name, phone, cpf, birthday])

}