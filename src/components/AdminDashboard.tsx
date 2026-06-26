import React, { useEffect, useState } from "react";
import { api } from "../services/api";

interface PricingItem {
  _id: string;
  studentRange: string;
  basic6Month: number;
  basic12Month: number;
  plusFirstYear: number;
  plusNextYears: number;
  order: number;
}

interface FeatureItem {
  _id: string;
  category: string;
  basicContent: string[];
  plusContent: string[];
  order: number;
}

interface ServiceItem {
  _id: string;
  serviceName: string;
  basicContent: string[];
  plusContent: string[];
  order: number;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pricing" | "features" | "services">("pricing");
  const [pricingList, setPricingList] = useState<PricingItem[]>([]);
  const [featureList, setFeatureList] = useState<FeatureItem[]>([]);
  const [serviceList, setServiceList] = useState<ServiceItem[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Pricing Form States
  const [pricingForm, setPricingForm] = useState({
    studentRange: "",
    basic6Month: 0,
    basic12Month: 0,
    plusFirstYear: 0,
    plusNextYears: 0,
    order: 0,
  });

  // Feature Form States
  const [featureForm, setFeatureForm] = useState({
    category: "",
    basicContent: "", // will split by newline
    plusContent: "",  // will split by newline
    order: 0,
  });

  // Service Form States
  const [serviceForm, setServiceForm] = useState({
    serviceName: "",
    basicContent: "", // will split by newline
    plusContent: "",  // will split by newline
    order: 0,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      setEditingId(null);
      if (activeTab === "pricing") {
        const data = await api.getPricing();
        setPricingList(data);
      } else if (activeTab === "features") {
        const data = await api.getFeatures();
        setFeatureList(data);
      } else {
        const data = await api.getServices();
        setServiceList(data);
      }
    } catch (err: any) {
      setError(err.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Pricing CRUD Handlers
  const handlePricingEdit = (item: PricingItem) => {
    setEditingId(item._id);
    setPricingForm({
      studentRange: item.studentRange,
      basic6Month: item.basic6Month,
      basic12Month: item.basic12Month,
      plusFirstYear: item.plusFirstYear,
      plusNextYears: item.plusNextYears,
      order: item.order,
    });
  };

  const handlePricingSave = async (id: string) => {
    try {
      setError("");
      await api.updatePricing(id, pricingForm);
      showSuccess("Cập nhật bảng giá thành công!");
      setEditingId(null);
      loadData();
    } catch (err: any) {
      setError(err.message || "Lỗi cập nhật bảng giá");
    }
  };

  const handlePricingCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      await api.createPricing(pricingForm);
      showSuccess("Thêm mới khoảng giá thành công!");
      setPricingForm({
        studentRange: "",
        basic6Month: 0,
        basic12Month: 0,
        plusFirstYear: 0,
        plusNextYears: 0,
        order: pricingList.length + 1,
      });
      loadData();
    } catch (err: any) {
      setError(err.message || "Lỗi tạo mới");
    }
  };

  const handlePricingDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khoảng giá này không?")) return;
    try {
      setError("");
      await api.deletePricing(id);
      showSuccess("Xóa khoảng giá thành công!");
      loadData();
    } catch (err: any) {
      setError(err.message || "Lỗi xóa");
    }
  };

  // Feature CRUD Handlers
  const handleFeatureEdit = (item: FeatureItem) => {
    setEditingId(item._id);
    setFeatureForm({
      category: item.category,
      basicContent: item.basicContent.join("\n"),
      plusContent: item.plusContent.join("\n"),
      order: item.order,
    });
  };

  const handleFeatureSave = async (id: string) => {
    try {
      setError("");
      const payload = {
        category: featureForm.category,
        basicContent: featureForm.basicContent.split("\n").filter((x) => x.trim() !== ""),
        plusContent: featureForm.plusContent.split("\n").filter((x) => x.trim() !== ""),
        order: featureForm.order,
      };
      await api.updateFeature(id, payload);
      showSuccess("Cập nhật tính năng thành công!");
      setEditingId(null);
      loadData();
    } catch (err: any) {
      setError(err.message || "Lỗi cập nhật tính năng");
    }
  };

  const handleFeatureCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      const payload = {
        category: featureForm.category,
        basicContent: featureForm.basicContent.split("\n").filter((x) => x.trim() !== ""),
        plusContent: featureForm.plusContent.split("\n").filter((x) => x.trim() !== ""),
        order: featureForm.order,
      };
      await api.createFeature(payload);
      showSuccess("Thêm mới danh mục tính năng thành công!");
      setFeatureForm({
        category: "",
        basicContent: "",
        plusContent: "",
        order: featureList.length + 1,
      });
      loadData();
    } catch (err: any) {
      setError(err.message || "Lỗi tạo mới tính năng");
    }
  };

  const handleFeatureDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục tính năng này không?")) return;
    try {
      setError("");
      await api.deleteFeature(id);
      showSuccess("Xóa danh mục tính năng thành công!");
      loadData();
    } catch (err: any) {
      setError(err.message || "Lỗi xóa");
    }
  };

  // Service CRUD Handlers
  const handleServiceEdit = (item: ServiceItem) => {
    setEditingId(item._id);
    setServiceForm({
      serviceName: item.serviceName,
      basicContent: item.basicContent.join("\n"),
      plusContent: item.plusContent.join("\n"),
      order: item.order,
    });
  };

  const handleServiceSave = async (id: string) => {
    try {
      setError("");
      const payload = {
        serviceName: serviceForm.serviceName,
        basicContent: serviceForm.basicContent.split("\n").filter((x) => x.trim() !== ""),
        plusContent: serviceForm.plusContent.split("\n").filter((x) => x.trim() !== ""),
        order: serviceForm.order,
      };
      await api.updateService(id, payload);
      showSuccess("Cập nhật dịch vụ thành công!");
      setEditingId(null);
      loadData();
    } catch (err: any) {
      setError(err.message || "Lỗi cập nhật dịch vụ");
    }
  };

  const handleServiceCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      const payload = {
        serviceName: serviceForm.serviceName,
        basicContent: serviceForm.basicContent.split("\n").filter((x) => x.trim() !== ""),
        plusContent: serviceForm.plusContent.split("\n").filter((x) => x.trim() !== ""),
        order: serviceForm.order,
      };
      await api.createService(payload);
      showSuccess("Thêm mới dịch vụ thành công!");
      setServiceForm({
        serviceName: "",
        basicContent: "",
        plusContent: "",
        order: serviceList.length + 1,
      });
      loadData();
    } catch (err: any) {
      setError(err.message || "Lỗi tạo mới dịch vụ");
    }
  };

  const handleServiceDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?")) return;
    try {
      setError("");
      await api.deleteService(id);
      showSuccess("Xóa dịch vụ thành công!");
      loadData();
    } catch (err: any) {
      setError(err.message || "Lỗi xóa");
    }
  };

  return (
    <div className="admin-dashboard fade-in">
      <div className="admin-header">
        <h2>BẢNG ĐIỀU KHIỂN QUẢN TRỊ VIÊN</h2>
        <p className="admin-desc">Quản lý và chỉnh sửa trực tiếp các thông số bảng giá, tính năng, và dịch vụ khách hàng.</p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === "pricing" ? "active" : ""}`}
          onClick={() => setActiveTab("pricing")}
        >
          Trang 1: Bảng Giá
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "features" ? "active" : ""}`}
          onClick={() => setActiveTab("features")}
        >
          Trang 2: Tính Năng
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "services" ? "active" : ""}`}
          onClick={() => setActiveTab("services")}
        >
          Trang 3: Dịch Vụ
        </button>
      </div>

      {/* Feedback Messages */}
      {error && <div className="alert-message error-message">{error}</div>}
      {successMsg && <div className="alert-message success-message">{successMsg}</div>}

      {loading ? (
        <div className="loading-state">Đang xử lý dữ liệu...</div>
      ) : (
        <div className="admin-content-grid">
          {/* Main List and Inline Edit */}
          <div className="admin-list-card">
            <h3>Danh sách hiện tại</h3>
            
            {activeTab === "pricing" && (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Số học viên</th>
                      <th>Basic 6T</th>
                      <th>Basic 12T</th>
                      <th>Plus Năm đầu</th>
                      <th>Plus Năm tiếp</th>
                      <th>Thứ tự</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingList.map((item) => (
                      <tr key={item._id} className={editingId === item._id ? "row-editing" : ""}>
                        {editingId === item._id ? (
                          <>
                            <td>
                              <input
                                type="text"
                                className="form-input"
                                value={pricingForm.studentRange}
                                onChange={(e) => setPricingForm({ ...pricingForm, studentRange: e.target.value })}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-input text-center"
                                value={pricingForm.basic6Month}
                                onChange={(e) => setPricingForm({ ...pricingForm, basic6Month: Number(e.target.value) })}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-input text-center"
                                value={pricingForm.basic12Month}
                                onChange={(e) => setPricingForm({ ...pricingForm, basic12Month: Number(e.target.value) })}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-input text-center"
                                value={pricingForm.plusFirstYear}
                                onChange={(e) => setPricingForm({ ...pricingForm, plusFirstYear: Number(e.target.value) })}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-input text-center"
                                value={pricingForm.plusNextYears}
                                onChange={(e) => setPricingForm({ ...pricingForm, plusNextYears: Number(e.target.value) })}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-input text-center"
                                style={{ width: "60px" }}
                                value={pricingForm.order}
                                onChange={(e) => setPricingForm({ ...pricingForm, order: Number(e.target.value) })}
                              />
                            </td>
                            <td className="actions-cell">
                              <button className="btn btn-save" onClick={() => handlePricingSave(item._id)}>Lưu</button>
                              <button className="btn btn-cancel" onClick={() => setEditingId(null)}>Hủy</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="font-bold">{item.studentRange}</td>
                            <td className="text-center">{item.basic6Month} triệu</td>
                            <td className="text-center">{item.basic12Month} triệu</td>
                            <td className="text-center font-bold text-primary">{item.plusFirstYear} triệu</td>
                            <td className="text-center font-bold text-primary">{item.plusNextYears} triệu</td>
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

            {activeTab === "features" && (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}>Tính năng</th>
                      <th style={{ width: "35%" }}>Phiên bản Basic</th>
                      <th style={{ width: "35%" }}>Phiên bản Plus</th>
                      <th style={{ width: "5%" }}>Thứ tự</th>
                      <th style={{ width: "10%" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureList.map((item) => (
                      <tr key={item._id} className={editingId === item._id ? "row-editing" : ""}>
                        {editingId === item._id ? (
                          <>
                            <td>
                              <input
                                type="text"
                                className="form-input"
                                value={featureForm.category}
                                onChange={(e) => setFeatureForm({ ...featureForm, category: e.target.value })}
                              />
                            </td>
                            <td>
                              <textarea
                                className="form-textarea"
                                rows={4}
                                value={featureForm.basicContent}
                                onChange={(e) => setFeatureForm({ ...featureForm, basicContent: e.target.value })}
                                placeholder="Mỗi ý viết ở 1 dòng"
                              />
                            </td>
                            <td>
                              <textarea
                                className="form-textarea"
                                rows={4}
                                value={featureForm.plusContent}
                                onChange={(e) => setFeatureForm({ ...featureForm, plusContent: e.target.value })}
                                placeholder="Mỗi ý viết ở 1 dòng"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-input text-center"
                                value={featureForm.order}
                                onChange={(e) => setFeatureForm({ ...featureForm, order: Number(e.target.value) })}
                              />
                            </td>
                            <td className="actions-cell">
                              <button className="btn btn-save" onClick={() => handleFeatureSave(item._id)}>Lưu</button>
                              <button className="btn btn-cancel" onClick={() => setEditingId(null)}>Hủy</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="font-bold">{item.category}</td>
                            <td>
                              <ul className="bullet-list-small">
                                {item.basicContent.map((c, i) => <li key={i}>{c}</li>)}
                              </ul>
                            </td>
                            <td>
                              <ul className="bullet-list-small">
                                {item.plusContent.map((c, i) => <li key={i}>{c}</li>)}
                              </ul>
                            </td>
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
                      <th style={{ width: "35%" }}>Basic</th>
                      <th style={{ width: "30%" }}>Plus</th>
                      <th style={{ width: "5%" }}>Thứ tự</th>
                      <th style={{ width: "10%" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceList.map((item) => (
                      <tr key={item._id} className={editingId === item._id ? "row-editing" : ""}>
                        {editingId === item._id ? (
                          <>
                            <td>
                              <input
                                type="text"
                                className="form-input"
                                value={serviceForm.serviceName}
                                onChange={(e) => setServiceForm({ ...serviceForm, serviceName: e.target.value })}
                              />
                            </td>
                            <td>
                              <textarea
                                className="form-textarea"
                                rows={4}
                                value={serviceForm.basicContent}
                                onChange={(e) => setServiceForm({ ...serviceForm, basicContent: e.target.value })}
                                placeholder="Mỗi ý viết ở 1 dòng"
                              />
                            </td>
                            <td>
                              <textarea
                                className="form-textarea"
                                rows={4}
                                value={serviceForm.plusContent}
                                onChange={(e) => setServiceForm({ ...serviceForm, plusContent: e.target.value })}
                                placeholder="Mỗi ý viết ở 1 dòng"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-input text-center"
                                value={serviceForm.order}
                                onChange={(e) => setServiceForm({ ...serviceForm, order: Number(e.target.value) })}
                              />
                            </td>
                            <td className="actions-cell">
                              <button className="btn btn-save" onClick={() => handleServiceSave(item._id)}>Lưu</button>
                              <button className="btn btn-cancel" onClick={() => setEditingId(null)}>Hủy</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="font-bold">{item.serviceName}</td>
                            <td>
                              <ul className="bullet-list-small">
                                {item.basicContent.map((c, i) => <li key={i}>{c}</li>)}
                              </ul>
                            </td>
                            <td>
                              <ul className="bullet-list-small">
                                {item.plusContent.map((c, i) => <li key={i}>{c}</li>)}
                              </ul>
                            </td>
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
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ví dụ: 5001-6000"
                    required
                    value={pricingForm.studentRange}
                    onChange={(e) => setPricingForm({ ...pricingForm, studentRange: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Basic - Gói 06 Tháng (triệu VNĐ)</label>
                  <input
                    type="number"
                    className="form-input"
                    min={0}
                    required
                    value={pricingForm.basic6Month}
                    onChange={(e) => setPricingForm({ ...pricingForm, basic6Month: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Basic - Gói 12 Tháng (triệu VNĐ)</label>
                  <input
                    type="number"
                    className="form-input"
                    min={0}
                    required
                    value={pricingForm.basic12Month}
                    onChange={(e) => setPricingForm({ ...pricingForm, basic12Month: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Plus - Năm Đầu Tiên (triệu VNĐ)</label>
                  <input
                    type="number"
                    className="form-input"
                    min={0}
                    required
                    value={pricingForm.plusFirstYear}
                    onChange={(e) => setPricingForm({ ...pricingForm, plusFirstYear: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Plus - Năm Tiếp Theo (triệu VNĐ)</label>
                  <input
                    type="number"
                    className="form-input"
                    min={0}
                    required
                    value={pricingForm.plusNextYears}
                    onChange={(e) => setPricingForm({ ...pricingForm, plusNextYears: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Thứ tự sắp xếp (số)</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    value={pricingForm.order}
                    onChange={(e) => setPricingForm({ ...pricingForm, order: Number(e.target.value) })}
                  />
                </div>
                <button type="submit" className="btn btn-submit">Thêm Khoảng Giá</button>
              </form>
            )}

            {activeTab === "features" && (
              <form onSubmit={handleFeatureCreate} className="admin-form">
                <div className="form-group">
                  <label>Danh mục tính năng</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ví dụ: Đào tạo, Quản lý..."
                    required
                    value={featureForm.category}
                    onChange={(e) => setFeatureForm({ ...featureForm, category: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Nội dung Basic (Mỗi dòng là 1 ý)</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Nhập các dòng tính năng..."
                    required
                    value={featureForm.basicContent}
                    onChange={(e) => setFeatureForm({ ...featureForm, basicContent: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Nội dung Plus (Mỗi dòng là 1 ý)</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Nhập các dòng tính năng..."
                    required
                    value={featureForm.plusContent}
                    onChange={(e) => setFeatureForm({ ...featureForm, plusContent: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Thứ tự sắp xếp (số)</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    value={featureForm.order}
                    onChange={(e) => setFeatureForm({ ...featureForm, order: Number(e.target.value) })}
                  />
                </div>
                <button type="submit" className="btn btn-submit">Thêm Tính Năng</button>
              </form>
            )}

            {activeTab === "services" && (
              <form onSubmit={handleServiceCreate} className="admin-form">
                <div className="form-group">
                  <label>Tên dịch vụ hỗ trợ</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ví dụ: Nội dung hỗ trợ..."
                    required
                    value={serviceForm.serviceName}
                    onChange={(e) => setServiceForm({ ...serviceForm, serviceName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Nội dung Basic (Mỗi dòng là 1 ý)</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Nhập chi tiết điều kiện..."
                    required
                    value={serviceForm.basicContent}
                    onChange={(e) => setServiceForm({ ...serviceForm, basicContent: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Nội dung Plus (Mỗi dòng là 1 ý)</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Nhập chi tiết điều kiện..."
                    required
                    value={serviceForm.plusContent}
                    onChange={(e) => setServiceForm({ ...serviceForm, plusContent: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Thứ tự sắp xếp (số)</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    value={serviceForm.order}
                    onChange={(e) => setServiceForm({ ...serviceForm, order: Number(e.target.value) })}
                  />
                </div>
                <button type="submit" className="btn btn-submit">Thêm Dịch Vụ</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
