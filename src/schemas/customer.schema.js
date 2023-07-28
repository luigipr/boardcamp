import Joi from "joi";

export const customerSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.number().integer().required(),
    cpf: Joi.string().min(11).max(11).required(),
    birthday: Joi.date().raw().required()
})