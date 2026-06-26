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

export const ServiceTable: React.FC = () => {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [serviceData, packageData] = await Promise.all([
        api.getServices(),
        api.getAllPackages(),
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
  }, []);

  const renderContent = (content?: string[]) => {
    if (!content || content.length === 0) return "-";
    if (content.length === 1 && !content[0].startsWith("•") && content[0].includes("nhân sự")) {
      return <div className="text-center single-text">{content[0]}</div>;
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

  if (loading) return <div className="loading-state">Đang tải bảng dịch vụ...</div>;
  if (error) return <div className="error-state">{error}</div>;

  // Get unique groups in order of packages
  const uniqueGroups = Array.from(new Set(packages.map((p) => p.group)));

  const getGroupHeaderClass = (groupName: string) => {
    const normalized = groupName.toLowerCase();
    if (normalized === "basic") return "col-srv-basic";
    if (normalized === "plus") return "col-srv-plus";
    return "";
  };

  const getGroupHeaderStyle = (groupName: string) => {
    const normalized = groupName.toLowerCase();
    if (normalized === "basic" || normalized === "plus") return {};
    const colorMap: Record<string, string> = {
      premium: "#0e4a85",
      enterprise: "#0a3661",
      pro: "#1d5fa3",
    };
    const bg = colorMap[normalized] || "#154f8a";
    return { backgroundColor: bg };
  };

  return (
    <div className="table-container fade-in">
      <div className="services-table-wrapper">
        <table className="pdf-style-table services-table">
          <thead>
            <tr>
              <th colSpan={uniqueGroups.length + 1} className="main-section-header">
                DỊCH VỤ KHÁCH HÀNG
              </th>
            </tr>
            <tr>
              <th className="col-srv-name">Dịch vụ</th>
              {uniqueGroups.map((group) => (
                <th
                  key={group}
                  className={getGroupHeaderClass(group)}
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
                <td className="srv-name-cell font-bold text-center">{item.serviceName}</td>
                {uniqueGroups.map((group) => (
                  <td className="srv-content-cell" key={group}>
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
