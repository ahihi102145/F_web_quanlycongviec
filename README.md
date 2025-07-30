# 🚀 Dự án Phần mềm tiến độ FPT Telecom xây dựng bằng NodeJS - ExpressJS - MongoDB Base

Một nền tảng backend hiện đại được xây dựng bằng **Node.js**, **Express.js** và **MongoDB**, tích hợp sẵn các công nghệ và công cụ cần thiết để phát triển nhanh các ứng dụng web fullstack.

---

## 🧰 Công nghệ sử dụng

### Backend:
- **Node.js** – môi trường chạy JavaScript phía server
- **Express.js** – framework tối giản, hiệu quả
- **MongoDB** – cơ sở dữ liệu NoSQL
- **Mongoose + mongodb driver** – kết nối và thao tác dữ liệu
- **JWT** – xác thực người dùng bằng token
- **Joi** – xác thực dữ liệu đầu vào
- **Socket.IO** – giao tiếp realtime
- **Cloudinary + Multer** – xử lý và upload ảnh
- **Google Calendar API** – đồng bộ sự kiện
- **Brevo API (Sendinblue)** – gửi email tự động
- **Babel** – hỗ trợ cú pháp ES6+ cho Node.js
- **Cross-env** – quản lý biến môi trường

### Frontend (tích hợp sẵn nếu cần mở rộng):
- **React 18**
- **Material UI v7** – giao diện thân thiện
- **Chart.js + react-chartjs-2** – hiển thị biểu đồ
- **FullCalendar** – hiển thị và quản lý lịch làm việc

---

## 📁 Cấu trúc thư mục chính

```
frontend/
├── apis/              # Tất cả các API request đến backend
├── assets/            # Ảnh, biểu tượng, font, style tĩnh
├── components/        # Component dùng lại được trong toàn hệ thống
├── customHooks/       # Các React hook tùy chỉnh (useAuth, useSocket,...)
├── customLibraries/   # Các thư viện custom hoặc dịch vụ bên thứ 3
├── pages/             # Các trang chính (Home, Inventory, Reports,...)
├── redux/             # Store Redux + slice quản lý trạng thái
├── utils/             # Hàm tiện ích dùng chung (formatDate, validate,...)
├── App.jsx            # Thành phần chính chứa định tuyến và layout chung
├── App.css            # Style toàn cục cho App
├── main.jsx           # Điểm khởi tạo ứng dụng React
├── index.css          # Style toàn cục
├── socketClient.js    # Cấu hình kết nối Socket.IO client
└── theme.js           # File cấu hình chủ đề (MUI / tùy chỉnh CSS biến)
```
## 🚀 Cài đặt & Chạy dự án


| Lệnh | Mục đích |
|------|----------|
| `yarn dev` | Chạy ở chế độ phát triển với hot-reload |
| `yarn build` | Biên dịch mã nguồn vào thư mục `build/` |
| `yarn production` | Build và chạy ở chế độ production |
| `yarn lint` | Kiểm tra và chuẩn hóa code theo ESLint |

---


### 1. Tải mã nguồn về

```bash
git clone https://github.com/ahihi102145/F_web_quanlycongviec.git
cd F_web_quanlycongviec
```
### 2.Cài đặt thư viện
```
yarn install
```
### 3.Tạo file .env
```
MONGODB_URI = ''
DATABASE_NAME=''
LOCAL_DEV_APP_HOST=''
LOCAL_DEV_APP_PORT=

AUTHOR =''

WEBSITE_DOMAIN_DEVELOPMENT=''
WEBSITE_DOMAIN_PRODUCTION=''

BREVO_API_KEY ='',
ADMIN_EMAIL_ADDRESS='',
ADMIN_EMAIL_NAME='Admin Vector'

ACCESS_TOKEN_SECRET_SIGNATURE=''
ACCESS_TOKEN_LIFE=''

REFRESH_TOKEN_SECRET_SIGNATURE=''
REFRESH_TOKEN_LIFE=''

CLOUDINARY_CLOUD_NAME =''
CLOUDINARY_API_KEY=''
CLOUDINARY_API_SECRET=''

GOOGLE_CLIENT_ID =''
GOOGLE_CLIENT_SECRET =''
GOOGLE_REDIRECT_URI=''
```
