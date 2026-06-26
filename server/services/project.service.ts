import { Project } from "../models/project.model";
import { Package } from "../models/package.model";
import { Pricing } from "../models/pricing.model";
import { Feature } from "../models/feature.model";
import { Service } from "../models/service.model";
import { IProject } from "../interfaces/project.interface";
import { logger } from "../config/logger";

export class ProjectService {
  static async getAll(): Promise<IProject[]> {
    return Project.find().sort({ order: 1, createdAt: 1 });
  }

  static async getById(id: string): Promise<IProject | null> {
    return Project.findById(id);
  }

  static async create(data: { name: string; description?: string }): Promise<IProject> {
    const count = await Project.countDocuments();
    return Project.create({ ...data, order: count + 1 });
  }

  static async update(id: string, data: { name?: string; description?: string }): Promise<IProject | null> {
    return Project.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  static async delete(id: string): Promise<void> {
    await Promise.all([
      Package.deleteMany({ projectId: id }),
      Pricing.deleteMany({ projectId: id }),
      Feature.deleteMany({ projectId: id }),
      Service.deleteMany({ projectId: id }),
      Project.findByIdAndDelete(id),
    ]);
  }

  static async clone(sourceId: string, newName: string): Promise<IProject> {
    const [packages, pricings, features, services] = await Promise.all([
      Package.find({ projectId: sourceId }).lean(),
      Pricing.find({ projectId: sourceId }).lean(),
      Feature.find({ projectId: sourceId }).lean(),
      Service.find({ projectId: sourceId }).lean(),
    ]);

    const count = await Project.countDocuments();
    const newProject = await Project.create({ name: newName, order: count + 1 });
    const newId = newProject._id;

    const strip = ({ _id, __v, createdAt, updatedAt, ...rest }: any) => rest;

    await Promise.all([
      packages.length > 0
        ? Package.insertMany(packages.map((p) => ({ ...strip(p), projectId: newId })))
        : Promise.resolve(),
      pricings.length > 0
        ? Pricing.insertMany(pricings.map((p) => ({ ...strip(p), projectId: newId })))
        : Promise.resolve(),
      features.length > 0
        ? Feature.insertMany(features.map((f) => ({ ...strip(f), projectId: newId })))
        : Promise.resolve(),
      services.length > 0
        ? Service.insertMany(services.map((s) => ({ ...strip(s), projectId: newId })))
        : Promise.resolve(),
    ]);

    return newProject;
  }

  static async seedDefaultProject(): Promise<IProject> {
    let defaultProject = await Project.findOne().sort({ order: 1, createdAt: 1 });
    if (!defaultProject) {
      defaultProject = await Project.create({
        name: "iGen ERP",
        description: "Dự án mặc định",
        order: 1,
      });
      logger.info(">>> Created default project: iGen ERP");
    }

    const defaultId = defaultProject._id;
    // Migration: assign projectId to existing records that don't have one
    const [pkgMigrated, priceMigrated, featMigrated, srvMigrated] = await Promise.all([
      Package.updateMany({ projectId: null }, { $set: { projectId: defaultId } }),
      Pricing.updateMany({ projectId: null }, { $set: { projectId: defaultId } }),
      Feature.updateMany({ projectId: null }, { $set: { projectId: defaultId } }),
      Service.updateMany({ projectId: null }, { $set: { projectId: defaultId } }),
    ]);

    const totalMigrated =
      pkgMigrated.modifiedCount + priceMigrated.modifiedCount +
      featMigrated.modifiedCount + srvMigrated.modifiedCount;
    if (totalMigrated > 0) {
      logger.info(`>>> Migrated ${totalMigrated} records to default project "${defaultProject.name}"`);
    }

    return defaultProject;
  }
}
