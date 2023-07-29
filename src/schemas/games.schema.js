import Joi from "joi";

export const gamesSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
    stockTotal: Joi.number().integer().greater(0).required(),
    pricePerDay: Joi.number().integer().greater(0).precision(2).required()
})