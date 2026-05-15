document.addEventListener('DOMContentLoaded', () => {
            const topicList = document.getElementById('topicList');
            const emptyState = document.getElementById('emptyState');
            const btnToggleCreate = document.getElementById('btnToggleCreate');
            const createForm = document.getElementById('createForm');
            const btnCancelCreate = document.getElementById('btnCancelCreate');
            const newTopicForm = document.getElementById('newTopicForm');

            // Загрузка из localStorage или пустой массив
            let topics = JSON.parse(localStorage.getItem('ladaForumTopics')) || [];

            // Защита от XSS
            const escapeHtml = (text) => {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            };

            // Рендер списка
            function renderTopics() {
                topicList.innerHTML = '';
                if (topics.length === 0) {
                    emptyState.classList.remove('hidden');
                    return;
                }
                emptyState.classList.add('hidden');

                topics.forEach(topic => {
                    const li = document.createElement('li');
                    li.className = 'topic-card';
                    li.dataset.id = topic.id;

                    li.innerHTML = `
                        <div class="topic-head">
                            <div>
                                <h3 class="topic-title">${escapeHtml(topic.title)}</h3>
                                <div class="topic-meta">Автор: ${escapeHtml(topic.author)} • ${new Date(topic.date).toLocaleString('ru-RU')}</div>
                            </div>
                            <button class="f-btn f-btn-secondary btn-toggle-replies">Ответить (${topic.replies.length})</button>
                        </div>
                        <div class="topic-body">${escapeHtml(topic.content)}</div>
                        
                        <div class="replies-block">
                            <div class="reply-list" id="replies-${topic.id}">
                                ${topic.replies.map(r => `
                                    <div class="reply-item">
                                        <div class="reply-text">${escapeHtml(r.text)}</div>
                                        <div class="reply-meta">${escapeHtml(r.author)} • ${new Date(r.date).toLocaleString('ru-RU')}</div>
                                    </div>
                                `).join('')}
                            </div>
                            <form class="reply-form" data-topic-id="${topic.id}">
                                <textarea placeholder="Напишите ваш ответ..." required></textarea>
                                <button type="submit" class="f-btn f-btn-primary">Отправить</button>
                            </form>
                        </div>
                    `;
                    topicList.appendChild(li);
                });
            }

            // Переключение формы создания
            btnToggleCreate.addEventListener('click', () => createForm.classList.toggle('hidden'));
            btnCancelCreate.addEventListener('click', () => {
                createForm.classList.add('hidden');
                newTopicForm.reset();
            });

            // Создание темы
            newTopicForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('topicTitle').value.trim();
                const content = document.getElementById('topicContent').value.trim();
                if (!title || !content) return;

                topics.unshift({
                    id: Date.now().toString(),
                    author: 'Вы',
                    title,
                    content,
                    date: new Date().toISOString(),
                    replies: []
                });

                localStorage.setItem('ladaForumTopics', JSON.stringify(topics));
                renderTopics();
                newTopicForm.reset();
                createForm.classList.add('hidden');
            });

            // Делегирование событий для ответов
            topicList.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-toggle-replies')) {
                    const card = e.target.closest('.topic-card');
                    const block = card.querySelector('.replies-block');
                    const isActive = block.classList.toggle('active');
                    e.target.textContent = isActive ? 'Скрыть' : `Ответить (${card.querySelector('.reply-list').children.length})`;
                }
            });

            topicList.addEventListener('submit', (e) => {
                e.preventDefault();
                const form = e.target;
                const topicId = form.dataset.topicId;
                const textarea = form.querySelector('textarea');
                const text = textarea.value.trim();
                if (!text) return;

                const topic = topics.find(t => t.id === topicId);
                if (topic) {
                    topic.replies.push({
                        id: Date.now().toString(),
                        author: 'Вы',
                        text,
                        date: new Date().toISOString()
                    });
                    localStorage.setItem('ladaForumTopics', JSON.stringify(topics));

                    // Добавляем в DOM без полного ререндера (чтобы не терять фокус и скролл)
                    const list = form.previousElementSibling;
                    const div = document.createElement('div');
                    div.className = 'reply-item';
                    div.innerHTML = `
                        <div class="reply-text">${escapeHtml(text)}</div>
                        <div class="reply-meta">Вы • ${new Date().toLocaleString('ru-RU')}</div>
                    `;
                    list.appendChild(div);
                    textarea.value = '';
                    
                    // Обновляем счётчик
                    const btn = form.closest('.topic-card').querySelector('.btn-toggle-replies');
                    btn.textContent = `Скрыть (${topic.replies.length})`;
                }
            });

            // Первичный рендер
            renderTopics();
        });