import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const objectIdSchema = Joi.string().pattern(objectIdPattern).messages({
  "string.pattern.base": "Định dạng ID không hợp lệ.",
});

export const idParamSchema = Joi.object({
  id: objectIdSchema.required(),
});

export const createSettingSchema = Joi.object({
  key: Joi.string().required().messages({
    "any.required": "Khóa cấu hình là bắt buộc.",
    "string.empty": "Khóa cấu hình không được để trống.",
  }),
  value: Joi.string().required().messages({
    "any.required": "Giá trị cấu hình là bắt buộc.",
    "string.empty": "Giá trị cấu hình không được để trống.",
  }),
  description: Joi.string().optional().allow(""),
});

export const updateSettingSchema = Joi.object({
  key: Joi.string().optional(),
  value: Joi.string().required().messages({
    "any.required": "Giá trị cấu hình là bắt buộc.",
    "string.empty": "Giá trị cấu hình không được để trống.",
  }),
  description: Joi.string().optional().allow(""),
});

export const querySettingSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).default(100).optional(),
  search: Joi.string().allow("").optional(),
});
