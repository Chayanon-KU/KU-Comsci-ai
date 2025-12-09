# 📊 ระบบจัดการข้อมูลผู้ใช้ - KU COMSCI AI Chat

## ✅ สิ่งที่ทำแล้ว

### 1. **Database (SQLite)**
- ✅ เก็บข้อมูลผู้ใช้ในไฟล์ `users.db`
- ✅ ตารางผู้ใช้ (users) พร้อม fields:
  - `id` - ID ของผู้ใช้
  - `googleId` - ID จาก Google OAuth
  - `email` - อีเมล
  - `name` - ชื่อ
  - `picture` - รูปภาพโปรไฟล์
  - `password` - รหัสผ่าน (hash ด้วย bcrypt)
  - `loginMethod` - วิธี login (google/manual)
  - `createdAt` - เวลาสมัครสมาชิก
  - `lastLogin` - เวลาเข้าสู่ระบบครั้งล่าสุด

- ✅ ตารางประวัติแชท (chat_history):
  - `id` - ID ข้อความ
  - `userId` - ID ของผู้ใช้
  - `message` - ข้อความ
  - `sender` - ผู้ส่ง (user/ai)
  - `createdAt` - เวลาส่ง

### 2. **API Endpoints**

#### Authentication
- `POST /api/auth/google` - เข้าสู่ระบบด้วย Google
- `POST /api/auth/register` - สมัครสมาชิกแบบ manual
- `POST /api/auth/login` - เข้าสู่ระบบแบบ manual
- `GET /api/auth/me` - ดึงข้อมูลผู้ใช้ปัจจุบัน

#### Chat
- `POST /api/chat` - ส่งข้อความ (protected)
- `GET /api/chat/history` - ดึงประวัติแชท (protected)
- `DELETE /api/chat/history` - ลบประวัติแชท (protected)

#### Admin
- `GET /api/admin/users` - ดูรายชื่อผู้ใช้ทั้งหมด

### 3. **Security**
- ✅ Password hash ด้วย bcrypt
- ✅ JWT Token authentication
- ✅ CORS enabled
- ✅ Protected routes ต้อง token

### 4. **Admin Dashboard**
- ✅ หน้า `/admin-dashboard.html` เพื่อดูรายชื่อผู้ใช้
- ✅ แสดงสถิติผู้ใช้
- ✅ Auto-refresh ทุก 30 วินาที

---

## 📁 ไฟล์ที่เกี่ยวข้อง

```
backend/
├── auth-server.js      ✅ Server main file
├── database.js         ✅ SQLite database functions
├── package.json        ✅ Dependencies
├── .env                ✅ Configuration
├── users.db            ✅ Database file (auto-created)
└── node_modules/       ✅ Installed packages

frontend/
├── login.html          ✅ Login page
├── login-styles.css    ✅ Login styles
├── login-script.js     ✅ Login logic
├── admin-dashboard.html ✅ Admin dashboard
└── comsci-ai-chat-demo.html ✅ Chat page
```

---

## 🚀 การใช้งาน

### 1. **เริ่ม Backend**
```bash
cd backend
npm start
```

### 2. **เริ่ม Frontend**
```bash
python -m http.server 8000
```

### 3. **เข้าใช้งาน**
- **Login**: http://localhost:8000/login.html
- **Chat**: http://localhost:8000/comsci-ai-chat-demo.html (หลัง login)
- **Admin**: http://localhost:8000/admin-dashboard.html

---

## 💾 ดูข้อมูลในฐานข้อมูล

### ใช้ SQLite Browser (optional)
1. ดาวน์โหลด [DB Browser for SQLite](https://sqlitebrowser.org/)
2. เปิดไฟล์ `backend/users.db`
3. ดูข้อมูลในแต่ละตาราง

### ใช้ Admin Dashboard
- เปิด http://localhost:8000/admin-dashboard.html
- ดูรายชื่อผู้ใช้ทั้งหมดที่เข้าสู่ระบบ

---

## 📊 ตัวอย่างข้อมูลผู้ใช้

```
ID              | Email                    | Name        | Login Method | Registered
1765166599955   | chayanon.kl@ku.th       | Chayanon K.  | google       | 2025-12-08
1765167007616   | chayanonkl118@gmail.com | Chayanon     | google       | 2025-12-08
```

---

## 🔐 Security Best Practices

✅ **ทำแล้ว**:
- Password hashing ด้วย bcrypt
- JWT token expiration (7 days)
- Protected API routes
- CORS configuration

⚠️ **ต้องทำเพิ่มเติม** (สำหรับ Production):
- ใช้ HTTPS แทน HTTP
- เก็บ JWT_SECRET ในตัวแปร environment
- ตั้ง rate limiting
- เพิ่ม input validation เข้มงวด
- ใช้ real database (MySQL, PostgreSQL)
- เพิ่ม logging system

---

## 🐛 Troubleshooting

### Database ไม่สร้าง?
- ตรวจสอบว่า backend กำลังรัน
- ตรวจสอบ `backend/` folder มี permissions เขียน

### Admin Dashboard ไม่แสดงข้อมูล?
- ตรวจสอบ backend server กำลังรัน
- เปิด F12 Console เพื่อดูข้อผิดพลาด
- ลอง refresh page (Ctrl+F5)

### ลืมรหัสผ่าน?
- Database ใช้ email เป็น unique key
- ต้องลบ record ออกจาก database แล้วสมัครใหม่

---

## 📝 ขั้นตอนถัดไป

1. **Backup Database**: Copy `users.db` เป็นระยะ
2. **Email Verification**: เพิ่ม OTP/verification link
3. **Password Reset**: สร้าง reset password feature
4. **User Profile**: ให้ผู้ใช้แก้ไขโปรไฟล์
5. **Analytics**: เพิ่ม dashboard สำหรับ analytics

---

**🎉 ระบบเก็บข้อมูลผู้ใช้พร้อมใช้งาน!**
