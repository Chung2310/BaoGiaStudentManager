import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const objectIdSchema = Joi.string().pattern(objectIdPattern).messages({
  "string.pattern.base": "Định dạng ID không hợp lệ.",
});

export const idParamSchema = Joi.object({
  id: objectIdSchema.required(),
});

export const createServiceSchema = Joi.object({
  serviceName: Joi.string().required().messages({
    "any.required": "Tên dịch vụ là bắt buộc.",
    "string.empty": "Tên dịch vụ không được để trống.",
  }),
  basicContent: Joi.array().items(Joi.string().allow("")).required().messages({
    "any.required": "Nội dung dịch vụ Basic là bắt buộc.",
  }),
  plusContent: Joi.array().items(Joi.string().allow("")).required().messages({
    "any.required": "Nội dung dịch vụ Plus là bắt buộc.",
  }),
  order: Joi.number().integer().required().messages({
    "any.required": "Thứ tự sắp xếp là bắt buộc.",
    "number.base": "Thứ tự sắp xếp phải là số nguyên.",
  }),
});

export const updateServiceSchema = Joi.object({
  serviceName: Joi.string().optional(),
  basicContent: Joi.array().items(Joi.string().allow("")).optional(),
  plusContent: Joi.array().items(Joi.string().allow("")).optional(),
  order: Joi.number().integer().optional(),
});

export const queryServiceSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).default(100).optional(),
  search: Joi.string().allow("").optional(),
});
