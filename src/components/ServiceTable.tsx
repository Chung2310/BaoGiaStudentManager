import React, { useEffect, useState } from "react";
import { api } from "../services/api";

interface ServiceItem {
  _id: string;
  serviceName: string;
  basicContent: string[];
  plusContent: string[];
}

export const ServiceTable: React.FC = () => {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.getServices();
      setItems(data);
    } catch (err: any) {
      setError(err.message || "Không thể tải dữ liệu dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderContent = (content: string[]) => {
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

  return (
    <div className="table-container fade-in">
      <div className="services-table-wrapper">
        <table className="pdf-style-table services-table">
          <thead>
            <tr>
              <th colSpan={3} className="main-section-header">DỊCH VỤ KHÁCH HÀNG</th>
            </tr>
            <tr>
              <th className="col-srv-name">Dịch vụ</th>
              <th className="col-srv-basic">Basic</th>
              <th className="col-srv-plus">Plus</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td className="srv-name-cell font-bold text-center">{item.serviceName}</td>
                <td className="srv-content-cell">{renderContent(item.basicContent)}</td>
                <td className="srv-content-cell">{renderContent(item.plusContent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
