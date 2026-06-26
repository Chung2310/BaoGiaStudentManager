import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const objectIdSchema = Joi.string().pattern(objectIdPattern).messages({
  "string.pattern.base": "Định dạng ID không hợp lệ.",
});

export const idParamSchema = Joi.object({
  id: objectIdSchema.required(),
});

export const createPricingSchema = Joi.object({
  studentRange: Joi.string().required().messages({
    "any.required": "Khoảng số lượng/quy mô là bắt buộc.",
    "string.empty": "Khoảng số lượng/quy mô không được để trống.",
  }),
  prices: Joi.object().pattern(Joi.string(), Joi.number().min(0)).required().messages({
    "any.required": "Danh sách giá các gói là bắt buộc.",
    "object.base": "Danh sách giá các gói phải là một đối tượng.",
  }),
  order: Joi.number().integer().required().messages({
    "any.required": "Thứ tự sắp xếp là bắt buộc.",
    "number.base": "Thứ tự sắp xếp phải là số nguyên.",
  }),
});

export const updatePricingSchema = Joi.object({
  studentRange: Joi.string().optional(),
  prices: Joi.object().pattern(Joi.string(), Joi.number().min(0)).optional(),
  order: Joi.number().integer().optional(),
});

export const queryPricingSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).default(100).optional(),
  search: Joi.string().allow("").optional(),
});
