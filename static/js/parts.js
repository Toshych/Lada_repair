/**
 * Скрипт для справочника интернет-магазинов запчастей для LADA
 */

document.addEventListener('DOMContentLoaded', function() {
    const sitesGrid = document.getElementById('sitesGrid');

    // Данные о популярных интернет-магазинах запчастей
    const sitesData = [
        {
            name: "Autodoc.ru",
            url: "https://www.autodoc.ru",
            logo: "static/styles/image/autodoc-black.svg",
            rating: 4.5,
            description: "Крупнейший европейский онлайн-магазин автозапчастей с огромным ассортиментом деталей для LADA.",
            pros: [
                "Большой ассортимент запчастей для всех моделей LADA",
                "Конкурентные цены и регулярные скидки",
                "Быстрая доставка по России",
                "Удобный каталог с поиском по VIN-коду",
                "Подробные описания и фотографии товаров",
                "Возможность самовывоза в некоторых городах"
            ],
            cons: [
                "Иногда бывают задержки с доставкой",
                "Не всегда есть оригинальные запчасти",
                "Служба поддержки может медленно отвечать"
            ],
            features: [
                "Гарантия на все запчасти 14 дней",
                "Возможность возврата товара в течение 30 дней",
                "Оплата при получении в некоторых регионах",
                "Мобильное приложение для удобного заказа"
            ]
        },
        {
            name: "Exist.ru",
            url: "https://www.exist.ru",
            logo: "static/styles/image/logo-large-ru.svg",
            rating: 4.7,
            description: "Один из старейших и самых надежных интернет-магазинов автозапчастей в России.",
            pros: [
                "Огромный выбор оригинальных и неоригинальных запчастей",
                "Наличие собственных складов в многих регионах",
                "Быстрая обработка заказов",
                "Удобная система поиска по каталогу",
                "Подробные технические описания",
                "Возможность проверки совместимости деталей"
            ],
            cons: [
                "Цены могут быть выше средних",
                "Не всегда есть доставка в отдаленные регионы",
                "Интерфейс сайта иногда тормозит"
            ],
            features: [
                "Гарантия на запчасти до 1 года",
                "Возможность заказа редких деталей",
                "Профессиональная консультация специалистов",
                "Программа лояльности для постоянных клиентов"
            ]
        },
        {
            name: "Autopiter.ru",
            url: "https://www.autopiter.ru",
            logo: "static/styles/image/e5aedadeff993055.svg",
            rating: 4.3,
            description: "Популярный интернет-магазин с хорошим ассортиментом запчастей для отечественных автомобилей.",
            pros: [
                "Хороший выбор запчастей для LADA",
                "Часто проводятся акции и распродажи",
                "Удобный поиск по модели автомобиля",
                "Быстрая доставка в крупные города",
                "Возможность заказать редкие детали",
                "Хорошая служба поддержки"
            ],
            cons: [
                "Ассортимент меньше, чем у конкурентов",
                "Не всегда есть оригинальные запчасти",
                "Доставка в отдаленные регионы может быть долгой"
            ],
            features: [
                "Гарантия на все запчасти 30 дней",
                "Возможность оплаты при получении",
                "Удобное мобильное приложение",
                "Система бонусов за покупки"
            ]
        },
        {
            name: "Лада-Деталь",
            url: "https://www.lada-detail.ru",
            logo: "static/styles/image/logo-new.png",
            rating: 4.8,
            description: "Официальный дилерский центр по продаже оригинальных запчастей LADA.",
            pros: [
                "Только оригинальные запчасти LADA",
                "Гарантия качества от производителя",
                "Быстрая доставка по всей России",
                "Возможность заказа редких деталей",
                "Профессиональная консультация",
                "Регулярные акции и скидки для владельцев LADA"
            ],
            cons: [
                "Цены выше, чем у конкурентов",
                "Ассортимент ограничен только оригинальными деталями",
                "Не всегда есть все детали в наличии"
            ],
            features: [
                "Гарантия на все запчасти 1 год",
                "Возможность самовывоза в Москве и регионах",
                "Оплата банковскими картами и безналичный расчет",
                "Подробные каталоги с иллюстрациями"
            ]
        },
        {
            name: "Emex.ru",
            url: "https://www.emex.ru",
            logo: "static/styles/image/Screenshot_2.png",
            rating: 4.6,
            description: "Крупный интернет-магазин автозапчастей с развитой сетью пунктов выдачи.",
            pros: [
                "Большой ассортимент запчастей для LADA",
                "Конкурентные цены",
                "Быстрая доставка в пункты выдачи",
                "Удобный поиск по каталогу",
                "Возможность самовывоза в многих городах",
                "Хорошая служба поддержки"
            ],
            cons: [
                "Не всегда есть оригинальные запчасти",
                "Интерфейс сайта может быть неудобным",
                "Доставка в отдаленные регионы может быть дорогой"
            ],
            features: [
                "Гарантия на все запчасти 30 дней",
                "Возможность оплаты при получении",
                "Программа лояльности для постоянных клиентов",
                "Мобильное приложение для удобного заказа"
            ]
        }
    ];

    // Функция для отображения карточек магазинов
    function displaySites() {
        sitesGrid.innerHTML = '';

        sitesData.forEach(site => {
            const siteCard = document.createElement('div');
            siteCard.className = 'site-card';

            // Для SVG логотипа используем object, для PNG - img
            let logoHtml;
            if (site.logo.endsWith('.svg')) {
                logoHtml = `<object type="image/svg+xml" data="${site.logo}" class="site-logo-svg"></object>`;
            } else {
                logoHtml = `<img src="${site.logo}" alt="${site.name} logo">`;
            }

            siteCard.innerHTML = `
                <div class="site-header">
                    <div class="site-rating">${site.rating}</div>
                    <div class="site-logo">
                        ${logoHtml}
                    </div>
                    <div class="site-name">${site.name}</div>
                    <div class="site-url">${site.url}</div>
                </div>
                <div class="site-content">
                    <div class="site-description">${site.description}</div>

                    <div class="features-section">
                        <div class="features-title">Преимущества:</div>
                        <ul class="features-list pros-list">
                            ${site.pros.map(pro => `<li>${pro}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="features-section">
                        <div class="features-title">Недостатки:</div>
                        <ul class="features-list cons-list">
                            ${site.cons.map(con => `<li>${con}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="features-section">
                        <div class="features-title">Особенности:</div>
                        <ul class="features-list">
                            ${site.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>

                    <a href="${site.url}" class="visit-button" target="_blank">Перейти на сайт</a>
                </div>
            `;

            sitesGrid.appendChild(siteCard);
        });
    }

    // Инициализация
    displaySites();
});