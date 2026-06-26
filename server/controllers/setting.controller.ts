import { Request, Response, NextFunction } from "express";
import { SettingService } from "../services/setting.service";

export class SettingController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const existing = await SettingService.getByKey(req.body.key);
      if (existing) {
        return res.status(400).json({ success: false, error: "Khóa cấu hình đã tồn tại." });
      }
      const data = await SettingService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 100;
      const search = req.query.search as string;

      const result = await SettingService.getList({ page, limit, search });
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await SettingService.getDetail(id as string);
      if (!data) {
        return res.status(404).json({ success: false, error: "Không tìm thấy cấu hình." });
      }
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getByKey(req: Request, res: Response, next: NextFunction) {
    try {
      const { key } = req.params;
      const data = await SettingService.getByKey(key as string);
      if (!data) {
        return res.status(404).json({ success: false, error: "Không tìm thấy cấu hình với khóa này." });
      }
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await SettingService.update(id as string, req.body);
      if (!data) {
        return res.status(404).json({ success: false, error: "Không tìm thấy cấu hình để cập nhật." });
      }
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await SettingService.delete(id as string);
      if (!data) {
        return res.status(404).json({ success: false, error: "Không tìm thấy cấu hình để xóa." });
      }
      res.json({ success: true, message: "Xóa cấu hình thành công." });
    } catch (error) {
      next(error);
    }
  }
}
