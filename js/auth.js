// Funções de autenticação
class Auth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('passeios-da-serra-users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('passeios-da-serra-current-user')) || null;
    }
    
    // Registrar novo usuário
    register(userData) {
        // Verificar se o email já está cadastrado
        const userExists = this.users.some(user => user.email === userData.email);
        if (userExists) {
            return { success: false, message: 'Este email já está cadastrado.' };
        }
        
        // Adicionar novo usuário
        this.users.push(userData);
        localStorage.setItem('passeios-da-serra-users', JSON.stringify(this.users));
        
        // Fazer login automaticamente
        this.login(userData.email, userData.password);
        
        return { success: true, user: userData };
    }
    
    // Fazer login
    login(email, password) {
        const user = this.users.find(user => user.email === email && user.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('passeios-da-serra-current-user', JSON.stringify(user));
            return { success: true, user };
        } else {
            return { success: false, message: 'Email ou senha incorretos.' };
        }
    }
    
    // Fazer logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('passeios-da-serra-current-user');
        return { success: true };
    }
    
    // Verificar se está logado
    isAuthenticated() {
        return this.currentUser !== null;
    }
    
    // Obter usuário atual
    getCurrentUser() {
        return this.currentUser;
    }
}

// Inicializar auth
const auth = new Auth();

// Manipular formulário de login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const result = auth.login(email, password);
        
        if (result.success) {
            // Redirecionar para a página inicial
            window.location.href = 'index.html';
        } else {
            // Mostrar mensagem de erro
            alert(result.message);
        }
    });
}

// Manipular formulário de cadastro
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Coletar dados do formulário
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        // Coletar preferências
        const preferenceCheckboxes = document.querySelectorAll('input[name="preferences"]:checked');
        const preferences = Array.from(preferenceCheckboxes).map(cb => cb.value);
        
        const interests = document.getElementById('register-interests').value;
        
        // Criar objeto de usuário
        const userData = {
            id: Date.now().toString(),
            name,
            email,
            password,
            preferences,
            interests,
            createdAt: new Date().toISOString()
        };
        
        // Registrar usuário
        const result = auth.register(userData);
        
        if (result.success) {
            // Redirecionar para a página inicial
            window.location.href = 'index.html';
        } else {
            // Mostrar mensagem de erro
            alert(result.message);
        }
    });
}

// Verificar autenticação ao carregar páginas protegidas
const protectedPages = ['perfil.html', 'criar-passeio.html'];
const currentPage = window.location.pathname.split('/').pop();

if (protectedPages.includes(currentPage)) {
    document.addEventListener('DOMContentLoaded', function() {
        if (!auth.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    });
}