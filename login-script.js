// Google OAuth Handler
function handleCredentialResponse(response) {
    console.log("Google JWT ID token received");
    
    try {
        // ส่ง token ไปยัง backend เพื่อตรวจสอบและสร้าง session
        fetch('http://localhost:5000/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: response.credential
            })
        })
        .then(res => {
            console.log('Response status:', res.status);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log('Server response:', data);
            if (data.success) {
                // เก็บ token หรือ session
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // เปลี่ยนเส้นทางไปหน้า chat
                alert('เข้าสู่ระบบสำเร็จ!');
                window.location.href = 'comsci-ai-chat-demo.html';
            } else {
                alert('เข้าสู่ระบบล้มเหลว: ' + (data.message || 'Unknown error'));
                console.error('Auth error:', data);
            }
        })
        .catch(error => {
            console.error('Error details:', error);
            alert('เกิดข้อผิดพลาด: ' + error.message + '\n\nตรวจสอบให้แน่ใจว่า Backend Server กำลังรัน (localhost:5000)');
        });
    } catch (error) {
        console.error('Critical error:', error);
        alert('เกิดข้อผิดพลาดวิกฤต: ' + error.message);
    }
}

// Register Modal
function showRegister() {
    document.getElementById('registerModal').style.display = 'flex';
}

function closeRegister() {
    document.getElementById('registerModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('registerModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Register Form Handler
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    if (password !== confirmPassword) {
        alert('รหัสผ่านไม่ตรงกัน');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
            closeRegister();
            document.getElementById('register-form').reset();
        } else {
            alert('สมัครสมาชิกล้มเหลว: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาด: ' + error.message);
    }
});

// Manual Login
document.getElementById('manual-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'comsci-ai-chat-demo.html';
        } else {
            alert('เข้าสู่ระบบล้มเหลว: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาด: ' + error.message);
    }
});

// Check if already logged in
window.addEventListener('load', () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        // User is already logged in, redirect to chat
        showLogoutPrompt();
    }
});

function showLogoutPrompt() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
        const confirmed = confirm(`คุณได้เข้าสู่ระบบแล้ว (${user.name})\n\nต้องการไปหน้า Chat หรือ ออกจากระบบ?`);
        if (confirmed) {
            window.location.href = 'comsci-ai-chat-demo.html';
        }
    }
}
