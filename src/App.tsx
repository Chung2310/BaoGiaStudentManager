import React, { useEffect, useState } from "react";
import { IgenErpLogo, IgenTechLogo } from "./components/Logo";
import { PricingTable } from "./components/PricingTable";
import { FeatureTable } from "./components/FeatureTable";
import { ServiceTable } from "./components/ServiceTable";
import { AdminDashboard } from "./components/AdminDashboard";
import { api } from "./services/api";
import { FileDown } from "lucide-react";

interface FooterInfo {
  company_name: string;
  address: string;
  tax_code: string;
  phone: string;
  email: string;
  website: string;
  apply_date: string;
}

const defaultFooter: FooterInfo = {
  company_name: "CÔNG TY CỔ PHẦN CÔNG NGHỆ IGEN",
  address: "Lô LK3 LK4 Đường Lạc Long Quân, Phường Kinh Bắc, Thành phố Bắc Ninh, Tỉnh Bắc Ninh, Việt Nam",
  tax_code: "2301355232 (Cấp bởi Sở KH&ĐT Tỉnh Bắc Ninh)",
  phone: "",
  email: "",
  website: "",
  apply_date: "01/08/2025",
};

const PrintHeader: React.FC = () => (
  <div className="print-only-header">
    <div className="logo-group">
      <IgenErpLogo style={{ height: "35px" }} />
    </div>
    <div className="header-meta">
      <div className="header-meta-title">HỆ THỐNG QUẢN TRỊ DOANH NGHIỆP TOÀN DIỆN</div>
      <div className="header-meta-subtitle">(ALL IN ONE) DÀNH CHO DOANH NGHIỆP & TRƯỜNG HỌC</div>
    </div>
  </div>
);

