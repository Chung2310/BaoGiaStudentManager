import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const objectIdSchema = Joi.string().pattern(objectIdPattern).messages({
  "string.pattern.base": "Định dạng ID không hợp lệ.",
});

export const idParamSchema = Joi.object({
  id: objectIdSchema.required(),
});

export const createServiceSchema = Joi.object({
  projectId: Joi.string().pattern(objectIdPattern).optional(),
  serviceName: Joi.string().required().messages({
    "any.required": "Tên dịch vụ là bắt buộc.",
    "string.empty": "Tên dịch vụ không được để trống.",
  }),
  contents: Joi.object().pattern(Joi.string(), Joi.array().items(Joi.string().allow(""))).required().messages({
    "any.required": "Nội dung so sánh của các gói là bắt buộc.",
    "object.base": "Nội dung so sánh phải là một đối tượng.",
  }),
  order: Joi.number().integer().required().messages({
    "any.required": "Thứ tự sắp xếp là bắt buộc.",
    "number.base": "Thứ tự sắp xếp phải là số nguyên.",
  }),
});

export const updateServiceSchema = Joi.object({
  serviceName: Joi.string().optional(),
  contents: Joi.object().pattern(Joi.string(), Joi.array().items(Joi.string().allow(""))).optional(),
  order: Joi.number().integer().optional(),
});

export const queryServiceSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).default(100).optional(),
  search: Joi.string().allow("").optional(),
  projectId: Joi.string().pattern(objectIdPattern).optional(),
});
