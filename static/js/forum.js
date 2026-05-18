// --- НАСТРОЙКИ SUPABASE ---
const SUPABASE_URL = 'https://nkslanglqhrsdefzbfdv.supabase.co'; // <-- Вставь свой URL!
const SUPABASE_KEY = 'sb_publishable_jGPiHru7Q_BumAXGIQs3Uw_i3MlZLTx'; // <-- Вставь свой полный ключ!


let supabaseClient = null;
let currentUser = null;

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.supabase === 'undefined') {
        console.error('❌ Библиотека Supabase не загружена');
        document.getElementById('topicList').innerHTML = '<li>Ошибка: не удалось загрузить библиотеку Supabase</li>';
        return;
    }

    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Supabase подключён');

    checkAuth();
    loadTopics();
});

// Проверка авторизации (простая, по имени)
function checkAuth() {
    const username = localStorage.getItem('ladaUsername');
    if (username) {
        currentUser = username;
        document.getElementById('authBlock').classList.add('hidden');
        document.getElementById('userGreeting').classList.remove('hidden');
        document.getElementById('currentUserName').textContent = username;
        document.getElementById('btnToggleCreate').disabled = false;
    } else {
        document.getElementById('authBlock').classList.remove('hidden');
        document.getElementById('userGreeting').classList.add('hidden');
        document.getElementById('btnToggleCreate').disabled = true;
    }
}

// Вход (сохраняем имя в localStorage)
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    if (username) {
        localStorage.setItem('ladaUsername', username);
        checkAuth();
    }
});

// Регистрация (аналогично входу)
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value.trim();
    if (username) {
        localStorage.setItem('ladaUsername', username);
        alert('Регистрация успешна! Теперь вы вошли.');
        checkAuth();
    }
});

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

// Выход
function logout() {
    localStorage.removeItem('ladaUsername');
    currentUser = null;
    location.reload();
}

// Загрузка тем из Supabase
async function loadTopics() {
    const topicList = document.getElementById('topicList');
    const emptyState = document.getElementById('emptyState');
    
    topicList.innerHTML = '<li>⏳ Загрузка...</li>';

    try {
        const { data, error } = await supabaseClient
            .from('topics')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        topicList.innerHTML = '';
        
        if (!data || data.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }
        emptyState.classList.add('hidden');

        data.forEach(topic => {
            const li = document.createElement('li');
            li.className = 'topic-card';
            
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
        console.error('❌ Ошибка загрузки тем:', err);
        topicList.innerHTML = `<li>❌ Ошибка: ${err.message}</li>`;
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
    if (!currentUser) return alert('Вы не авторизованы');

    const title = document.getElementById('topicTitle').value.trim();
    const content = document.getElementById('topicContent').value.trim();

    try {
        const { error } = await supabaseClient.from('topics').insert([
            { 
                title: title, 
                content: content, 
                author_name: currentUser 
            }
        ]);

        if (error) throw error;

        newTopicForm.reset();
        createForm.classList.add('hidden');
        loadTopics(); // Обновляем список
    } catch (err) {
        console.error('❌ Ошибка создания темы:', err);
        alert('Не удалось создать тему: ' + err.message);
    }
});

// Защита от XSS
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Делаем функции доступными из HTML
window.logout = logout;
window.showTab = showTab;