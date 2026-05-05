# TeenUp Product Builder - Mini LMS

Dự án Mini LMS (Learning Management System) được xây dựng với Next.js 15, PostgreSQL, và Prisma ORM theo các yêu cầu của bài test Product Builder.

---

## 1. Cách Build và Chạy Dự Án (Build & Run)

Dự án được thiết lập sẵn với Docker và Makefile để tối ưu hóa việc quản lý.

### Sử dụng Docker (Khuyên dùng)
Yêu cầu: Đã cài đặt Docker và Docker Compose.

1. **Khởi động dự án**:
   ```bash
   make up
   ```
   *(Lệnh này sẽ khởi chạy database và web container, tự động cài đặt dependencies và migrate database).*

2. **Khởi tạo dữ liệu mẫu (Seed Data)**:
   Sau khi container web đã sẵn sàng, chạy lệnh sau để nạp 2 Parents, 3 Students và 2 Classes mẫu:
   ```bash
   make seed
   ```

3. **Xem logs**:
   ```bash
   make logs
   ```

4. **Truy cập ứng dụng**: [http://localhost:3000](http://localhost:3000)

### Các lệnh Makefile hỗ trợ khác
- `make build`: Build lại các images.
- `make down`: Dừng và gỡ bỏ các containers.
- `make restart`: Khởi động lại dự án.

---

## 2. Database Schema (Prisma Models)

Hệ thống sử dụng các Models chính sau:
- **Parent**: Lưu trữ thông tin phụ huynh (`name`, `phone`, `email`).
- **Student**: Thông tin học sinh, liên kết với một `Parent`.
- **Class**: Thông tin lớp học, bao gồm `dayOfWeek` (0-6), `timeSlot` (VD: "08:00-10:00"), và `maxStudents`.
- **Subscription**: Gói học của học sinh, quản lý `totalSessions`, `usedSessions`, và `endDate`.
- **ClassRegistration**: Bản ghi đăng ký của học sinh vào một lớp cụ thể vào một ngày cụ thể (`scheduledDate`).

---

## 3. Các Chức Năng Chính & Nghiệp Vụ (Key Features)

### Quản lý Nghiệp vụ Đăng ký lớp
- **Kiểm tra sĩ số**: Không cho đăng ký nếu lớp đã đầy chỗ vào ngày đó.
- **Kiểm tra trùng lịch**: Không cho học sinh đăng ký 2 lớp có cùng khung giờ trong cùng một ngày.
- **Kiểm tra gói học**: Chỉ cho đăng ký nếu gói học còn hạn sử dụng và còn số buổi học.
- **Chặn đăng ký quá khứ**: Không cho phép đăng ký vào các ngày đã trôi qua.
- **Hủy lịch có điều kiện**: Hủy trước 24h sẽ được hoàn lại 1 buổi học vào gói. Hủy sát giờ sẽ không được hoàn buổi.

### Giao diện Người dùng (UI/UX)
- **Sidebar Navigation**: Hệ thống điều hướng chuyên nghiệp qua các trang Parents, Students, Classes, Subscriptions.
- **Weekly Schedule**: Bảng lịch học 7 ngày tại Dashboard, cho phép chọn nhanh lớp để đăng ký.
- **Student Control Panel**: Tại trang Students, khi bấm vào một học sinh sẽ hiện bảng điều khiển chi tiết (Mua gói học, Đăng ký lớp, Xem lịch sử và Hủy lớp).
- **Subscription Management**: Trang quản lý tập trung toàn bộ các gói học, cho phép "Điểm danh" (Mark Session Used) để trừ buổi học thủ công.

---

## 4. Các API Endpoints (RESTful)

### Parents & Students
- `POST /api/parents` | `GET /api/parents`
- `POST /api/students` | `GET /api/students`

### Classes & Registrations
- `POST /api/classes` | `GET /api/classes`
- `POST /api/classes/[classId]/register`: Đăng ký lớp (kèm các bước kiểm tra nghiệp vụ).
- `DELETE /api/registrations/[id]`: Hủy đăng ký (kèm logic hoàn buổi >24h).

### Subscriptions
- `POST /api/subscriptions`: Mua gói học mới.
- `GET /api/subscriptions`: Danh sách toàn bộ gói học.
- `PATCH /api/subscriptions/[id]/use`: Đánh dấu đã sử dụng 1 buổi học.

---

## 5. Ví dụ Dữ liệu Mẫu (Seed)
Khi chạy `make seed`, hệ thống sẽ nạp:
- **2 Phụ huynh**: Nguyễn Văn A, Trần Thị B.
- **3 Học sinh**: Nguyễn Con Một, Nguyễn Con Hai (thuộc Parent A), Trần Con Ba (thuộc Parent B).
- **2 Lớp học**: Toán Tư Duy (Thứ 2), Tiếng Anh Giao Tiếp (Thứ 4).
- **1 Gói học**: Được cấp sẵn cho học sinh "Nguyễn Con Một" để bạn có thể test đăng ký lớp ngay.

---
*Dự án được thực hiện bởi Antigravity Agent.*
