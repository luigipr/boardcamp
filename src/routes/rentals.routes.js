import {Router} from "express"
import { getRentals, postRental } from "../controllers/rentals.controller.js";
import {validateSchema} from "../middlewares/validateSchema.js"
import {rentalSchema} from "../schemas/rental.schema.js"

const rentalRouter = Router();

rentalRouter.get("/rentals", getRentals)
rentalRouter.post("/rentals", validateSchema(rentalSchema), postRental)

export default rentalRouter;