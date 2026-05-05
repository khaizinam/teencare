# TeenUp Product Builder - Mini LMS

Dự án Mini LMS (Learning Management System) được xây dựng với Next.js 15, PostgreSQL, và Prisma ORM.

---

## 1. Cách Build và Chạy Dự Án (Build & Run)

Dự án được thiết lập sẵn với Docker để dễ dàng triển khai.

### Sử dụng Docker (Môi trường Dev - Tự động 100%)
Yêu cầu: Đã cài đặt Docker và Docker Compose.
1. Mở terminal tại thư mục gốc của dự án.
2. Chạy lệnh sau để khởi động Database và Container Web (chạy ngầm):
   ```bash
   docker compose up -d
   ```
   *(Docker sẽ tự động cài đặt thư viện, đồng bộ Database và bật server Next.js).*
3. Nếu muốn xem log (để theo dõi quá trình cài đặt / debug):
   ```bash
   docker compose logs -f web
   ```
4. Truy cập ứng dụng tại trình duyệt: [http://localhost:3000](http://localhost:3000)

*(Lưu ý: Dữ liệu database được lưu trữ tại thư mục `./docker/db` thông qua bind mount).*

### Chạy Local (Không dùng Docker)
1. Cài đặt dependencies:
   ```bash
   yarn install
   ```
2. Khởi tạo Prisma Client (kết nối với Database Postgres có sẵn):
   ```bash
   npx prisma generate
   ```
3. Chạy server phát triển:
   ```bash
   yarn dev
   ```

---

## 2. Các Hoạt Động / Chức Năng Chính (Operations)

- **Quản lý Phụ Huynh & Học Sinh**: Cho phép tạo mới hồ sơ phụ huynh và liên kết hồ sơ học sinh (với các thông tin như ngày sinh, giới tính, khối lớp).
- **Lên Lịch & Quản Lý Lớp Học**: Tạo lớp học với khung giờ, giáo viên và giới hạn sĩ số. Hiển thị lịch học theo tuần.
- **Đăng Ký Học**: Học sinh có thể đăng ký vào các lớp học. Hệ thống tự động kiểm tra:
  - Lớp đã đầy chưa.
  - Học sinh có bị trùng lịch học không.
  - Gói học (Subscription) còn hiệu lực và còn buổi học không.
- **Quản Lý Gói Học (Subscriptions)**: Theo dõi số buổi học đã dùng, tổng số buổi, tự động hoàn buổi (refund) nếu hủy đăng ký trước giờ học 24 tiếng.

---

## 3. Các Router Giao Diện (Pages/Routes)

Ứng dụng sử dụng Next.js App Router (Single Page Dashboard cho mục đích test):
- **`/` (Trang chủ - Dashboard)**: Nơi tập trung toàn bộ giao diện quản lý:
  - **Onboarding**: Form tạo Phụ huynh và Học sinh.
  - **Class Management**: Form tạo lớp học mới và Bảng Lịch học hàng tuần (Weekly Schedule) cho phép click để đăng ký lớp.

---

## 4. Các API Endpoints (RESTful API)

Các API được thiết kế chuẩn RESTful, trả về định dạng JSON.

### Phụ Huynh (Parents)
- `POST /api/parents`: Tạo mới phụ huynh.
- `GET /api/parents/[id]`: Lấy thông tin chi tiết phụ huynh (kèm danh sách học sinh).

### Học Sinh (Students)
- `POST /api/students`: Tạo mới học sinh (cần truyền `parentId`).
- `GET /api/students/[id]`: Lấy thông tin chi tiết học sinh (kèm lịch sử đăng ký và gói học).

### Lớp Học (Classes)
- `POST /api/classes`: Tạo lớp học mới.
- `GET /api/classes`: Lấy danh sách lớp học (có thể lọc qua query `?day=0` - Chủ nhật, `1` - Thứ 2...).

### Đăng Ký (Registrations)
- `POST /api/classes/[classId]/register`: Đăng ký học sinh vào lớp (tự động trừ 1 buổi học trong Subscription).
- `DELETE /api/registrations/[id]`: Hủy đăng ký. Tự động hoàn lại 1 buổi học nếu hủy trước 24h.

### Gói Học (Subscriptions)
- `POST /api/subscriptions`: Khởi tạo gói học cho học sinh.
- `GET /api/subscriptions/[id]`: Kiểm tra trạng thái gói học.
- `PATCH /api/subscriptions/[id]/use`: Chủ động đánh dấu đã dùng 1 buổi học.

---

## 5. Cấu Trúc Dự Án (Project Structure)

```text
/teencare
├── .agent/
│   └── rules/             # Các quy tắc dành cho Agent (Workflow, API Pattern)
├── .github/workflows/     # CI/CD pipeline (Lint, Type check, Build)
├── docker/db/             # Thư mục chứa dữ liệu PostgreSQL (Bind mount)
├── prisma/
│   └── schema.prisma      # Định nghĩa Schema Database & Models
├── src/
│   ├── app/
│   │   ├── api/           # Chứa toàn bộ các Backend Route Handlers (REST API)
│   │   ├── globals.css    # Global styles (Tailwind)
│   │   ├── layout.tsx     # Layout chính của Next.js
│   │   └── page.tsx       # Trang Dashboard chính (UI Frontend)
│   ├── components/        # Chứa các React Components tái sử dụng
│   │   ├── ClassCreator.tsx
│   │   ├── ParentStudentForm.tsx
│   │   └── WeeklySchedule.tsx
│   └── lib/
│       └── prisma.ts      # Khởi tạo singleton Prisma Client (Sử dụng PrismaPg Adapter)
├── Dockerfile             # Cấu hình build Docker image (Node 22 Slim)
└── docker compose.yml     # Orchestration cho Web App & Postgres
```
