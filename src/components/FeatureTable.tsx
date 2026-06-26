import React, { useEffect, useState } from "react";
import { api } from "../services/api";

interface PackageItem {
  _id: string;
  key: string;
  name: string;
  group: string;
  order: number;
}

interface FeatureItem {
  _id: string;
  category: string;
  contents: Record<string, string[]>;
  order: number;
}

export const FeatureTable: React.FC = () => {
  const [items, setItems] = useState<FeatureItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [featureData, packageData] = await Promise.all([
        api.getFeatures(),
        api.getAllPackages(),
      ]);
      setItems(featureData);
      setPackages(packageData);
    } catch (err: any) {
      setError(err.message || "Không thể tải dữ liệu tính năng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="loading-state">Đang tải bảng tính năng...</div>;
  if (error) return <div className="error-state">{error}</div>;

  // Get unique groups in order of packages
  const uniqueGroups = Array.from(new Set(packages.map((p) => p.group)));

  const getGroupHeaderClass = (groupName: string) => {
    const normalized = groupName.toLowerCase();
    if (normalized === "basic") return "col-feat-basic";
    if (normalized === "plus") return "col-feat-plus";
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
      <div className="features-table-wrapper">
        <table className="pdf-style-table features-table">
          <thead>
            <tr>
              <th colSpan={uniqueGroups.length + 1} className="main-section-header">
                TÍNH NĂNG
              </th>
            </tr>
            <tr>
              <th className="col-feat-name">Tính năng</th>
              {uniqueGroups.map((group) => (
                <th
                  key={group}
                  className={getGroupHeaderClass(group)}
                  style={getGroupHeaderStyle(group)}
                >
                  Phiên bản {group}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td className="feat-cat-cell font-bold text-center">{item.category}</td>
                {uniqueGroups.map((group) => {
                  const bulletPoints = item.contents ? item.contents[group] : undefined;
                  const isNoIntegration =
                    !bulletPoints ||
                    bulletPoints.length === 0 ||
                    (bulletPoints.length === 1 && bulletPoints[0] === "Không tích hợp");

                  return (
                    <td className="feat-content-cell" key={group}>
                      {isNoIntegration ? (
                        <span className="no-integration">
                          {bulletPoints && bulletPoints.length === 1 ? bulletPoints[0] : "Không tích hợp"}
                        </span>
                      ) : (
                        <ul className="bullet-list">
                          {bulletPoints?.map((bullet, idx) => {
                            if (!bullet.trim()) return null;
                            const isFootnote = bullet.startsWith("*");
                            return (
                              <li key={idx} className={isFootnote ? "footnote-item" : ""}>
                                {isFootnote ? <em>{bullet}</em> : bullet}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
