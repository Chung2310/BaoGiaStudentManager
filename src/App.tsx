import React, { useEffect, useState } from "react";
import { IgenErpLogo, IgenTechLogo, IgenHrmLogo, IgenCrmLogo, IgenFinLogo, IgenWmsLogo } from "./components/Logo";
import { PricingTable } from "./components/PricingTable";
import { FeatureTable } from "./components/FeatureTable";
import { ServiceTable } from "./components/ServiceTable";
import { AdminDashboard } from "./components/AdminDashboard";
import { api } from "./services/api";
import { FileDown } from "lucide-react";

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

const PrintFooter: React.FC = () => (
  <div className="print-only-footer">
    <div className="footer-top-row">
      <div className="footer-left">
        <IgenTechLogo />
        <div className="footer-address-block">
          <div className="address-item">
            <strong>🏢 Đơn vị chủ quản:</strong> CÔNG TY CỔ PHẦN CÔNG NGHỆ IGEN
          </div>
          <div className="address-item">
            <strong>📍 Địa chỉ:</strong> Lô LK3 LK4 Đường Lạc Long Quân, Phường Kinh Bắc, Thành phố Bắc Ninh, Tỉnh Bắc Ninh, Việt Nam
          </div>
          <div className="address-item">
            <strong>📝 MST/GPKD:</strong> 2301355232 (Cấp bởi Sở KH&ĐT Tỉnh Bắc Ninh)
          </div>
        </div>
      </div>
      <div className="footer-right">
        <IgenErpLogo />
        <div style={{ height: "20px", width: "1px", backgroundColor: "#ccc" }}></div>
        <IgenHrmLogo />
        <div style={{ height: "20px", width: "1px", backgroundColor: "#ccc" }}></div>
        <IgenCrmLogo />
        <div style={{ height: "20px", width: "1px", backgroundColor: "#ccc" }}></div>
        <IgenFinLogo />
        <div style={{ height: "20px", width: "1px", backgroundColor: "#ccc" }}></div>
        <IgenWmsLogo />
      </div>
    </div>
    <div className="footer-divider"></div>
    <div className="footer-bottom">
      Bản quyền thuộc về Công ty Cổ phần Công nghệ iGen (iGen Tech) &copy; {new Date().getFullYear()}. Bảo lưu mọi quyền.
    </div>
  </div>
);

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pricing" | "features" | "services">("pricing");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Auth Modal States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const checkSession = async () => {
    const user = await api.checkSession();
    if (user) {
      setCurrentUser(user);
    }
  };

  useEffect(() => {
    // Check if there is an active session
    checkSession();
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      if (authMode === "login") {
        const data = await api.login({ email, password });
        setCurrentUser(data.user);
        setShowAuthModal(false);
        setIsAdminMode(true); // Jump directly to admin mode
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

  return (
    <div className="app-container">
      {/* Top Brand Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo-group">
            <IgenErpLogo />
          </div>
          <div className="header-meta">
            <div className="header-meta-title">
              HỆ THỐNG QUẢN TRỊ DOANH NGHIỆP TOÀN DIỆN
            </div>
            <div className="header-meta-subtitle">
              (ALL IN ONE) DÀNH CHO DOANH NGHIỆP & TRƯỜNG HỌC
            </div>
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
                <button
                  className={`nav-tab-btn ${activeTab === "pricing" ? "active" : ""}`}
                  onClick={() => setActiveTab("pricing")}
                >
                  Gói Cước Báo Giá
                </button>
                <button
                  className={`nav-tab-btn ${activeTab === "features" ? "active" : ""}`}
                  onClick={() => setActiveTab("features")}
                >
                  Bảng So Sánh Tính Năng
                </button>
                <button
                  className={`nav-tab-btn ${activeTab === "services" ? "active" : ""}`}
                  onClick={() => setActiveTab("services")}
                >
                  Dịch Vụ Khách Hàng
                </button>
              </>
            )}
          </div>

          <div className="nav-actions">
            {!isAdminMode && (
              <button className="btn-print" onClick={() => window.print()}>
                <FileDown size={16} /> Xuất PDF
              </button>
            )}
            {isAdminMode ? (
              <button className="btn-admin" onClick={() => setIsAdminMode(false)}>
                Xem Bản Công Khai
              </button>
            ) : currentUser ? (
              <button className="btn-admin" onClick={() => setIsAdminMode(true)}>
                Trang Admin
              </button>
            ) : null}

            {currentUser ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: "#fff", fontSize: "14px", fontWeight: 500 }}>
                  Xin chào, <strong>{currentUser.displayName}</strong>
                </span>
                <button className="btn-logout" onClick={handleLogout}>
                  Đăng xuất
                </button>
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
          <AdminDashboard />
        ) : (
          <>
            {/* Page 1: Pricing */}
            <div className={`print-page ${activeTab === "pricing" ? "screen-active" : "screen-hidden"}`}>
              <PrintHeader />
              <PricingTable />
              <PrintFooter />
            </div>

            {/* Page 2: Features */}
            <div className={`print-page ${activeTab === "features" ? "screen-active" : "screen-hidden"}`}>
              <PrintHeader />
              <FeatureTable />
              <PrintFooter />
            </div>

            {/* Page 3: Services */}
            <div className={`print-page ${activeTab === "services" ? "screen-active" : "screen-hidden"}`}>
              <PrintHeader />
              <ServiceTable />
              <PrintFooter />
            </div>
          </>
        )}
      </main>

      {/* Corporate PDF Footer */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-top-row">
            <div className="footer-left">
              <IgenTechLogo />
              <div className="footer-address-block">
                <div className="address-item">
                  <strong>🏢 Đơn vị chủ quản:</strong> CÔNG TY CỔ PHẦN CÔNG NGHỆ IGEN
                </div>
                <div className="address-item">
                  <strong>📍 Địa chỉ:</strong> Lô LK3 LK4 Đường Lạc Long Quân, Phường Kinh Bắc, Thành phố Bắc Ninh, Tỉnh Bắc Ninh, Việt Nam
                </div>
                <div className="address-item">
                  <strong>📝 MST/GPKD:</strong> 2301355232 (Cấp bởi Sở KH&ĐT Tỉnh Bắc Ninh)
                </div>
              </div>
            </div>
            <div className="footer-right">
              <IgenErpLogo />
              <div style={{ height: "20px", width: "1px", backgroundColor: "#ccc" }}></div>
              <IgenHrmLogo />
              <div style={{ height: "20px", width: "1px", backgroundColor: "#ccc" }}></div>
              <IgenCrmLogo />
              <div style={{ height: "20px", width: "1px", backgroundColor: "#ccc" }}></div>
              <IgenFinLogo />
              <div style={{ height: "20px", width: "1px", backgroundColor: "#ccc" }}></div>
              <IgenWmsLogo />
            </div>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-bottom">
            Bản quyền thuộc về Công ty Cổ phần Công nghệ iGen (iGen Tech) &copy; {new Date().getFullYear()}. Bảo lưu mọi quyền.
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
              <div
                className={`alert-message ${
                  authError.includes("thành công") ? "success-message" : "error-message"
                }`}
              >
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="admin-form">
              {authMode === "register" && (
                <div className="form-group">
                  <label>Tên hiển thị</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nguyễn Văn A"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
              )}
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@igen-erp.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-submit" disabled={authLoading}>
                {authLoading ? "Đang xử lý..." : authMode === "login" ? "Đăng Nhập" : "Đăng Ký"}
              </button>
            </form>

            <div className="modal-footer-toggle">
              {authMode === "login" ? (
                <>
                  Chưa có tài khoản?{" "}
                  <span onClick={() => { setAuthMode("register"); setAuthError(""); }}>Đăng ký ngay</span>
                </>
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
