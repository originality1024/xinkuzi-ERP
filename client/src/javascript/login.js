document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            alert('请输入用户名和密码');
            return;
        }

        // 模拟登录成功
        window.location.href = 'portal.html';

        // try {
        //     // 模拟登录请求
        //     const response = await fetch('/api/login', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({ username, password })
        //     });

        //     if (response.ok) {
        //         window.location.href = '/portal.html';
        //     } else {
        //         alert('登录失败，请检查凭证');
        //     }
        // } catch (error) {
        //     console.error('登录异常:', error);
        //     alert('网络连接异常');
        // }
    });
});