import { Request, Response, NextFunction } from "express";
import { ProjectService } from "../services/project.service";

export class ProjectController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ProjectService.getAll();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;
      const data = await ProjectService.create({ name, description });
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { name, description } = req.body;
      const data = await ProjectService.update(id, { name, description });
      if (!data) {
        return res.status(404).json({ success: false, error: "Không tìm thấy dự án." });
      }
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await ProjectService.delete(id);
      res.json({ success: true, message: "Đã xóa dự án và toàn bộ dữ liệu liên quan." });
    } catch (error) {
      next(error);
    }
  }

  static async clone(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { name } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, error: "Tên dự án mới là bắt buộc." });
      }
      const data = await ProjectService.clone(id, name.trim());
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
