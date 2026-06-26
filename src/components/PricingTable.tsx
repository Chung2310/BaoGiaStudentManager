import React, { useEffect, useState } from "react";
import { api } from "../services/api";

interface PricingItem {
  _id: string;
  studentRange: string;
  basic6Month: number;
  basic12Month: number;
  plusFirstYear: number;
  plusNextYears: number;
}

export const PricingTable: React.FC = () => {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.getPricing();
      setItems(data);
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

  if (loading) return <div className="loading-state">Đang tải bảng giá...</div>;
  if (error) return <div className="error-state">{error}</div>;

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
              <th rowSpan={2} className="col-student-range">Quy mô<br />(Học viên / User)</th>
              <th colSpan={2} className="col-basic-header">
                Basic<br />
                <span className="unit-text">(triệu VNĐ)</span>
              </th>
              <th colSpan={2} className="col-plus-header">
                Plus<br />
                <span className="unit-text">(triệu VNĐ)</span>
              </th>
            </tr>
            <tr>
              <th className="sub-th col-basic-pkg">Gói 06 Tháng</th>
              <th className="sub-th col-basic-pkg">Gói 12 Tháng</th>
              <th className="sub-th col-plus-pkg">Phí hệ thống<br />năm đầu tiên</th>
              <th className="sub-th col-plus-pkg">Phí hệ thống<br />các năm tiếp theo</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td className="range-cell font-bold">{item.studentRange}</td>
                <td className="price-cell font-bold text-center">{formatPrice(item.basic6Month)}</td>
                <td className="price-cell font-bold text-center">{formatPrice(item.basic12Month)}</td>
                <td className="price-cell font-bold text-center text-plus">{formatPrice(item.plusFirstYear)}</td>
                <td className="price-cell font-bold text-center text-plus">{formatPrice(item.plusNextYears)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