const PrintFooter: React.FC<{ info: FooterInfo }> = ({ info }) => (
  <div className="print-only-footer">
    <div className="footer-top-row">
      <div className="footer-left">
        <IgenTechLogo />
        <div className="footer-address-block">
          {info.company_name && (
            <div className="address-item">
              <strong>🏢 Đơn vị chủ quản:</strong> {info.company_name}
            </div>
          )}
          {info.address && (
            <div className="address-item">
              <strong>📍 Địa chỉ:</strong> {info.address}
            </div>
          )}
          {info.tax_code && (
            <div className="address-item">
              <strong>📝 MST/GPKD:</strong> {info.tax_code}
            </div>
          )}
          {info.phone && (
            <div className="address-item">
              <strong>📞 SĐT:</strong> {info.phone}
            </div>
          )}
          {info.email && (
            <div className="address-item">
              <strong>✉️ Email:</strong> {info.email}
            </div>
          )}
          {info.website && (
            <div className="address-item">
              <strong>🌐 Website:</strong> {info.website}
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="footer-divider"></div>
    <div className="footer-bottom">
      Bản quyền thuộc về {info.company_name || "Công ty Cổ phần Công nghệ iGen"} &copy; {new Date().getFullYear()}. Bảo lưu mọi quyền.
    </div>
  </div>
);

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pricing" | "features" | "services">("pricing");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [printOrientation, setPrintOrientation] = useState<"landscape" | "portrait">("landscape");
  const [printScope, setPrintScope] = useState<"current" | "all">("current");
  const [footerInfo, setFooterInfo] = useState<FooterInfo>(defaultFooter);
  const [activeProjectId, setActiveProjectId] = useState<string | undefined>(undefined);

  // Auth Modal States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      if (!data) return;
      const map: Record<string, string> = {};
      data.forEach((s: any) => { map[s.key] = s.value; });
      setFooterInfo({
        company_name: map.company_name || defaultFooter.company_name,
        address: map.address || defaultFooter.address,
        tax_code: map.tax_code || defaultFooter.tax_code,
        phone: map.phone || "",
        email: map.email || "",
        website: map.website || "",
        apply_date: map.apply_date || defaultFooter.apply_date,
      });
    } catch (err) {
      console.error("Lỗi lấy cấu hình:", err);
    }
  };

  const checkSession = async () => {
    const user = await api.checkSession();
    if (user) setCurrentUser(user);
  };

  useEffect(() => {
    checkSession();
    loadSettings();
    const resolveProject = async () => {
      const urlParam = new URLSearchParams(window.location.search).get("project");
      if (urlParam) {
        setActiveProjectId(urlParam);
      } else {
        try {
          const projects = await api.getProjects();
          if (projects && projects.length > 0) setActiveProjectId(projects[0]._id);
        } catch {
          // fallback: no project filter
        }
      }
    };
    resolveProject();
  }, []);

  useEffect(() => {
    if (!isAdminMode) loadSettings();
  }, [isAdminMode]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      if (authMode === "login") {
        const data = await api.login({ email, password });
        setCurrentUser(data.user);
        setShowAuthModal(false);
        setIsAdminMode(true);
      } else {
        await api.register({ email, password, displayName });
        setAuthMode("login");
        setAuthError("Đăng ký thành công! Hãy đăng nhập bằng tài khoản mới.");
      }
    } catch (err: any) {
      setAuthError(err.message || "Xác thực thất bại");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setIsAdminMode(false);
  };

  const handlePrint = () => {
    const styleId = "dynamic-print-orientation";
    let el = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = styleId;
      document.head.appendChild(el);
    }
    el.textContent = `@media print { @page { size: A4 ${printOrientation}; margin: 8mm 12mm; } }`;

    if (printScope === "all") {
      document.body.classList.add("print-all-mode");
      const cleanup = () => {
        document.body.classList.remove("print-all-mode");
        window.removeEventListener("afterprint", cleanup);
      };
      window.addEventListener("afterprint", cleanup);
    }

    window.print();
  };

  return (
    <div className="app-container">
      {/* Top Brand Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo-group">
            <IgenErpLogo />
          </div>
        </div>
      </header>

      {/* Navigation Tab Bar */}
      <nav className="navigation-bar">
        <div className="nav-container">
          <div className="nav-tabs">
            {isAdminMode ? (
              <button className="nav-tab-btn active">Bảng Điều Khiển Admin</button>
            ) : (
              <>
                <button className={`nav-tab-btn ${activeTab === "pricing" ? "active" : ""}`} onClick={() => setActiveTab("pricing")}>
                  Gói Cước Báo Giá
                </button>
                <button className={`nav-tab-btn ${activeTab === "features" ? "active" : ""}`} onClick={() => setActiveTab("features")}>
                  Bảng So Sánh Tính Năng
                </button>
                <button className={`nav-tab-btn ${activeTab === "services" ? "active" : ""}`} onClick={() => setActiveTab("services")}>
                  Dịch Vụ Khách Hàng
                </button>
              </>
            )}
          </div>

          <div className="nav-actions">

            {isAdminMode ? (
              <button className="btn-admin" onClick={() => setIsAdminMode(false)}>Xem Bản Công Khai</button>
            ) : currentUser ? (
              <button className="btn-admin" onClick={() => setIsAdminMode(true)}>Trang Admin</button>
            ) : null}

            {currentUser ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: "#fff", fontSize: "14px", fontWeight: 500 }}>
                  Xin chào, <strong>{currentUser.displayName}</strong>
                </span>
                <button className="btn-logout" onClick={handleLogout}>Đăng xuất</button>
              </div>
            ) : (
              <button className="btn-admin" onClick={() => { setAuthMode("login"); setShowAuthModal(true); }}>
                Đăng Nhập Admin
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Page Area */}
      <main className="content-wrapper">
        {isAdminMode && currentUser ? (
          <AdminDashboard applyDate={footerInfo.apply_date} onSettingsSaved={loadSettings} />
        ) : (
          <>
            {!isAdminMode && (
              <div className="print-float-panel" id="print-float-panel">
                <div className="print-float-label">Phạm vi xuất</div>
                <div className="print-float-scopes">
                  <button className={`float-btn-scope ${printScope === "current" ? "active" : ""}`} onClick={() => setPrintScope("current")} title="Chỉ xuất trang đang xem">
                    Trang này
                  </button>
                  <button className={`float-btn-scope ${printScope === "all" ? "active" : ""}`} onClick={() => setPrintScope("all")} title="Xuất cả 3 trang vào một file">
                    Tất cả
                  </button>
                </div>
                <div className="print-float-label">Hướng in</div>
                <div className="print-float-orientations">
                  <button id="float-btn-landscape" className={`float-btn-orient ${printOrientation === "landscape" ? "active" : ""}`} onClick={() => setPrintOrientation("landscape")} title="Khổ ngang A4">
                    <span className="orient-icon orient-landscape" />
                    Ngang
                  </button>
                  <button id="float-btn-portrait" className={`float-btn-orient ${printOrientation === "portrait" ? "active" : ""}`} onClick={() => setPrintOrientation("portrait")} title="Khổ dọc A4">
                    <span className="orient-icon orient-portrait" />
                    Dọc
                  </button>
                </div>
                <button className="float-btn-print" onClick={handlePrint}>
                  <FileDown size={15} />
                  Xuất PDF
                </button>
              </div>
            )}
            {/* Page 1: Pricing */}
            <div className={`print-page ${activeTab === "pricing" ? "screen-active" : "screen-hidden"}`}>
              <PrintHeader />
              <PricingTable projectId={activeProjectId} applyDate={footerInfo.apply_date} />
              <PrintFooter info={footerInfo} />
            </div>

            {/* Page 2: Features */}
            <div className={`print-page ${activeTab === "features" ? "screen-active" : "screen-hidden"}`}>
              <PrintHeader />
              <FeatureTable projectId={activeProjectId} />
              <PrintFooter info={footerInfo} />
            </div>

            {/* Page 3: Services */}
            <div className={`print-page ${activeTab === "services" ? "screen-active" : "screen-hidden"}`}>
              <PrintHeader />
              <ServiceTable projectId={activeProjectId} />
              <PrintFooter info={footerInfo} />
            </div>
          </>
        )}
      </main>

      {/* Screen Footer */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-top-row">
            <div className="footer-left">
              <IgenTechLogo />
              <div className="footer-address-block">
                {footerInfo.company_name && (
                  <div className="address-item">
                    <strong>🏢 Đơn vị chủ quản:</strong> {footerInfo.company_name}
                  </div>
                )}
                {footerInfo.address && (
                  <div className="address-item">
                    <strong>📍 Địa chỉ:</strong> {footerInfo.address}
                  </div>
                )}
                {footerInfo.tax_code && (
                  <div className="address-item">
                    <strong>📝 MST/GPKD:</strong> {footerInfo.tax_code}
                  </div>
                )}
                {footerInfo.phone && (
                  <div className="address-item">
                    <strong>📞 Số điện thoại:</strong> {footerInfo.phone}
                  </div>
                )}
                {footerInfo.email && (
                  <div className="address-item">
                    <strong>✉️ Email:</strong> {footerInfo.email}
                  </div>
                )}
                {footerInfo.website && (
                  <div className="address-item">
                    <strong>🌐 Website:</strong> {footerInfo.website}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-bottom">
            Bản quyền thuộc về {footerInfo.company_name || "Công ty Cổ phần Công nghệ iGen"} &copy; {new Date().getFullYear()}. Bảo lưu mọi quyền.
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAuthModal(false)}>&times;</button>
            <h3 className="modal-title">
              {authMode === "login" ? "Đăng Nhập Quản Trị Viên" : "Đăng Ký Tài Khoản"}
            </h3>

            {authError && (
              <div className={`alert-message ${authError.includes("thành công") ? "success-message" : "error-message"}`}>
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="admin-form">
              {authMode === "register" && (
                <div className="form-group">
                  <label>Tên hiển thị</label>
                  <input type="text" className="form-input" placeholder="Nguyễn Văn A" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
              )}
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-input" placeholder="admin@igen-erp.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Mật khẩu</label>
                <input type="password" className="form-input" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <button type="submit" className="btn btn-submit" disabled={authLoading}>
                {authLoading ? "Đang xử lý..." : authMode === "login" ? "Đăng Nhập" : "Đăng Ký"}
              </button>
            </form>

            <div className="modal-footer-toggle">
              {authMode === "login" ? (
                <></>
              ) : (
                <>
                  Đã có tài khoản?{" "}
                  <span onClick={() => { setAuthMode("login"); setAuthError(""); }}>Đăng nhập</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
