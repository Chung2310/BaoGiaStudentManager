import React, { useEffect, useState } from "react";
import { api } from "../services/api";

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

interface PackageGroup {
  name: string;
  count: number;
}

export const PricingTable: React.FC = () => {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pricingData, packageData] = await Promise.all([
        api.getPricing(),
        api.getAllPackages(),
      ]);
      setItems(pricingData);
      setPackages(packageData);
    } catch (err: any) {
      setError(err.message || "Không thể tải dữ liệu bảng giá.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatPrice = (val: number) => {
    return val.toString().padStart(2, "0");
  };

  const getGroupHeaderClass = (groupName: string) => {
    const normalized = groupName.toLowerCase();
    if (normalized === "basic") return "col-basic-header";
    if (normalized === "plus") return "col-plus-header";
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

  const getGroupSubHeaderStyle = (groupName: string) => {
    const normalized = groupName.toLowerCase();
    if (normalized === "basic" || normalized === "plus") return {};
    const colorMap: Record<string, string> = {
      premium: "#1e68b3",
      enterprise: "#17528e",
      pro: "#2a7bcb",
    };
    const bg = colorMap[normalized] || "#256eb8";
    return { backgroundColor: bg };
  };

  const getPriceCellClass = (groupName: string) => {
    const normalized = groupName.toLowerCase();
    if (normalized === "basic") return "price-cell font-bold text-center";
    if (normalized === "plus") return "price-cell font-bold text-center text-plus";
    return "price-cell font-bold text-center";
  };

  const getPriceCellStyle = (groupName: string) => {
    const normalized = groupName.toLowerCase();
    if (normalized === "basic" || normalized === "plus") return {};
    const colorMap: Record<string, string> = {
      premium: "#0e4a85",
      enterprise: "#0a3661",
      pro: "#1d5fa3",
    };
    const color = colorMap[normalized] || "#154f8a";
    return { color };
  };

  if (loading) return <div className="loading-state">Đang tải bảng giá...</div>;
  if (error) return <div className="error-state">{error}</div>;

  // Group consecutive packages by group name to compute colSpan
  const groups: PackageGroup[] = [];
  packages.forEach((pkg) => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.name === pkg.group) {
      lastGroup.count += 1;
    } else {
      groups.push({ name: pkg.group, count: 1 });
    }
  });

  return (
    <div className="table-container fade-in">
      <div className="pdf-page-header">
        <h1 className="page-title">CHÍNH SÁCH GIÁ iGEN ERP</h1>
        <p className="page-subtitle">(Áp dụng từ 01/08/2025)</p>
      </div>

      <div className="pricing-table-wrapper">
        <table className="pdf-style-table pricing-table">
          <thead>
            <tr>
              <th rowSpan={2} className="col-student-range">
                Quy mô<br />(Học viên / User)
              </th>
              {groups.map((group, idx) => (
                <th
                  key={idx}
                  colSpan={group.count}
                  className={getGroupHeaderClass(group.name)}
                  style={getGroupHeaderStyle(group.name)}
                >
                  {group.name}<br />
                  <span className="unit-text">(triệu VNĐ)</span>
                </th>
              ))}
            </tr>
            <tr>
              {packages.map((pkg) => (
                <th
                  key={pkg._id}
                  className="sub-th"
                  style={getGroupSubHeaderStyle(pkg.group)}
                >
                  {pkg.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td className="range-cell font-bold">{item.studentRange}</td>
                {packages.map((pkg) => {
                  const price = item.prices ? item.prices[pkg.key] : undefined;
                  return (
                    <td
                      key={pkg._id}
                      className={getPriceCellClass(pkg.group)}
                      style={getPriceCellStyle(pkg.group)}
                    >
                      {price !== undefined ? formatPrice(price) : "-"}
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
