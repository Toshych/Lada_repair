const API_URL = 'http://localhost:3000/api';
let currentUser = null;
let authToken = localStorage.getItem('ladaAuthToken'); // Храним токен в localStorage браузера

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadTopics();
    setupEventListeners();
});

// --- Управление авторизацией ---
console.log('Forum JS loaded!'); // Добавь эту строку в самое начало файла

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded, starting app...'); // И эту сюда
    checkAuth();
    loadTopics();
    setupEventListeners();
});
function checkAuth() {
    const username = localStorage.getItem('ladaUsername');
    if (authToken && username) {
        currentUser = username;
        document.getElementById('authBlock').classList.add('hidden');
        document.getElementById('userGreeting').classList.remove('hidden');
        document.getElementById('currentUserName').textContent = username;
        document.getElementById('btnToggleCreate').disabled = false; // Разрешаем создавать темы
    } else {
        document.getElementById('authBlock').classList.remove('hidden');
        document.getElementById('userGreeting').classList.add('hidden');
        document.getElementById('btnToggleCreate').disabled = true; // Запрещаем создавать темы
        document.getElementById('btnToggleCreate').title = "Войдите, чтобы создать тему";
    }
}

function logout() {
    localStorage.removeItem('ladaAuthToken');
    localStorage.removeItem('ladaUsername');
    authToken = null;
    currentUser = null;
    location.reload();
}

// Переключение вкладок Вход/Регистрация
window.showTab = (tab) => {
    const loginForm = document.getElementById('loginForm');
    const regForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.tab-btn');
    
    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
        tabs[0].classList.remove('active');
        tabs[1].classList.add('active');
    }
};

// Обработка входа
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        
        if (res.ok) {
            authToken = data.token;
            localStorage.setItem('ladaAuthToken', authToken);
            localStorage.setItem('ladaUsername', data.username);
            checkAuth();
            loadTopics(); // Перезагрузить темы, чтобы обновить UI если нужно
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
        alert('Ошибка соединения с сервером');
    }
});

// Обработка регистрации
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        
        if (res.ok) {
            alert('Регистрация успешна! Теперь войдите.');
            showTab('login');
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
        alert('Ошибка соединения');
    }
});

// --- Работа с темами форума ---

async function loadTopics() {
    const topicList = document.getElementById('topicList');
    const emptyState = document.getElementById('emptyState');
    
    try {
        const res = await fetch(`${API_URL}/topics`);
        const topics = await res.json();
        
        topicList.innerHTML = '';
        
        if (topics.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }
        emptyState.classList.add('hidden');

        topics.forEach(topic => {
            const li = document.createElement('li');
            li.className = 'topic-card';
            // Экранирование HTML для безопасности
            const safeTitle = escapeHtml(topic.title);
            const safeContent = escapeHtml(topic.content);
            const safeAuthor = escapeHtml(topic.author_name || 'Аноним');
            const date = new Date(topic.created_at).toLocaleString('ru-RU');

            li.innerHTML = `
                <div class="topic-head">
                    <div>
                        <h3 class="topic-title">${safeTitle}</h3>
                        <div class="topic-meta">Автор: ${safeAuthor} • ${date}</div>
                    </div>
                </div>
                <div class="topic-body">${safeContent}</div>
            `;
            topicList.appendChild(li);
        });
    } catch (err) {
        console.error('Ошибка загрузки тем:', err);
    }
}

// Создание новой темы
const newTopicForm = document.getElementById('newTopicForm');
const createForm = document.getElementById('createForm');
const btnToggleCreate = document.getElementById('btnToggleCreate');
const btnCancelCreate = document.getElementById('btnCancelCreate');

btnToggleCreate.addEventListener('click', () => {
    if (!currentUser) {
        alert('Сначала войдите в аккаунт!');
        return;
    }
    createForm.classList.toggle('hidden');
});

btnCancelCreate.addEventListener('click', () => {
    createForm.classList.add('hidden');
    newTopicForm.reset();
});

newTopicForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!authToken) return alert('Вы не авторизованы');

    const title = document.getElementById('topicTitle').value.trim();
    const content = document.getElementById('topicContent').value.trim();

    try {
        const res = await fetch(`${API_URL}/topics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, token: authToken })
        });
        
        if (res.ok) {
            newTopicForm.reset();
            createForm.classList.add('hidden');
            loadTopics(); // Обновляем список
        } else {
            const data = await res.json();
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
    }
});

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function setupEventListeners() {
    // Здесь можно добавить логику для ответов, если будешь реализовывать
}