import {Router} from "express"
import { getRentals, postRental, deleteRental } from "../controllers/rentals.controller.js";
import {validateSchema} from "../middlewares/validateSchema.js"
import {rentalSchema} from "../schemas/rental.schema.js"

const rentalRouter = Router();

rentalRouter.get("/rentals", getRentals)
rentalRouter.post("/rentals", validateSchema(rentalSchema), postRental)
rentalRouter.delete("/rentals/:id", deleteRental)

export default rentalRouter;