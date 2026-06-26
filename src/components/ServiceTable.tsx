import React, { useEffect, useState } from "react";
import { api } from "../services/api";

interface PackageItem {
  _id: string;
  key: string;
  name: string;
  group: string;
  order: number;
}

interface ServiceItem {
  _id: string;
  serviceName: string;
  contents: Record<string, string[]>;
  order: number;
}

export const ServiceTable: React.FC<{ projectId?: string }> = ({ projectId }) => {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [serviceData, packageData] = await Promise.all([
        api.getServices(undefined, projectId),
        api.getAllPackages(projectId),
      ]);
      setItems(serviceData);
      setPackages(packageData);
    } catch (err: any) {
      setError(err.message || "Không thể tải dữ liệu dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  if (loading) return <div className="loading-state">Đang tải bảng dịch vụ...</div>;
  if (error) return <div className="error-state">{error}</div>;

  // Get unique groups in order of packages
  const uniqueGroups = Array.from(new Set(packages.map((p) => p.group)));

  // Dynamic column widths
  const NAME_COL_PCT = 22;
  const contentColPct = Math.floor((100 - NAME_COL_PCT) / Math.max(uniqueGroups.length, 1));
  const isCompact = uniqueGroups.length >= 3;

  const nameColStyle: React.CSSProperties = { width: `${NAME_COL_PCT}%` };
  const contentColStyle: React.CSSProperties = { width: `${contentColPct}%` };
  const cellStyle: React.CSSProperties = isCompact
    ? { fontSize: "11px", padding: "8px 8px" }
    : { fontSize: "13px", padding: "10px 12px" };
  const nameCellStyle: React.CSSProperties = isCompact
    ? { fontSize: "13px" }
    : {};

  const getGroupHeaderStyle = (groupName: string): React.CSSProperties => {
    const normalized = groupName.toLowerCase();
    const colorMap: Record<string, string> = {
      basic: "#1a5694",
      plus: "#144373",
      premium: "#0e4a85",
      enterprise: "#0a3661",
      pro: "#1d5fa3",
    };
    const bg = colorMap[normalized] || "#154f8a";
    return { backgroundColor: bg, ...contentColStyle };
  };

  const renderContent = (content?: string[]) => {
    if (!content || content.length === 0) return <span className="no-integration">-</span>;
    if (content.length === 1 && !content[0].startsWith("•") && content[0].includes("nhân sự")) {
      return <div className="text-center single-text" style={cellStyle}>{content[0]}</div>;
    }
    return (
      <ul className="bullet-list">
        {content.map((bullet, idx) => {
          if (!bullet.trim()) return null;
          return <li key={idx}>{bullet}</li>;
        })}
      </ul>
    );
  };

  return (
    <div className="table-container fade-in">
      <div className="services-table-wrapper">
        <table className="pdf-style-table services-table">
          <colgroup>
            <col style={nameColStyle} />
            {uniqueGroups.map((group) => (
              <col key={group} style={contentColStyle} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th colSpan={uniqueGroups.length + 1} className="main-section-header">
                DỊCH VỤ KHÁCH HÀNG
              </th>
            </tr>
            <tr>
              <th className="col-srv-name" style={nameColStyle}>Dịch vụ</th>
              {uniqueGroups.map((group) => (
                <th
                  key={group}
                  className={
                    group.toLowerCase() === "basic"
                      ? "col-srv-basic"
                      : group.toLowerCase() === "plus"
                      ? "col-srv-plus"
                      : ""
                  }
                  style={getGroupHeaderStyle(group)}
                >
                  {group}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td className="srv-name-cell font-bold text-center" style={nameCellStyle}>
                  {item.serviceName}
                </td>
                {uniqueGroups.map((group) => (
                  <td className="srv-content-cell" key={group} style={cellStyle}>
                    {renderContent(item.contents ? item.contents[group] : undefined)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
