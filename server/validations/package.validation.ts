import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;
const keyPattern = /^[a-zA-Z0-9_]+$/;

export const objectIdSchema = Joi.string().pattern(objectIdPattern).messages({
  "string.pattern.base": "Định dạng ID không hợp lệ.",
});

export const idParamSchema = Joi.object({
  id: objectIdSchema.required(),
});

export const createPackageSchema = Joi.object({
  projectId: Joi.string().pattern(objectIdPattern).optional(),
  key: Joi.string().pattern(keyPattern).required().messages({
    "any.required": "Mã khóa gói cước là bắt buộc.",
    "string.empty": "Mã khóa gói cước không được để trống.",
    "string.pattern.base": "Mã khóa chỉ được chứa chữ cái, chữ số và dấu gạch dưới.",
  }),
  name: Joi.string().required().messages({
    "any.required": "Tên gói cước là bắt buộc.",
    "string.empty": "Tên gói cước không được để trống.",
  }),
  group: Joi.string().required().messages({
    "any.required": "Nhóm gói cước là bắt buộc.",
    "string.empty": "Nhóm gói cước không được để trống.",
  }),
  order: Joi.number().integer().required().messages({
    "any.required": "Thứ tự hiển thị là bắt buộc.",
    "number.base": "Thứ tự hiển thị phải là số nguyên.",
  }),
});

export const updatePackageSchema = Joi.object({
  key: Joi.string().pattern(keyPattern).optional().messages({
    "string.pattern.base": "Mã khóa chỉ được chứa chữ cái, chữ số và dấu gạch dưới.",
  }),
  name: Joi.string().optional(),
  group: Joi.string().optional(),
  order: Joi.number().integer().optional(),
});

export const queryPackageSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).default(100).optional(),
  search: Joi.string().allow("").optional(),
  projectId: Joi.string().pattern(objectIdPattern).optional(),
});

