import React, { useEffect, useState } from "react";
import { api } from "../services/api";

interface FeatureItem {
  _id: string;
  category: string;
  basicContent: string[];
  plusContent: string[];
}

export const FeatureTable: React.FC = () => {
  const [items, setItems] = useState<FeatureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.getFeatures();
      setItems(data);
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

  return (
    <div className="table-container fade-in">
      <div className="features-table-wrapper">
        <table className="pdf-style-table features-table">
          <thead>
            <tr>
              <th colSpan={3} className="main-section-header">TÍNH NĂNG</th>
            </tr>
            <tr>
              <th className="col-feat-name">Tính năng</th>
              <th className="col-feat-basic">Phiên bản Basic</th>
              <th className="col-feat-plus">Phiên bản Plus</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td className="feat-cat-cell font-bold text-center">{item.category}</td>
                <td className="feat-content-cell">
                  {item.basicContent.length === 1 && item.basicContent[0] === "Không tích hợp" ? (
                    <span className="no-integration">{item.basicContent[0]}</span>
                  ) : (
                    <ul className="bullet-list">
                      {item.basicContent.map((bullet, idx) => {
                        if (!bullet.trim()) return null;
                        return <li key={idx}>{bullet}</li>;
                      })}
                    </ul>
                  )}
                </td>
                <td className="feat-content-cell">
                  <ul className="bullet-list">
                    {item.plusContent.map((bullet, idx) => {
                      if (!bullet.trim()) return null;
                      // Highlight special footnotes like *Không bao gồm...
                      const isFootnote = bullet.startsWith("*");
                      return (
                        <li key={idx} className={isFootnote ? "footnote-item" : ""}>
                          {isFootnote ? <em>{bullet}</em> : bullet}
                        </li>
                      );
                    })}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
