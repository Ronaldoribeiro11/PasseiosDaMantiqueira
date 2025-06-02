// Em js/auth.js

class Auth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('passeios-da-serra-users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('passeios-da-serra-current-user')) || null;
    }

    register(userData) {
        const userExists = this.users.some(user => user.email === userData.email);
        if (userExists) {
            return { success: false, message: 'Este email já está cadastrado.' };
        }

        const newUser = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            password: userData.password, // Lembre-se de que armazenar senhas em plain text é inseguro para produção
            preferences: userData.preferences || [],
            interests: userData.interests || '',
            createdAt: new Date().toISOString(),
            // Campos adicionais para o perfil de criador, inicializados como nulos/padrão
            creatorStatus: 'none', // 'none', 'pending_verification', 'verified', 'rejected'
            cpf: null,
            birthDate: null,
            fullAddress: null,
            // ... outros campos do formulário de criador
            agreedToCreatorTerms: false
        };

        this.users.push(newUser);
        localStorage.setItem('passeios-da-serra-users', JSON.stringify(this.users));
        this.login(userData.email, userData.password); // Autologin
        return { success: true, user: newUser };
    }

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

    logout() {
        this.currentUser = null;
        localStorage.removeItem('passeios-da-serra-current-user');
        return { success: true };
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        // Garante que estamos sempre lendo a versão mais atual do localStorage,
        // especialmente se o status for modificado em outra parte.
        this.currentUser = JSON.parse(localStorage.getItem('passeios-da-serra-current-user')) || null;
        return this.currentUser;
    }

    // Função para atualizar dados do usuário, incluindo o creatorStatus ou dados do criador
    updateCurrentUserData(dataToUpdate) {
        if (!this.currentUser) return false;

        // Atualiza a instância local do usuário atual
        this.currentUser = { ...this.currentUser, ...dataToUpdate };
        localStorage.setItem('passeios-da-serra-current-user', JSON.stringify(this.currentUser));

        // Atualiza na lista 'users' também
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...dataToUpdate };
            localStorage.setItem('passeios-da-serra-users', JSON.stringify(this.users));
        }
        console.log('User data updated in localStorage:', this.currentUser);
        return true;
    }
}

// A instância global 'auth' já deve existir no seu auth.js original
// const auth = new Auth();

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

