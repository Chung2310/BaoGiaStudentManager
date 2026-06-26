import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "iGen ERP Price Quotation API",
    version: "1.0.0",
    description: "Tài liệu API cho Hệ thống Báo giá và So sánh Tính năng iGen ERP (MongoDB)",
  },
  servers: [
    {
      url: "/api/v1",
      description: "Local API v1 Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Nhập Access Token được cấp sau khi đăng nhập thành công",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          uid: { type: "string" },
          email: { type: "string" },
          displayName: { type: "string" },
        },
      },
      Pricing: {
        type: "object",
        properties: {
          id: { type: "string" },
          studentRange: { type: "string", example: "0 - 100" },
          prices: {
            type: "object",
            additionalProperties: { type: "number" },
            example: { basic6Month: 3, basic12Month: 5, plusFirstYear: 8, plusNextYears: 6 },
          },
          order: { type: "number", example: 1 },
        },
      },
      Package: {
        type: "object",
        properties: {
          id: { type: "string" },
          key: { type: "string", example: "basic6Month" },
          name: { type: "string", example: "Gói 06 Tháng" },
          group: { type: "string", example: "Basic" },
          order: { type: "number", example: 1 },
        },
      },
      Feature: {
        type: "object",
        properties: {
          id: { type: "string" },
          category: { type: "string", example: "Đào tạo" },
          contents: {
            type: "object",
            additionalProperties: {
              type: "array",
              items: { type: "string" },
            },
            example: {
              Basic: ["Quản lý chương trình học...", "App giáo viên"],
              Plus: ["Full tính năng", "App giáo viên"],
            },
          },
          order: { type: "number", example: 1 },
        },
      },
      Service: {
        type: "object",
        properties: {
          id: { type: "string" },
          serviceName: { type: "string", example: "Số lần đào tạo tại trung tâm" },
          contents: {
            type: "object",
            additionalProperties: {
              type: "array",
              items: { type: "string" },
            },
            example: {
              Basic: ["Hỗ trợ đào tạo trực tiếp 01 lần/năm"],
              Plus: ["Hỗ trợ đào tạo trực tiếp 02 lần"],
            },
          },
          order: { type: "number", example: 1 },
        },
      },
      Setting: {
        type: "object",
        properties: {
          id: { type: "string" },
          key: { type: "string", example: "phone" },
          value: { type: "string", example: "0968 688 888" },
          description: { type: "string", example: "Số điện thoại hiển thị ở Footer" },
        },
      },
    },
  },
  paths: {
    "/auth/register": {
      post: {
        summary: "Đăng ký tài khoản quản trị mới",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "displayName"],
                properties: {
                  email: { type: "string", example: "admin@igen-erp.com" },
                  password: { type: "string", example: "AdminPass123" },
                  displayName: { type: "string", example: "Admin Báo Giá" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Đăng ký thành công" },
          400: { description: "Dữ liệu không hợp lệ hoặc email đã tồn tại" },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Đăng nhập hệ thống",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "admin@igen-erp.com" },
                  password: { type: "string", example: "AdminPass123" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Đăng nhập thành công, Refresh Token trả về qua cookie httpOnly" },
          400: { description: "Email hoặc mật khẩu sai" },
        },
      },
    },
    "/auth/refresh-token": {
      post: {
        summary: "Lấy Access Token mới bằng Refresh Token lưu tại cookie",
        tags: ["Auth"],
        responses: {
          200: { description: "Cấp mới Access Token thành công" },
          401: { description: "Refresh Token đã hết hạn hoặc không hợp lệ" },
        },
      },
    },
    "/auth/logout": {
      post: {
        summary: "Đăng xuất khỏi hệ thống",
        tags: ["Auth"],
        responses: {
          200: { description: "Đăng xuất thành công" },
        },
      },
    },
    "/auth/me": {
      get: {
        summary: "Lấy thông tin tài khoản hiện tại",
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Lấy thông tin thành công" },
          401: { description: "Chưa đăng nhập" },
        },
      },
    },
    "/packages": {
      get: {
        summary: "Lấy danh sách gói cước (Phân trang & Tìm kiếm)",
        tags: ["Packages"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "search", in: "query", schema: { type: "string" }, description: "Tìm kiếm theo tên hoặc nhóm gói cước" },
        ],
        responses: {
          200: { description: "Lấy danh sách thành công" },
        },
      },
      post: {
        summary: "Tạo gói cước mới (Admin)",
        tags: ["Packages"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Package" },
            },
          },
        },
        responses: {
          201: { description: "Tạo thành công" },
          401: { description: "Chưa đăng nhập" },
        },
      },
    },
    "/packages/all": {
      get: {
        summary: "Lấy toàn bộ danh sách gói cước hoạt động không phân trang",
        tags: ["Packages"],
        responses: {
          200: { description: "Lấy danh sách thành công" },
        },
      },
    },
    "/packages/{id}": {
      get: {
        summary: "Lấy chi tiết gói cước",
        tags: ["Packages"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Thành công" },
          404: { description: "Không tìm thấy" },
        },
      },
      patch: {
        summary: "Cập nhật gói cước (Admin)",
        tags: ["Packages"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
            },
          },
        },
        responses: {
          200: { description: "Cập nhật thành công" },
          401: { description: "Chưa đăng nhập" },
          404: { description: "Không tìm thấy" },
        },
      },
      delete: {
        summary: "Xóa gói cước và tự động dọn dẹp giá trị tương ứng trong bảng giá (Admin)",
        tags: ["Packages"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Xóa thành công" },
          401: { description: "Chưa đăng nhập" },
          404: { description: "Không tìm thấy" },
        },
      },
    },
    "/pricing": {
      get: {
        summary: "Lấy danh sách cấu hình giá học viên (Phân trang & Tìm kiếm)",
        tags: ["Pricing"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "search", in: "query", schema: { type: "string" }, description: "Tìm kiếm theo khoảng số học viên" },
        ],
        responses: {
          200: { description: "Lấy danh sách thành công" },
        },
      },
      post: {
        summary: "Tạo cấu hình giá mới (Admin)",
        tags: ["Pricing"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Pricing" },
            },
          },
        },
        responses: {
          201: { description: "Tạo thành công" },
          401: { description: "Chưa đăng nhập" },
        },
      },
    },
    "/pricing/{id}": {
      get: {
        summary: "Lấy chi tiết cấu hình giá",
        tags: ["Pricing"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Thành công" },
          404: { description: "Không tìm thấy" },
        },
      },
      patch: {
        summary: "Cập nhật cấu hình giá (Admin)",
        tags: ["Pricing"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
            },
          },
        },
        responses: {
          200: { description: "Cập nhật thành công" },
          401: { description: "Chưa đăng nhập" },
          404: { description: "Không tìm thấy" },
        },
      },
      delete: {
        summary: "Xóa cấu hình giá (Admin)",
        tags: ["Pricing"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Xóa thành công" },
          401: { description: "Chưa đăng nhập" },
          404: { description: "Không tìm thấy" },
        },
      },
    },
    "/features": {
      get: {
        summary: "Lấy danh sách tính năng so sánh (Phân trang & Tìm kiếm)",
        tags: ["Features"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "search", in: "query", schema: { type: "string" }, description: "Tìm kiếm theo danh mục" },
        ],
        responses: {
          200: { description: "Lấy danh sách thành công" },
        },
      },
      post: {
        summary: "Tạo so sánh tính năng mới (Admin)",
        tags: ["Features"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Feature" },
            },
          },
        },
        responses: {
          201: { description: "Tạo thành công" },
          401: { description: "Chưa đăng nhập" },
        },
      },
    },
    "/features/{id}": {
      get: {
        summary: "Lấy chi tiết tính năng so sánh",
        tags: ["Features"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Thành công" },
          404: { description: "Không tìm thấy" },
        },
      },
      patch: {
        summary: "Cập nhật tính năng so sánh (Admin)",
        tags: ["Features"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
            },
          },
        },
        responses: {
          200: { description: "Cập nhật thành công" },
          401: { description: "Chưa đăng nhập" },
          404: { description: "Không tìm thấy" },
        },
      },
      delete: {
        summary: "Xóa tính năng so sánh (Admin)",
        tags: ["Features"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Xóa thành công" },
          401: { description: "Chưa đăng nhập" },
          404: { description: "Không tìm thấy" },
        },
      },
    },
    "/services": {
      get: {
        summary: "Lấy danh sách dịch vụ chăm sóc khách hàng (Phân trang & Tìm kiếm)",
        tags: ["Services"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "search", in: "query", schema: { type: "string" }, description: "Tìm kiếm theo tên dịch vụ" },
        ],
        responses: {
          200: { description: "Lấy danh sách thành công" },
        },
      },
      post: {
        summary: "Tạo dịch vụ mới (Admin)",
        tags: ["Services"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Service" },
            },
          },
        },
        responses: {
          201: { description: "Tạo thành công" },
          401: { description: "Chưa đăng nhập" },
        },
      },
    },
    "/services/{id}": {
      get: {
        summary: "Lấy chi tiết dịch vụ chăm sóc khách hàng",
        tags: ["Services"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Thành công" },
          404: { description: "Không tìm thấy" },
        },
      },
      patch: {
        summary: "Cập nhật dịch vụ (Admin)",
        tags: ["Services"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
            },
          },
        },
        responses: {
          200: { description: "Cập nhật thành công" },
          401: { description: "Chưa đăng nhập" },
          404: { description: "Không tìm thấy" },
        },
      },
      delete: {
        summary: "Xóa dịch vụ (Admin)",
        tags: ["Services"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Xóa thành công" },
          401: { description: "Chưa đăng nhập" },
          404: { description: "Không tìm thấy" },
        },
      },
    },
    "/health": {
      get: {
        summary: "Health Check cho Server & DB",
        tags: ["Health Check"],
        responses: {
          200: { description: "Hệ thống hoạt động bình thường, DB kết nối tốt" },
          500: { description: "Mất kết nối Cơ sở dữ liệu" },
        },
      },
    },
    "/settings": {
      get: {
        summary: "Lấy danh sách cấu hình hệ thống (Phân trang & Tìm kiếm)",
        tags: ["Settings"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "search", in: "query", schema: { type: "string" }, description: "Tìm kiếm theo key hoặc mô tả" },
        ],
        responses: {
          200: { description: "Lấy danh sách thành công" },
        },
      },
      post: {
        summary: "Tạo cấu hình mới (Admin)",
        tags: ["Settings"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Setting" },
            },
          },
        },
        responses: {
          201: { description: "Tạo thành công" },
          400: { description: "Khóa cấu hình đã tồn tại hoặc dữ liệu không hợp lệ" },
          401: { description: "Chưa đăng nhập" },
        },
      },
    },
    "/settings/key/{key}": {
      get: {
        summary: "Lấy cấu hình chi tiết theo khóa (key)",
        tags: ["Settings"],
        parameters: [{ name: "key", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Thành công" },
          404: { description: "Không tìm thấy cấu hình với khóa này" },
        },
      },
    },
    "/settings/{id}": {
      get: {
        summary: "Lấy cấu hình chi tiết theo ID",
        tags: ["Settings"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Thành công" },
          404: { description: "Không tìm thấy" },
        },
      },
      patch: {
        summary: "Cập nhật cấu hình (Admin)",
        tags: ["Settings"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
            },
          },
        },
        responses: {
          200: { description: "Cập nhật thành công" },
          401: { description: "Chưa đăng nhập" },
          404: { description: "Không tìm thấy" },
        },
      },
      delete: {
        summary: "Xóa cấu hình (Admin)",
        tags: ["Settings"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Xóa thành công" },
          401: { description: "Chưa đăng nhập" },
          404: { description: "Không tìm thấy" },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
