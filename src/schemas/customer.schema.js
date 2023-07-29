import Joi from "joi";

import joiDate from "@joi/date"
const joi = Joi.extend(joiDate)

export const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().required(),
    cpf: joi.string().length(11).pattern(/^[0-9]+$/).required(),
    birthday: joi.date().format('YYYY-MM-DD').required()
    //birthday: joi.string().isoDate().required()
   
})