import { Request, Response, NextFunction } from "express";
import { FeatureService } from "../services/feature.service";

export class FeatureController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await FeatureService.create(req.body);
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
      const projectId = req.query.projectId as string;

      const result = await FeatureService.getList({ page, limit, search, projectId });
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await FeatureService.getDetail(id as string);
      if (!data) {
        return res.status(404).json({ success: false, error: "Không tìm thấy tính năng." });
      }
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await FeatureService.update(id as string, req.body);
      if (!data) {
        return res.status(404).json({ success: false, error: "Không tìm thấy tính năng để cập nhật." });
      }
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await FeatureService.delete(id as string);
      if (!data) {
        return res.status(404).json({ success: false, error: "Không tìm thấy tính năng để xóa." });
      }
      res.json({ success: true, message: "Xóa tính năng thành công." });
    } catch (error) {
      next(error);
    }
  }
}
