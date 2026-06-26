import React from "react";

export const IgenErpLogo: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {
  const height = style?.height || "40px";
  const numericHeight = typeof height === "number" ? height : parseInt(String(height));
  const imgSize = isNaN(numericHeight) ? 40 : numericHeight;
  const titleSize = `${Math.round(imgSize * 0.55)}px`;
  const subSize = `${Math.round(imgSize * 0.4)}px`;

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        fontFamily: "'Outfit', 'Inter', sans-serif",
        ...style,
      }}
    >
      <img
        src="https://res.cloudinary.com/dgaofuhmv/image/upload/v1775301001/unnamed_tcmlmp.png"
        alt="iGen ERP Logo"
        style={{
          height: `${imgSize}px`,
          width: `${imgSize}px`,
          borderRadius: `${Math.round(imgSize * 0.25)}px`,
          objectFit: "cover",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.0", textAlign: "left" }}>
        <span style={{ fontSize: titleSize, fontWeight: "900", color: "#1D5FA3", letterSpacing: "0.5px" }}>iGen</span>
        <span style={{ fontSize: subSize, fontWeight: "800", color: "#00aeca", letterSpacing: "0.5px" }}>Technology</span>
      </div>
    </div>
  );
};

export const CenterOnlineLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 340 70"
    className={className}
    style={{ height: "45px", width: "auto" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="10"
      y="30"
      fontFamily="'Outfit', 'Inter', sans-serif"
      fontSize="30"
      fontWeight="800"
      fill="#1D5FA3"
      letterSpacing="1"
    >
      CENTER
    </text>
    <text
      x="10"
      y="58"
      fontFamily="'Outfit', 'Inter', sans-serif"
      fontSize="30"
      fontWeight="800"
      fill="#1D5FA3"
      letterSpacing="1"
    >
      ONLINE
    </text>
    <circle cx="120" cy="18" r="4" fill="#00D2FF" />
    <path d="M110 50 Q120 40 130 50" stroke="#00D2FF" strokeWidth="3" fill="none" />
  </svg>
);

export const OmtLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 200 80"
    className={className}
    style={{ height: "48px", width: "auto" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="50" r="8" fill="#00B4D8" />
    <circle cx="35" cy="30" r="6" fill="#0077B6" />
    <circle cx="50" cy="45" r="5" fill="#0096C7" />
    <circle cx="30" cy="60" r="4" fill="#48CAE4" />
    <text
      x="65"
      y="62"
      fontFamily="'Outfit', 'Inter', sans-serif"
      fontSize="42"
      fontWeight="900"
      fill="#03045E"
      letterSpacing="1"
    >
      OMT
    </text>
  </svg>
);

export const KidsOnlineLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 160 50"
    className={className}
    style={{ height: "24px", width: "auto" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="10" width="30" height="30" rx="6" fill="#FF7043" />
    <text x="10" y="32" fontFamily="'Inter', sans-serif" fontSize="20" fontWeight="bold" fill="white">K</text>
    <text
      x="40"
      y="28"
      fontFamily="'Outfit', 'Inter', sans-serif"
      fontSize="16"
      fontWeight="800"
      fill="#37474F"
    >
      kids
    </text>
    <text
      x="40"
      y="43"
      fontFamily="'Outfit', 'Inter', sans-serif"
      fontSize="16"
      fontWeight="800"
      fill="#FF7043"
    >
      online
    </text>
  </svg>
);

export const SchoolOnlineLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 160 50"
    className={className}
    style={{ height: "24px", width: "auto" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 25 L20 15 L35 25 L20 35 Z" fill="#1D5FA3" />
    <path d="M12 28 L12 36 Q20 40 28 36 L28 28" fill="none" stroke="#1D5FA3" strokeWidth="2.5" />
    <path d="M30 25 L30 38" stroke="#1D5FA3" strokeWidth="2" />
    <circle cx="30" cy="38" r="2.5" fill="#1D5FA3" />
    <text
      x="42"
      y="28"
      fontFamily="'Outfit', 'Inter', sans-serif"
      fontSize="16"
      fontWeight="800"
      fill="#1D5FA3"
    >
      School
    </text>
    <text
      x="42"
      y="43"
      fontFamily="'Outfit', 'Inter', sans-serif"
      fontSize="16"
      fontWeight="500"
      fill="#37474F"
    >
      Online
    </text>
  </svg>
);

export const ELearnLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 140 50"
    className={className}
    style={{ height: "24px", width: "auto" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="5" y="10" width="28" height="30" rx="5" fill="#0077B6" />
    <text x="12" y="32" fontFamily="'Inter', sans-serif" fontSize="22" fontWeight="900" fill="white">E</text>
    <text
      x="40"
      y="35"
      fontFamily="'Outfit', 'Inter', sans-serif"
      fontSize="22"
      fontWeight="900"
      fill="#0077B6"
      letterSpacing="0.5"
    >
      Learn
    </text>
  </svg>
);

export const IgenTechLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 300 60"
    className={className}
    style={{ height: "40px", width: "auto" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Stylized Node icon representing iGen Tech */}
    <g transform="translate(5, 10)">
      <circle cx="20" cy="20" r="14" fill="none" stroke="#1D5FA3" strokeWidth="3" />
      <circle cx="20" cy="20" r="6" fill="#00D2FF" />
    </g>
    <text
      x="48"
      y="38"
      fontFamily="'Outfit', 'Inter', sans-serif"
      fontSize="24"
      fontWeight="900"
      fill="#1D5FA3"
      letterSpacing="0.5"
    >
      iGen Technology
    </text>
  </svg>
);

export const IgenHrmLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 40" className={className} style={{ height: "24px", width: "auto" }} xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" y="5" rx="6" fill="#4CAF50" />
    <circle cx="15" cy="16" r="5" fill="white" />
    <path d="M7 27 C7 21, 23 21, 23 27" fill="white" />
    <text x="38" y="26" fontFamily="'Outfit', sans-serif" fontSize="16" fontWeight="bold" fill="#37474F">iGen</text>
    <text x="75" y="26" fontFamily="'Outfit', sans-serif" fontSize="16" fontWeight="bold" fill="#4CAF50">HRM</text>
  </svg>
);

export const IgenCrmLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 40" className={className} style={{ height: "24px", width: "auto" }} xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" y="5" rx="6" fill="#FF9800" />
    <path d="M15 11 C12 8, 8 11, 15 18 C22 11, 18 8, 15 11 Z" fill="white" />
    <text x="38" y="26" fontFamily="'Outfit', sans-serif" fontSize="16" fontWeight="bold" fill="#37474F">iGen</text>
    <text x="75" y="26" fontFamily="'Outfit', sans-serif" fontSize="16" fontWeight="bold" fill="#FF9800">CRM</text>
  </svg>
);

export const IgenFinLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 40" className={className} style={{ height: "24px", width: "auto" }} xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" y="5" rx="6" fill="#00B4D8" />
    <text x="10" y="26" fontFamily="'Inter', sans-serif" fontSize="20" fontWeight="900" fill="white">$</text>
    <text x="38" y="26" fontFamily="'Outfit', sans-serif" fontSize="16" fontWeight="bold" fill="#37474F">iGen</text>
    <text x="75" y="26" fontFamily="'Outfit', sans-serif" fontSize="16" fontWeight="bold" fill="#00B4D8">FIN</text>
  </svg>
);

export const IgenWmsLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 40" className={className} style={{ height: "24px", width: "auto" }} xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" y="5" rx="6" fill="#673AB7" />
    <path d="M8 12 L15 8 L22 12 L22 22 L15 26 L8 22 Z M15 8 L15 26 M8 12 L22 12" stroke="white" strokeWidth="1.5" fill="none" />
    <text x="38" y="26" fontFamily="'Outfit', sans-serif" fontSize="16" fontWeight="bold" fill="#37474F">iGen</text>
    <text x="75" y="26" fontFamily="'Outfit', sans-serif" fontSize="16" fontWeight="bold" fill="#673AB7">WMS</text>
  </svg>
);

