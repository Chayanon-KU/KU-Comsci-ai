// Authentication Handler สำหรับหน้า chat
class AuthHandler {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        this.init();
    }

    init() {
        // ถ้าไม่มี token ให้ redirect ไปหน้า login
        if (!this.token) {
            console.log('No auth token found, redirecting to login...');
            window.location.href = 'login.html';
            return;
        }

        // ตรวจสอบ token validity
        this.verifyToken();
        
        // เพิ่มข้อมูลผู้ใช้ในหน้า
        this.displayUserInfo();
        
        // เพิ่ม logout button - เรียกหลังจาก DOM elements ถูกสร้าง
        setTimeout(() => this.setupLogout(), 100);
    }

    async verifyToken() {
        try {
            const response = await fetch('http://localhost:5000/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Token expired or invalid');
            }

            const data = await response.json();
            if (data.success) {
                this.user = data.user;
                localStorage.setItem('user', JSON.stringify(this.user));
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            this.logout();
        }
    }

    displayUserInfo() {
        if (!this.user) return;

        // สร้าง user info header element
        const userInfoDiv = document.createElement('div');
        userInfoDiv.id = 'user-info-header';
        userInfoDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 15px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 25px;
            font-size: 13px;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.15);
        `;

        userInfoDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                <img src="${this.user.picture || 'https://via.placeholder.com/32'}" 
                     alt="avatar" 
                     style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; cursor: pointer;"
                     onclick="window.location.href='profile.html'"
                     title="ดูโปรไฟล์">
                <div style="display: flex; flex-direction: column; gap: 2px;">
                    <span style="font-weight: 600; line-height: 1; color: #1f1f1f;">${this.user.name}</span>
                    <span style="font-size: 11px; color: #999;">${this.user.email}</span>
                </div>
            </div>
        `;

        // Hover effect for logout button
        const style = document.createElement('style');
        style.textContent = `
            #logout-btn:hover {
                background: linear-gradient(135deg, #b71c1c 0%, #a01818 100%) !important;
                box-shadow: 0 4px 8px rgba(211, 47, 47, 0.4) !important;
                transform: translateY(-2px);
            }
            #logout-btn:active {
                transform: translateY(0);
            }
            @media (max-width: 768px) {
                #user-info-header {
                    gap: 8px !important;
                    padding: 8px 12px !important;
                }
                #logout-btn {
                    padding: 5px 10px !important;
                    font-size: 11px !important;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(userInfoDiv);
    }

    setupLogout() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    logout() {
        // ส่งการร้องขออล็อกเอาต์ไปยังเซิร์ฟเวอร์
        fetch('http://localhost:5000/api/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        }).catch(err => console.error('Logout error:', err));

        // ลบข้อมูลจากเบราว์เซอร์
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // แจ้งเตือนผู้ใช้
        alert('ออกจากระบบแล้ว ยินดีที่ได้ใช้บริการ!');
        
        // เปลี่ยนเส้นทางไปหน้า login
        window.location.href = 'login.html';
    }

    getAuthHeaders() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }
}

// Initialize auth
const auth = new AuthHandler();

// Override the original sendMessage function to use protected API
if (window.sendMessage) {
    const originalSendMessage = window.sendMessage;
    window.sendMessage = async function() {
        // ใช้ protected endpoint
        const text = document.getElementById('user-input').value.trim();
        if (!text) return;

        // แสดง User message
        window.addMessage(text, 'user');
        document.getElementById('user-input').value = '';

        // แสดง Loading
        const loadingId = window.addLoading();

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: auth.getAuthHeaders(),
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            window.removeMessage(loadingId);

            const aiResponse = data.reply || data.output || 'No response';
            window.addMessage(aiResponse, 'ai');
        } catch (error) {
            window.removeMessage(loadingId);
            window.addMessage('เกิดข้อผิดพลาด: ' + error.message, 'ai');
        }
    };
}
