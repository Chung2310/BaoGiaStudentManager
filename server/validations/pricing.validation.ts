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
    "any.required": "Khoảng số học viên là bắt buộc.",
    "string.empty": "Khoảng số học viên không được để trống.",
  }),
  basic6Month: Joi.number().required().min(0).messages({
    "any.required": "Giá gói Basic 6 tháng là bắt buộc.",
    "number.base": "Giá gói Basic 6 tháng phải là số.",
    "number.min": "Giá gói Basic 6 tháng không được nhỏ hơn 0.",
  }),
  basic12Month: Joi.number().required().min(0).messages({
    "any.required": "Giá gói Basic 12 tháng là bắt buộc.",
    "number.base": "Giá gói Basic 12 tháng phải là số.",
    "number.min": "Giá gói Basic 12 tháng không được nhỏ hơn 0.",
  }),
  plusFirstYear: Joi.number().required().min(0).messages({
    "any.required": "Giá gói Plus năm đầu tiên là bắt buộc.",
    "number.base": "Giá gói Plus năm đầu tiên phải là số.",
    "number.min": "Giá gói Plus năm đầu tiên không được nhỏ hơn 0.",
  }),
  plusNextYears: Joi.number().required().min(0).messages({
    "any.required": "Giá gói Plus năm tiếp theo là bắt buộc.",
    "number.base": "Giá gói Plus năm tiếp theo phải là số.",
    "number.min": "Giá gói Plus năm tiếp theo không được nhỏ hơn 0.",
  }),
  order: Joi.number().integer().required().messages({
    "any.required": "Thứ tự sắp xếp là bắt buộc.",
    "number.base": "Thứ tự sắp xếp phải là số nguyên.",
  }),
});

export const updatePricingSchema = Joi.object({
  studentRange: Joi.string().optional(),
  basic6Month: Joi.number().min(0).optional(),
  basic12Month: Joi.number().min(0).optional(),
  plusFirstYear: Joi.number().min(0).optional(),
  plusNextYears: Joi.number().min(0).optional(),
  order: Joi.number().integer().optional(),
});

export const queryPricingSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).default(100).optional(),
  search: Joi.string().allow("").optional(),
});
