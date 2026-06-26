import React, { useEffect, useState } from "react";
import { api } from "../services/api";

interface ProjectItem {
  _id: string;
  name: string;
  description?: string;
  order: number;
}

interface PackageItem {
  _id: string;
  key: string;
  name: string;
  group: string;
  order: number;
}

interface PricingItem {
  _id: string;
  studentRange: string;
  prices: Record<string, number>;
  order: number;
}

interface FeatureItem {
  _id: string;
  category: string;
  contents: Record<string, string[]>;
  order: number;
}

interface ServiceItem {
  _id: string;
  serviceName: string;
  contents: Record<string, string[]>;
  order: number;
}

interface SettingsForm {
  company_name: string;
  address: string;
  tax_code: string;
  phone: string;
  email: string;
  website: string;
  apply_date: string;
}

const defaultSettingsForm: SettingsForm = {
  company_name: "",
  address: "",
  tax_code: "",
  phone: "",
  email: "",
  website: "",
  apply_date: "",
};

interface AdminDashboardProps {
  applyDate?: string;
  onSettingsSaved?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSettingsSaved }) => {
  // Project state
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingProjectName, setEditingProjectName] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [cloneSourceId, setCloneSourceId] = useState<string | null>(null);
  const [cloneTargetName, setCloneTargetName] = useState("");
  const [projectActionLoading, setProjectActionLoading] = useState(false);

  // Settings tab state
  const [settingsForm, setSettingsForm] = useState<SettingsForm>(defaultSettingsForm);
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Tab & data state
  const [activeTab, setActiveTab] = useState<"pricing" | "packages" | "features" | "services" | "settings">("pricing");
  const [pricingList, setPricingList] = useState<PricingItem[]>([]);
  const [packageList, setPackageList] = useState<PackageItem[]>([]);
  const [featureList, setFeatureList] = useState<FeatureItem[]>([]);
  const [serviceList, setServiceList] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [pricingForm, setPricingForm] = useState<{ studentRange: string; prices: Record<string, number>; order: number }>({ studentRange: "", prices: {}, order: 0 });
  const [packageForm, setPackageForm] = useState({ key: "", name: "", group: "", order: 0 });
  const [featureForm, setFeatureForm] = useState<{ category: string; contents: Record<string, string>; order: number }>({ category: "", contents: {}, order: 0 });
  const [serviceForm, setServiceForm] = useState<{ serviceName: string; contents: Record<string, string>; order: number }>({ serviceName: "", contents: {}, order: 0 });

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 3000); };

  const loadAdminSettings = async () => {
    try {
      const data = await api.getSettings();
      if (!data) return;
      const map: Record<string, string> = {};
      data.forEach((s: any) => { map[s.key] = s.value; });
      setSettingsForm({
        company_name: map.company_name || "",
        address: map.address || "",
        tax_code: map.tax_code || "",
        phone: map.phone || "",
        email: map.email || "",
        website: map.website || "",
        apply_date: map.apply_date || "",
      });
    } catch (err: any) {
      setError(err.message || "Lỗi tải cài đặt");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSettingsLoading(true);
      setError("");
      const keys = Object.keys(settingsForm) as (keyof SettingsForm)[];
      await Promise.all(keys.map((k) => api.upsertSetting(k, settingsForm[k])));
      showSuccess("Đã lưu thông tin footer thành công!");
      if (onSettingsSaved) onSettingsSaved();
    } catch (err: any) {
      setError(err.message || "Lỗi lưu cài đặt");
    } finally {
      setSettingsLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      setProjectsLoading(true);
      const data = await api.getProjects();
      setProjects(data || []);
      if (!selectedProjectId && data && data.length > 0) {
        setSelectedProjectId(data[0]._id);
      }
    } catch (err: any) {
      setError(err.message || "Lỗi tải danh sách dự án");
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => { loadProjects(); loadAdminSettings(); }, []);

  const loadData = async () => {
    if (!selectedProjectId) return;
    try {
      setLoading(true);
      setError("");
      setEditingId(null);

      const packages = await api.getAllPackages(selectedProjectId);
      setPackageList(packages || []);

      if (activeTab === "pricing") {
        const data = await api.getPricing(undefined, selectedProjectId);
        setPricingList(data || []);
      } else if (activeTab === "features") {
        const data = await api.getFeatures(undefined, selectedProjectId);
        setFeatureList(data || []);
      } else if (activeTab === "services") {
        const data = await api.getServices(undefined, selectedProjectId);
        setServiceList(data || []);
      }
    } catch (err: any) {
      setError(err.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [activeTab, selectedProjectId]);

  useEffect(() => {
    if (packageList.length > 0) {
      setPricingForm((prev) => {
        const updatedPrices = { ...prev.prices };
        packageList.forEach((pkg) => { if (updatedPrices[pkg.key] === undefined) updatedPrices[pkg.key] = 0; });
        return { ...prev, prices: updatedPrices };
      });
      const uniqueGroups = Array.from(new Set(packageList.map((p) => p.group)));
      setFeatureForm((prev) => {
        const updatedContents = { ...prev.contents };
        uniqueGroups.forEach((g) => { if (updatedContents[g] === undefined) updatedContents[g] = ""; });
        return { ...prev, contents: updatedContents };
      });
      setServiceForm((prev) => {
        const updatedContents = { ...prev.contents };
        uniqueGroups.forEach((g) => { if (updatedContents[g] === undefined) updatedContents[g] = ""; });
        return { ...prev, contents: updatedContents };
      });
    }
  }, [packageList]);

  // ── Project handlers ──
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    try {
      setProjectActionLoading(true);
      const proj = await api.createProject({ name: newProjectName.trim() });
      setNewProjectName("");
      setShowNewProjectForm(false);
      await loadProjects();
      setSelectedProjectId(proj._id);
      showSuccess(`Đã tạo dự án "${proj.name}"`);
    } catch (err: any) {
      setError(err.message || "Lỗi tạo dự án");
    } finally {
      setProjectActionLoading(false);
    }
  };

  const handleRenameProject = async (id: string) => {
    if (!editingProjectName.trim()) return;
    try {
      setProjectActionLoading(true);
      await api.updateProject(id, { name: editingProjectName.trim() });
      setEditingProjectId(null);
      await loadProjects();
      showSuccess("Đã cập nhật tên dự án");
    } catch (err: any) {
      setError(err.message || "Lỗi cập nhật dự án");
    } finally {
      setProjectActionLoading(false);
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa dự án "${name}"?\nToàn bộ báo giá, gói cước, tính năng, dịch vụ trong dự án này sẽ bị xóa vĩnh viễn.`)) return;
    try {
      setProjectActionLoading(true);
      await api.deleteProject(id);
      const remaining = projects.filter((p) => p._id !== id);
      setProjects(remaining);
      if (selectedProjectId === id) {
        setSelectedProjectId(remaining.length > 0 ? remaining[0]._id : null);
      }
      showSuccess(`Đã xóa dự án "${name}"`);
    } catch (err: any) {
      setError(err.message || "Lỗi xóa dự án");
    } finally {
      setProjectActionLoading(false);
    }
  };

  const handleCloneProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloneSourceId || !cloneTargetName.trim()) return;
    try {
      setProjectActionLoading(true);
      const proj = await api.cloneProject(cloneSourceId, cloneTargetName.trim());
      setCloneSourceId(null);
      setCloneTargetName("");
      await loadProjects();
      setSelectedProjectId(proj._id);
      showSuccess(`Đã clone thành công sang dự án "${proj.name}"`);
    } catch (err: any) {
      setError(err.message || "Lỗi clone dự án");
    } finally {
      setProjectActionLoading(false);
    }
  };

  // ── Pricing CRUD ──
  const handlePricingEdit = (item: PricingItem) => {
    setEditingId(item._id);
    const initialPrices: Record<string, number> = {};
    packageList.forEach((pkg) => { initialPrices[pkg.key] = item.prices?.[pkg.key] ?? 0; });
    setPricingForm({ studentRange: item.studentRange, prices: initialPrices, order: item.order });
  };
  const handlePricingSave = async (id: string) => {
    try { setError(""); await api.updatePricing(id, pricingForm); showSuccess("Cập nhật bảng giá thành công!"); setEditingId(null); loadData(); } catch (err: any) { setError(err.message || "Lỗi cập nhật bảng giá"); }
  };
  const handlePricingCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try { setError(""); await api.createPricing({ ...pricingForm, projectId: selectedProjectId }); showSuccess("Thêm mới khoảng giá thành công!"); const resetPrices: Record<string, number> = {}; packageList.forEach((pkg) => { resetPrices[pkg.key] = 0; }); setPricingForm({ studentRange: "", prices: resetPrices, order: pricingList.length + 1 }); loadData(); } catch (err: any) { setError(err.message || "Lỗi tạo mới khoảng giá"); }
  };
  const handlePricingDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khoảng giá này không?")) return;
    try { setError(""); await api.deletePricing(id); showSuccess("Xóa khoảng giá thành công!"); loadData(); } catch (err: any) { setError(err.message || "Lỗi xóa khoảng giá"); }
  };

  // ── Package CRUD ──
  const handlePackageEdit = (item: PackageItem) => { setEditingId(item._id); setPackageForm({ key: item.key, name: item.name, group: item.group, order: item.order }); };
  const handlePackageSave = async (id: string) => {
    try { setError(""); await api.updatePackage(id, packageForm); showSuccess("Cập nhật gói cước thành công!"); setEditingId(null); loadData(); } catch (err: any) { setError(err.message || "Lỗi cập nhật gói cước"); }
  };
  const handlePackageCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try { setError(""); await api.createPackage({ ...packageForm, projectId: selectedProjectId }); showSuccess("Thêm mới gói cước thành công!"); setPackageForm({ key: "", name: "", group: "", order: packageList.length + 1 }); loadData(); } catch (err: any) { setError(err.message || "Lỗi tạo mới gói cước"); }
  };
  const handlePackageDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa gói cước này không?")) return;
    try { setError(""); await api.deletePackage(id); showSuccess("Xóa gói cước thành công!"); loadData(); } catch (err: any) { setError(err.message || "Lỗi xóa gói cước"); }
  };

  // ── Feature CRUD ──
  const handleFeatureEdit = (item: FeatureItem) => {
    setEditingId(item._id);
    const uniqueGroups = Array.from(new Set(packageList.map((p) => p.group)));
    const initialContents: Record<string, string> = {};
    uniqueGroups.forEach((g) => { initialContents[g] = item.contents?.[g]?.join("\n") || ""; });
    setFeatureForm({ category: item.category, contents: initialContents, order: item.order });
  };
  const handleFeatureSave = async (id: string) => {
    try {
      setError("");
      const contentsPayload: Record<string, string[]> = {};
      Object.entries(featureForm.contents).forEach(([group, contentStr]) => { contentsPayload[group] = contentStr.split("\n").filter((x) => x.trim() !== ""); });
      await api.updateFeature(id, { category: featureForm.category, contents: contentsPayload, order: featureForm.order });
      showSuccess("Cập nhật tính năng thành công!"); setEditingId(null); loadData();
    } catch (err: any) { setError(err.message || "Lỗi cập nhật tính năng"); }
  };
  const handleFeatureCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      const contentsPayload: Record<string, string[]> = {};
      Object.entries(featureForm.contents).forEach(([group, contentStr]) => { contentsPayload[group] = contentStr.split("\n").filter((x) => x.trim() !== ""); });
      await api.createFeature({ category: featureForm.category, contents: contentsPayload, order: featureForm.order, projectId: selectedProjectId });
      showSuccess("Thêm mới danh mục tính năng thành công!");
      const uniqueGroups = Array.from(new Set(packageList.map((p) => p.group)));
      const resetContents: Record<string, string> = {};
      uniqueGroups.forEach((g) => { resetContents[g] = ""; });
      setFeatureForm({ category: "", contents: resetContents, order: featureList.length + 1 }); loadData();
    } catch (err: any) { setError(err.message || "Lỗi tạo mới tính năng"); }
  };
  const handleFeatureDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục tính năng này không?")) return;
    try { setError(""); await api.deleteFeature(id); showSuccess("Xóa danh mục tính năng thành công!"); loadData(); } catch (err: any) { setError(err.message || "Lỗi xóa"); }
  };

  // ── Service CRUD ──
  const handleServiceEdit = (item: ServiceItem) => {
    setEditingId(item._id);
    const uniqueGroups = Array.from(new Set(packageList.map((p) => p.group)));
    const initialContents: Record<string, string> = {};
    uniqueGroups.forEach((g) => { initialContents[g] = item.contents?.[g]?.join("\n") || ""; });
    setServiceForm({ serviceName: item.serviceName, contents: initialContents, order: item.order });
  };
  const handleServiceSave = async (id: string) => {
    try {
      setError("");
      const contentsPayload: Record<string, string[]> = {};
      Object.entries(serviceForm.contents).forEach(([group, contentStr]) => { contentsPayload[group] = contentStr.split("\n").filter((x) => x.trim() !== ""); });
      await api.updateService(id, { serviceName: serviceForm.serviceName, contents: contentsPayload, order: serviceForm.order });
      showSuccess("Cập nhật dịch vụ thành công!"); setEditingId(null); loadData();
    } catch (err: any) { setError(err.message || "Lỗi cập nhật dịch vụ"); }
  };
  const handleServiceCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      const contentsPayload: Record<string, string[]> = {};
      Object.entries(serviceForm.contents).forEach(([group, contentStr]) => { contentsPayload[group] = contentStr.split("\n").filter((x) => x.trim() !== ""); });
      await api.createService({ serviceName: serviceForm.serviceName, contents: contentsPayload, order: serviceForm.order, projectId: selectedProjectId });
      showSuccess("Thêm mới dịch vụ thành công!");
      const uniqueGroups = Array.from(new Set(packageList.map((p) => p.group)));
      const resetContents: Record<string, string> = {};
      uniqueGroups.forEach((g) => { resetContents[g] = ""; });
      setServiceForm({ serviceName: "", contents: resetContents, order: serviceList.length + 1 }); loadData();
    } catch (err: any) { setError(err.message || "Lỗi tạo mới dịch vụ"); }
  };
  const handleServiceDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?")) return;
    try { setError(""); await api.deleteService(id); showSuccess("Xóa dịch vụ thành công!"); loadData(); } catch (err: any) { setError(err.message || "Lỗi xóa"); }
  };

  const uniqueGroups = Array.from(new Set(packageList.map((p) => p.group)));
  const selectedProject = projects.find((p) => p._id === selectedProjectId);
  const cloneSourceProject = projects.find((p) => p._id === cloneSourceId);

  return (
    <div className="admin-dashboard fade-in">
      <div className="admin-header">
        <h2>BẢNG ĐIỀU KHIỂN QUẢN TRỊ VIÊN</h2>
        <p className="admin-desc">Quản lý và chỉnh sửa trực tiếp các thông số bảng giá, gói cước, tính năng, và dịch vụ khách hàng.</p>
      </div>

      {error && <div className="alert-message error-message">{error}</div>}
      {successMsg && <div className="alert-message success-message">{successMsg}</div>}

      {/* ── Project Panel ── */}
      <div className="project-panel">
        <div className="project-panel-header">
          <span className="project-panel-title">Dự Án</span>
          <button
            className="btn btn-submit btn-sm"
            onClick={() => { setShowNewProjectForm(!showNewProjectForm); setEditingProjectId(null); }}
          >
            + Tạo dự án mới
          </button>
        </div>

        {showNewProjectForm && (
          <form onSubmit={handleCreateProject} className="project-create-form">
            <input
              type="text"
              className="form-input"
              placeholder="Tên dự án mới..."
              required
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-save" disabled={projectActionLoading}>
              {projectActionLoading ? "Đang tạo..." : "Tạo"}
            </button>
            <button type="button" className="btn btn-cancel" onClick={() => setShowNewProjectForm(false)}>Hủy</button>
          </form>
        )}

        {projectsLoading ? (
          <div className="loading-state" style={{ padding: "12px" }}>Đang tải dự án...</div>
        ) : projects.length === 0 ? (
          <div style={{ padding: "12px", color: "var(--text-muted)", fontSize: "14px" }}>Chưa có dự án nào. Hãy tạo dự án mới.</div>
        ) : (
          <div className="project-list">
            {projects.map((proj) => (
              <div
                key={proj._id}
                className={`project-item ${selectedProjectId === proj._id ? "active" : ""}`}
                onClick={() => { if (editingProjectId !== proj._id) setSelectedProjectId(proj._id); }}
              >
                <div className="project-item-left">
                  <span className="project-dot" />
                  {editingProjectId === proj._id ? (
                    <input
                      className="form-input project-rename-input"
                      value={editingProjectName}
                      onChange={(e) => setEditingProjectName(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  ) : (
                    <span className="project-name">{proj.name}</span>
                  )}
                </div>
                <div className="project-item-actions" onClick={(e) => e.stopPropagation()}>
                  {editingProjectId === proj._id ? (
                    <>
                      <button className="btn btn-save btn-xs" onClick={() => handleRenameProject(proj._id)} disabled={projectActionLoading}>Lưu</button>
                      <button className="btn btn-cancel btn-xs" onClick={() => setEditingProjectId(null)}>Hủy</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-edit btn-xs" onClick={() => { setEditingProjectId(proj._id); setEditingProjectName(proj.name); }}>Sửa tên</button>
                      <button className="btn btn-clone btn-xs" onClick={() => { setCloneSourceId(proj._id); setCloneTargetName(`${proj.name} (bản sao)`); }}>⊕ Clone</button>
                      <button className="btn btn-delete btn-xs" onClick={() => handleDeleteProject(proj._id, proj.name)}>Xóa</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Clone Modal ── */}
      {cloneSourceId && (
        <div className="modal-overlay" onClick={() => setCloneSourceId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setCloneSourceId(null)}>&times;</button>
            <h3 className="modal-title">Clone dự án "{cloneSourceProject?.name}"</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>
              Toàn bộ gói cước, bảng giá, tính năng và dịch vụ sẽ được sao chép sang dự án mới.
            </p>
            <form onSubmit={handleCloneProject} className="admin-form">
              <div className="form-group">
                <label>Tên dự án mới</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={cloneTargetName}
                  onChange={(e) => setCloneTargetName(e.target.value)}
                  autoFocus
                />
              </div>
              <button type="submit" className="btn btn-submit" disabled={projectActionLoading}>
                {projectActionLoading ? "Đang clone..." : "Tạo & Clone"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Nội dung dự án đang chọn ── */}
      {!selectedProjectId ? (
        <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
          Chọn hoặc tạo một dự án để bắt đầu chỉnh sửa.
        </div>
      ) : (
        <>
          <div className="project-selected-label">
            Đang chỉnh sửa: <strong>{selectedProject?.name}</strong>
            <span className="project-preview-link">
              Link preview:
              <code>{window.location.origin}/?project={selectedProjectId}</code>
            </span>
          </div>

          <div className="admin-tabs">
            <button className={`admin-tab-btn ${activeTab === "pricing" ? "active" : ""}`} onClick={() => setActiveTab("pricing")}>Trang 1: Bảng Giá</button>
            <button className={`admin-tab-btn ${activeTab === "packages" ? "active" : ""}`} onClick={() => setActiveTab("packages")}>Quản lý Gói cước</button>
            <button className={`admin-tab-btn ${activeTab === "features" ? "active" : ""}`} onClick={() => setActiveTab("features")}>Trang 2: Tính Năng</button>
            <button className={`admin-tab-btn ${activeTab === "services" ? "active" : ""}`} onClick={() => setActiveTab("services")}>Trang 3: Dịch Vụ</button>
            <button className={`admin-tab-btn ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>⚙ Cài đặt</button>
          </div>

          {activeTab === "settings" ? (
            <div className="settings-panel">
              <h3>Thông tin hiển thị ở Footer & Báo giá</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>
                Thông tin này hiển thị ở footer trang web và trong file PDF xuất ra.
              </p>
              <form onSubmit={handleSaveSettings} className="settings-form">
                <div className="settings-grid">
                  <div className="form-group">
                    <label>Tên công ty</label>
                    <input type="text" className="form-input" value={settingsForm.company_name} onChange={(e) => setSettingsForm({ ...settingsForm, company_name: e.target.value })} placeholder="CÔNG TY CỔ PHẦN..." />
                  </div>
                  <div className="form-group">
                    <label>Mã số thuế / GPKD</label>
                    <input type="text" className="form-input" value={settingsForm.tax_code} onChange={(e) => setSettingsForm({ ...settingsForm, tax_code: e.target.value })} placeholder="1234567890 (Cấp bởi...)" />
                  </div>
                  <div className="form-group settings-full-row">
                    <label>Địa chỉ</label>
                    <input type="text" className="form-input" value={settingsForm.address} onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })} placeholder="Số nhà, đường, phường, quận, tỉnh/thành phố" />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input type="text" className="form-input" value={settingsForm.phone} onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} placeholder="0968 688 888" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-input" value={settingsForm.email} onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })} placeholder="contact@company.com" />
                  </div>
                  <div className="form-group">
                    <label>Website</label>
                    <input type="text" className="form-input" value={settingsForm.website} onChange={(e) => setSettingsForm({ ...settingsForm, website: e.target.value })} placeholder="https://www.company.com" />
                  </div>
                  <div className="form-group">
                    <label>Ngày áp dụng bảng giá</label>
                    <input type="text" className="form-input" value={settingsForm.apply_date} onChange={(e) => setSettingsForm({ ...settingsForm, apply_date: e.target.value })} placeholder="01/08/2025" />
                    <small style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "4px", display: "block" }}>Hiển thị dưới tiêu đề bảng giá: "(Áp dụng từ DD/MM/YYYY)"</small>
                  </div>
                </div>
                <div className="settings-preview">
                  <div className="settings-preview-label">Xem trước Footer</div>
                  <div className="settings-preview-box">
                    {settingsForm.company_name && <div className="address-item"><strong>🏢 Đơn vị chủ quản:</strong> {settingsForm.company_name}</div>}
                    {settingsForm.address && <div className="address-item"><strong>📍 Địa chỉ:</strong> {settingsForm.address}</div>}
                    {settingsForm.tax_code && <div className="address-item"><strong>📝 MST/GPKD:</strong> {settingsForm.tax_code}</div>}
                    {settingsForm.phone && <div className="address-item"><strong>📞 SĐT:</strong> {settingsForm.phone}</div>}
                    {settingsForm.email && <div className="address-item"><strong>✉️ Email:</strong> {settingsForm.email}</div>}
                    {settingsForm.website && <div className="address-item"><strong>🌐 Website:</strong> {settingsForm.website}</div>}
                    {!settingsForm.company_name && !settingsForm.address && !settingsForm.phone && (
                      <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>Điền thông tin bên trên để xem trước...</span>
                    )}
                  </div>
                </div>
                <button type="submit" className="btn btn-submit" disabled={settingsLoading}>
                  {settingsLoading ? "Đang lưu..." : "Lưu Thông Tin"}
                </button>
              </form>
            </div>
          ) : loading ? (
            <div className="loading-state">Đang xử lý dữ liệu...</div>
          ) : (
            <div className="admin-content-grid">
              <div className="admin-list-card">
                <h3>Danh sách hiện tại</h3>

                {activeTab === "pricing" && (
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Số học viên</th>
                          {packageList.map((pkg) => <th key={pkg.key}>{pkg.name} ({pkg.group})</th>)}
                          <th>Thứ tự</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pricingList.map((item) => (
                          <tr key={item._id} className={editingId === item._id ? "row-editing" : ""}>
                            {editingId === item._id ? (
                              <>
                                <td><input type="text" className="form-input" value={pricingForm.studentRange} onChange={(e) => setPricingForm({ ...pricingForm, studentRange: e.target.value })} /></td>
                                {packageList.map((pkg) => (
                                  <td key={pkg.key}><input type="number" className="form-input text-center" value={pricingForm.prices[pkg.key] ?? 0} onChange={(e) => setPricingForm({ ...pricingForm, prices: { ...pricingForm.prices, [pkg.key]: Number(e.target.value) } })} /></td>
                                ))}
                                <td><input type="number" className="form-input text-center" style={{ width: "60px" }} value={pricingForm.order} onChange={(e) => setPricingForm({ ...pricingForm, order: Number(e.target.value) })} /></td>
                                <td className="actions-cell">
                                  <button className="btn btn-save" onClick={() => handlePricingSave(item._id)}>Lưu</button>
                                  <button className="btn btn-cancel" onClick={() => setEditingId(null)}>Hủy</button>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="font-bold">{item.studentRange}</td>
                                {packageList.map((pkg) => <td key={pkg.key} className="text-center font-bold">{item.prices?.[pkg.key] !== undefined ? `${item.prices[pkg.key]} triệu` : "-"}</td>)}
                                <td className="text-center">{item.order}</td>
                                <td className="actions-cell">
                                  <button className="btn btn-edit" onClick={() => handlePricingEdit(item)}>Sửa</button>
                                  <button className="btn btn-delete" onClick={() => handlePricingDelete(item._id)}>Xóa</button>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === "packages" && (
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr><th>Mã Khóa (key)</th><th>Tên Gói Cước</th><th>Nhóm (group)</th><th>Thứ tự</th><th>Thao tác</th></tr>
                      </thead>
                      <tbody>
                        {packageList.map((item) => (
                          <tr key={item._id} className={editingId === item._id ? "row-editing" : ""}>
                            {editingId === item._id ? (
                              <>
                                <td><input type="text" className="form-input" value={packageForm.key} onChange={(e) => setPackageForm({ ...packageForm, key: e.target.value })} /></td>
                                <td><input type="text" className="form-input" value={packageForm.name} onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })} /></td>
                                <td><input type="text" className="form-input" value={packageForm.group} onChange={(e) => setPackageForm({ ...packageForm, group: e.target.value })} /></td>
                                <td><input type="number" className="form-input text-center" style={{ width: "60px" }} value={packageForm.order} onChange={(e) => setPackageForm({ ...packageForm, order: Number(e.target.value) })} /></td>
                                <td className="actions-cell">
                                  <button className="btn btn-save" onClick={() => handlePackageSave(item._id)}>Lưu</button>
                                  <button className="btn btn-cancel" onClick={() => setEditingId(null)}>Hủy</button>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="font-bold font-mono">{item.key}</td>
                                <td>{item.name}</td>
                                <td><span style={{ padding: "4px 8px", backgroundColor: "rgba(29,95,163,0.1)", color: "#1d5fa3", borderRadius: "4px", fontSize: "13px", fontWeight: "600" }}>{item.group}</span></td>
                                <td className="text-center">{item.order}</td>
                                <td className="actions-cell">
                                  <button className="btn btn-edit" onClick={() => handlePackageEdit(item)}>Sửa</button>
                                  <button className="btn btn-delete" onClick={() => handlePackageDelete(item._id)}>Xóa</button>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === "features" && (
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th style={{ width: "20%" }}>Tính năng</th>
                          {uniqueGroups.map((g) => <th key={g} style={{ width: `${Math.floor(65 / uniqueGroups.length)}%` }}>Phiên bản {g}</th>)}
                          <th style={{ width: "5%" }}>Thứ tự</th>
                          <th style={{ width: "10%" }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {featureList.map((item) => (
                          <tr key={item._id} className={editingId === item._id ? "row-editing" : ""}>
                            {editingId === item._id ? (
                              <>
                                <td><input type="text" className="form-input" value={featureForm.category} onChange={(e) => setFeatureForm({ ...featureForm, category: e.target.value })} /></td>
                                {uniqueGroups.map((g) => (
                                  <td key={g}><textarea className="form-textarea" rows={4} value={featureForm.contents[g] ?? ""} onChange={(e) => setFeatureForm({ ...featureForm, contents: { ...featureForm.contents, [g]: e.target.value } })} placeholder="Mỗi ý viết ở 1 dòng" /></td>
                                ))}
                                <td><input type="number" className="form-input text-center" value={featureForm.order} onChange={(e) => setFeatureForm({ ...featureForm, order: Number(e.target.value) })} /></td>
                                <td className="actions-cell">
                                  <button className="btn btn-save" onClick={() => handleFeatureSave(item._id)}>Lưu</button>
                                  <button className="btn btn-cancel" onClick={() => setEditingId(null)}>Hủy</button>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="font-bold">{item.category}</td>
                                {uniqueGroups.map((g) => (
                                  <td key={g}><ul className="bullet-list-small">{item.contents?.[g]?.map((c, i) => <li key={i}>{c}</li>) ?? <span className="no-integration">Không tích hợp</span>}</ul></td>
                                ))}
                                <td className="text-center">{item.order}</td>
                                <td className="actions-cell">
                                  <button className="btn btn-edit" onClick={() => handleFeatureEdit(item)}>Sửa</button>
                                  <button className="btn btn-delete" onClick={() => handleFeatureDelete(item._id)}>Xóa</button>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === "services" && (
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th style={{ width: "20%" }}>Dịch vụ</th>
                          {uniqueGroups.map((g) => <th key={g} style={{ width: `${Math.floor(65 / uniqueGroups.length)}%` }}>Phiên bản {g}</th>)}
                          <th style={{ width: "5%" }}>Thứ tự</th>
                          <th style={{ width: "10%" }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {serviceList.map((item) => (
                          <tr key={item._id} className={editingId === item._id ? "row-editing" : ""}>
                            {editingId === item._id ? (
                              <>
                                <td><input type="text" className="form-input" value={serviceForm.serviceName} onChange={(e) => setServiceForm({ ...serviceForm, serviceName: e.target.value })} /></td>
                                {uniqueGroups.map((g) => (
                                  <td key={g}><textarea className="form-textarea" rows={4} value={serviceForm.contents[g] ?? ""} onChange={(e) => setServiceForm({ ...serviceForm, contents: { ...serviceForm.contents, [g]: e.target.value } })} placeholder="Mỗi ý viết ở 1 dòng" /></td>
                                ))}
                                <td><input type="number" className="form-input text-center" value={serviceForm.order} onChange={(e) => setServiceForm({ ...serviceForm, order: Number(e.target.value) })} /></td>
                                <td className="actions-cell">
                                  <button className="btn btn-save" onClick={() => handleServiceSave(item._id)}>Lưu</button>
                                  <button className="btn btn-cancel" onClick={() => setEditingId(null)}>Hủy</button>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="font-bold">{item.serviceName}</td>
                                {uniqueGroups.map((g) => (
                                  <td key={g}><ul className="bullet-list-small">{item.contents?.[g]?.map((c, i) => <li key={i}>{c}</li>) ?? "-"}</ul></td>
                                ))}
                                <td className="text-center">{item.order}</td>
                                <td className="actions-cell">
                                  <button className="btn btn-edit" onClick={() => handleServiceEdit(item)}>Sửa</button>
                                  <button className="btn btn-delete" onClick={() => handleServiceDelete(item._id)}>Xóa</button>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Create New Form Sidebar */}
              <div className="admin-form-card">
                <h3>Thêm Bản Ghi Mới</h3>

                {activeTab === "pricing" && (
                  <form onSubmit={handlePricingCreate} className="admin-form">
                    <div className="form-group">
                      <label>Khoảng số học viên</label>
                      <input type="text" className="form-input" placeholder="Ví dụ: 5001-6000" required value={pricingForm.studentRange} onChange={(e) => setPricingForm({ ...pricingForm, studentRange: e.target.value })} />
                    </div>
                    {packageList.map((pkg) => (
                      <div className="form-group" key={pkg.key}>
                        <label>{pkg.group} - {pkg.name} (triệu VNĐ)</label>
                        <input type="number" className="form-input" min={0} required value={pricingForm.prices[pkg.key] ?? 0} onChange={(e) => setPricingForm({ ...pricingForm, prices: { ...pricingForm.prices, [pkg.key]: Number(e.target.value) } })} />
                      </div>
                    ))}
                    <div className="form-group">
                      <label>Thứ tự sắp xếp (số)</label>
                      <input type="number" className="form-input" required value={pricingForm.order} onChange={(e) => setPricingForm({ ...pricingForm, order: Number(e.target.value) })} />
                    </div>
                    <button type="submit" className="btn btn-submit">Thêm Khoảng Giá</button>
                  </form>
                )}

                {activeTab === "packages" && (
                  <form onSubmit={handlePackageCreate} className="admin-form">
                    <div className="form-group">
                      <label>Mã Khóa (key)</label>
                      <input type="text" className="form-input" placeholder="Ví dụ: basic6Month" required value={packageForm.key} onChange={(e) => setPackageForm({ ...packageForm, key: e.target.value })} />
                      <small style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "4px", display: "block" }}>Chỉ dùng chữ cái không dấu, chữ số và gạch dưới.</small>
                    </div>
                    <div className="form-group">
                      <label>Tên Gói Cước</label>
                      <input type="text" className="form-input" placeholder="Ví dụ: Gói 06 Tháng" required value={packageForm.name} onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Nhóm Gói Cước (group)</label>
                      <input type="text" className="form-input" placeholder="Ví dụ: Basic, Plus, Premium" required value={packageForm.group} onChange={(e) => setPackageForm({ ...packageForm, group: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Thứ tự sắp xếp (số)</label>
                      <input type="number" className="form-input" required value={packageForm.order} onChange={(e) => setPackageForm({ ...packageForm, order: Number(e.target.value) })} />
                    </div>
                    <button type="submit" className="btn btn-submit">Thêm Gói Cước</button>
                  </form>
                )}

                {activeTab === "features" && (
                  <form onSubmit={handleFeatureCreate} className="admin-form">
                    <div className="form-group">
                      <label>Danh mục tính năng</label>
                      <input type="text" className="form-input" placeholder="Ví dụ: Đào tạo, Quản lý..." required value={featureForm.category} onChange={(e) => setFeatureForm({ ...featureForm, category: e.target.value })} />
                    </div>
                    {uniqueGroups.map((g) => (
                      <div className="form-group" key={g}>
                        <label>Nội dung {g} (Mỗi dòng là 1 ý)</label>
                        <textarea className="form-textarea" rows={4} placeholder={`Nhập các dòng tính năng cho gói ${g}...`} required value={featureForm.contents[g] ?? ""} onChange={(e) => setFeatureForm({ ...featureForm, contents: { ...featureForm.contents, [g]: e.target.value } })} />
                      </div>
                    ))}
                    <div className="form-group">
                      <label>Thứ tự sắp xếp (số)</label>
                      <input type="number" className="form-input" required value={featureForm.order} onChange={(e) => setFeatureForm({ ...featureForm, order: Number(e.target.value) })} />
                    </div>
                    <button type="submit" className="btn btn-submit">Thêm Tính Năng</button>
                  </form>
                )}

                {activeTab === "services" && (
                  <form onSubmit={handleServiceCreate} className="admin-form">
                    <div className="form-group">
                      <label>Tên dịch vụ hỗ trợ</label>
                      <input type="text" className="form-input" placeholder="Ví dụ: Nội dung hỗ trợ..." required value={serviceForm.serviceName} onChange={(e) => setServiceForm({ ...serviceForm, serviceName: e.target.value })} />
                    </div>
                    {uniqueGroups.map((g) => (
                      <div className="form-group" key={g}>
                        <label>Nội dung {g} (Mỗi dòng là 1 ý)</label>
                        <textarea className="form-textarea" rows={4} placeholder={`Nhập chi tiết điều kiện hỗ trợ cho gói ${g}...`} required value={serviceForm.contents[g] ?? ""} onChange={(e) => setServiceForm({ ...serviceForm, contents: { ...serviceForm.contents, [g]: e.target.value } })} />
                      </div>
                    ))}
                    <div className="form-group">
                      <label>Thứ tự sắp xếp (số)</label>
                      <input type="number" className="form-input" required value={serviceForm.order} onChange={(e) => setServiceForm({ ...serviceForm, order: Number(e.target.value) })} />
                    </div>
                    <button type="submit" className="btn btn-submit">Thêm Dịch Vụ</button>
                  </form>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
