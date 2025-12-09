# KU COMSCI AI Chat - Google OAuth Login Setup

## 📋 ขั้นตอนการตั้งค่า Google OAuth

### 1. สร้าง Google OAuth Credentials

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้าง Project ใหม่ (หรือใช้ Project เดิม)
3. ไปที่เมนู **APIs & Services** → **Credentials**
4. คลิก **+ CREATE CREDENTIALS** → **OAuth client ID**
5. เลือก **Web application**
6. เพิ่ม Authorized redirect URIs:
   - `http://localhost:8000`
   - `http://localhost:5000`
   - `http://yourdomain.com` (สำหรับ production)
7. คัดลอก **Client ID** ที่ได้

### 2. เตรียมไฟล์ .env

1. ไปที่ folder `backend/`
2. คัดลอกไฟล์ `.env.example` เป็น `.env`
   ```bash
   copy .env.example .env
   ```
3. เปิดไฟล์ `.env` และใส่ค่า:
   ```
   GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

### 3. อัพเดตไฟล์ login.html

เปิดไฟล์ `login.html` และแทนที่ `YOUR_GOOGLE_CLIENT_ID` ด้วย Client ID จริงของคุณ:

```html
<div id="g_id_onload"
     data-client_id="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
     data-callback="handleCredentialResponse">
</div>
```

### 4. ติดตั้ง Dependencies

```bash
cd backend
npm install
```

### 5. รันระบบ

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
python -m http.server 8000
```

### 6. เข้าใช้งาน

1. เปิด `http://localhost:8000/login.html`
2. คลิก **Sign in with Google**
3. เข้าสู่ระบบด้วย Google Account
4. ระบบจะ redirect ไปหน้า chat โดยอัตโนมัติ

## 📁 โครงสร้างไฟล์

```
CS_Project/
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── comsci-ai-chat-demo.html
├── login.html              # หน้า login
├── login-styles.css        # CSS สำหรับ login
├── login-script.js         # JavaScript สำหรับ login
├── auth-handler.js         # Authentication handler
├── backend/
│   ├── auth-server.js      # Backend with OAuth
│   ├── package.json
│   ├── .env                # Configuration file
│   └── .env.example        # Example configuration
└── README.md
```

## 🔐 API Endpoints

### Public Endpoints
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/login` - Manual login
- `POST /api/auth/register` - Register new user

### Protected Endpoints (ต้อง token)
- `GET /api/auth/me` - Get current user info
- `POST /api/chat` - Send chat message
- `POST /api/auth/logout` - Logout

## 🛡️ Security Notes

- Token expires in 7 days
- ใช้ HTTPS ในการ production
- อย่าเก็บ JWT secret ใน code
- Hash passwords ด้วย bcrypt ในการ production
- ใช้ real database แทน in-memory storage

## 🐛 Troubleshooting

### "Google Sign-In button not showing"
- ตรวจสอบ Client ID ถูกต้อง
- ตรวจสอบ redirect URI ตรงกับการตั้งค่า

### "Token invalid or expired"
- ล้างข้อมูล localStorage
- ลอง login ใหม่

### "CORS Error"
- ตรวจสอบ backend กำลังรัน
- ตรวจสอบ CORS configuration ถูกต้อง

## 📝 หมายเหตุ

- Frontend ขณะนี้ใช้ localhost:8000
- Backend ขณะนี้ใช้ localhost:5000
- สำหรับ production ต้องใช้ HTTPS และตั้งค่า URLs ให้ถูกต้อง

---

**ต้องการความช่วยเหลือ?** ตรวจสอบ console (F12) เพื่อดูข้อผิดพลาด
