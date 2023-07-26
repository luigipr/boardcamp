import Joi from "joi";

export const gamesSchema = Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.string().required(),
    image: Joi.string().required(),
    stockTotal: number().integer().greater(0).required(),
    pricePerDay:  number().integer().greater(0).required()
})