import {Router} from "express"
import {getCustomers, getCustomerById, postCustomer, putCustomer} from "../controllers/customers.controller.js";
import {validateSchema} from "../middlewares/validateSchema.js";
import {customerSchema} from "../schemas/customer.schema.js"


const customersRouter = Router();

customersRouter.get("/customers", getCustomers)
customersRouter.get("/customers/:id", getCustomerById)
customersRouter.post("/customers", validateSchema(customerSchema), postCustomer)
customersRouter.put("/customers/:id", validateSchema(customerSchema), putCustomer)

export default customersRouter;