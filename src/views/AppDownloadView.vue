<template>
    <div class="app-page" :class="{ 'light-theme': isLight }">
        <div class="container">
            <!-- Hero -->
            <section class="card hero">
                <div class="app-icon">
                    <svg viewBox="0 0 108 108" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Иконка приложения">
                        <defs>
                            <linearGradient id="appgrad" x1="0" y1="108" x2="108" y2="0" gradientUnits="userSpaceOnUse">
                                <stop offset="0" stop-color="#0B6DAC" />
                                <stop offset="1" stop-color="#21BADC" />
                            </linearGradient>
                        </defs>
                        <rect width="108" height="108" rx="26" fill="url(#appgrad)" />
                        <path d="M39,36 H69 C75.63,36 81,41.37 81,48 V70 C81,76.63 75.63,82 69,82 H39 C32.37,82 27,76.63 27,70 V48 C27,41.37 32.37,36 39,36 Z" fill="none" stroke="#fff" stroke-width="5" />
                        <path d="M44,24 A4,4 0 0 1 48,28 V36 A4,4 0 0 1 44,40 A4,4 0 0 1 40,36 V28 A4,4 0 0 1 44,24 Z" fill="#fff" />
                        <path d="M64,24 A4,4 0 0 1 68,28 V36 A4,4 0 0 1 64,40 A4,4 0 0 1 60,36 V28 A4,4 0 0 1 64,24 Z" fill="#fff" />
                        <path d="M30,50 H78" stroke="#fff" stroke-width="5" stroke-linecap="round" />
                        <path d="M38,65 L47,74 L68,53" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>

                <h1>Моё Расписание</h1>
                <p class="tagline">Расписание занятий ТКПСТ — теперь и на Android</p>

                <a class="download-btn" :href="apkUrl" download>
                    <i class="ri-android-line"></i>
                    Скачать APK
                </a>

                <p class="meta">Android 7.0+ · версия 1.1.0 · бесплатно, без рекламы</p>
                <p class="meta">
                    Прямая ссылка:
                    <a :href="apkUrl">vstor-tech.ru/static/my-schedules.apk</a>
                </p>

                <div v-if="isIOS" class="note">
                    <i class="ri-error-warning-line"></i>
                    Приложение доступно только для Android — на iPhone установить не получится.
                </div>
            </section>

            <!-- QR -->
            <section v-if="!qrFailed" class="card qr">
                <img :src="qrUrl" alt="QR-код на эту страницу" @error="qrFailed = true" />
                <div class="qr-text">
                    <h2>Открыть на телефоне</h2>
                    <p>Наведи камеру на код — откроется эта страница, останется нажать «Скачать APK».</p>
                </div>
            </section>

            <!-- Features -->
            <h2 class="section-title">Что умеет приложение</h2>
            <section class="features">
                <div v-for="f in features" :key="f.title" class="feature">
                    <div class="feature-icon"><i :class="f.icon"></i></div>
                    <h3>{{ f.title }}</h3>
                    <p>{{ f.text }}</p>
                </div>
            </section>

            <!-- Steps -->
            <section class="card steps">
                <h2>Как установить</h2>
                <ol class="step-list">
                    <li class="step">
                        <span class="step-num">1</span>
                        <p>Нажми «Скачать APK» и дождись загрузки файла.</p>
                    </li>
                    <li class="step">
                        <span class="step-num">2</span>
                        <p>Открой скачанный файл (через шторку уведомлений или папку «Загрузки»).</p>
                    </li>
                    <li class="step">
                        <span class="step-num">3</span>
                        <div>
                            <p>Разреши установку, если Android спросит про «неизвестные источники».</p>
                            <p class="hint">
                                Play Protect может предупредить о неизвестном приложении — это нормально для APK
                                вне Play Маркета. Нажми «Подробнее» → «Всё равно установить».
                            </p>
                        </div>
                    </li>
                    <li class="step">
                        <span class="step-num">4</span>
                        <p>Открой приложение, выбери сервер, колледж, корпус и группу — расписание готово.</p>
                    </li>
                </ol>
            </section>

            <footer class="page-footer">
                <router-link to="/"><i class="ri-arrow-left-line"></i> Веб-версия</router-link>
                <span class="divider">•</span>
                <a href="https://storozhiloff.ru" target="_blank" rel="noopener">Разработчик</a>
                <span class="divider">•</span>
                <a href="https://github.com/ThisIsHyum/OpenScheduleApi" target="_blank" rel="noopener">OpenScheduleApi</a>
            </footer>
        </div>
    </div>
</template>

<script>
import { useTheme } from "../composables/useTheme.js";

export default {
    name: "AppDownloadView",
    setup() {
        const { isLight } = useTheme();
        return { isLight };
    },
    data() {
        return {
            apkUrl: "https://vstor-tech.ru/static/my-schedules.apk",
            qrUrl:
                "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fvstor-tech.ru%2Fapp",
            qrFailed: false,
            isIOS:
                /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
                (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
            originalTitle: document.title,
            features: [
                { icon: "ri-calendar-2-line", title: "Календарь пар", text: "Масштаб дня, недели и месяца — как на сайте, только быстрее." },
                { icon: "ri-notification-3-line", title: "Уведомления", text: "Напомнит за несколько минут до пары и до начала занятий." },
                { icon: "ri-palette-line", title: "Темы оформления", text: "Тёмная, светлая и Material You — цвета из обоев Android 12+." },
                { icon: "ri-time-line", title: "Классные часы", text: "КЧ по понедельникам, окна и большие перемены между парами." },
                { icon: "ri-play-circle-line", title: "Что идёт сейчас", text: "Текущая пара подсвечена с прогрессом, прошедшие — приглушены." },
                { icon: "ri-wifi-off-line", title: "Работает офлайн", text: "Загруженное расписание доступно без интернета." },
            ],
        };
    },
    mounted() {
        document.title = "Моё Расписание — скачать приложение";
    },
    beforeUnmount() {
        document.title = this.originalTitle;
    },
};
</script>

<style scoped>
.app-page {
    --muted: #94a3b8;
    --accent: #21badc;
    --accent-soft: rgba(11, 109, 172, 0.14);
    min-height: 100vh;
    padding: 40px 20px 60px;
    line-height: 1.5;
    background: radial-gradient(900px 480px at 50% -220px, rgba(33, 186, 220, 0.16), transparent 70%);
}

.app-page.light-theme {
    --muted: #64748b;
    --accent: #0b6dac;
    --accent-soft: rgba(11, 109, 172, 0.08);
}

.container {
    max-width: 720px;
    margin: 0 auto;
}

.card {
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
    margin-bottom: 24px;
    animation: fadeUp 0.5s ease both;
}

.app-page.light-theme .card {
    background: #ffffff;
    border-color: #e6e6e6;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

/* ---------- Hero ---------- */
.hero {
    padding: 48px 28px 40px;
    text-align: center;
}

.app-icon {
    width: 96px;
    height: 96px;
    margin: 0 auto 20px;
    filter: drop-shadow(0 10px 20px rgba(11, 109, 172, 0.35));
}

.app-icon svg {
    width: 100%;
    height: 100%;
    display: block;
}

h1 {
    font-size: 2.2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0;
    background: linear-gradient(135deg, #0b6dac, #21badc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.tagline {
    color: var(--muted);
    font-size: 1.05rem;
    margin: 8px 0 28px;
}

.download-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 36px;
    border-radius: 16px;
    font-size: 1.15rem;
    font-weight: 700;
    text-decoration: none;
    color: #fff;
    background: linear-gradient(135deg, #0b6dac, #21badc);
    box-shadow: 0 8px 20px rgba(11, 109, 172, 0.35);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.download-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(11, 109, 172, 0.45);
}

.download-btn:active {
    transform: scale(0.97);
}

.download-btn i {
    font-size: 1.4rem;
}

.meta {
    margin-top: 14px;
    font-size: 0.9rem;
    color: var(--muted);
}

.meta a {
    color: var(--accent);
    text-decoration: none;
}

.meta a:hover {
    text-decoration: underline;
}

.note {
    margin: 22px auto 0;
    max-width: 430px;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 0.9rem;
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.3);
    color: #f59e0b;
}

.app-page.light-theme .note {
    color: #d97706;
}

/* ---------- QR ---------- */
.qr {
    padding: 24px 28px;
    display: flex;
    align-items: center;
    gap: 24px;
    animation-delay: 0.06s;
}

.qr img {
    width: 150px;
    height: 150px;
    border-radius: 16px;
    background: #fff;
    padding: 10px;
    flex-shrink: 0;
}

.qr-text h2 {
    font-size: 1.1rem;
    margin: 0 0 6px;
}

.qr-text p {
    color: var(--muted);
    font-size: 0.9rem;
    margin: 0;
}

/* ---------- Features ---------- */
.section-title {
    text-align: center;
    font-size: 1.3rem;
    font-weight: 700;
    margin: 8px 0 20px;
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.feature {
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 18px;
    padding: 22px 20px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
    animation: fadeUp 0.5s ease both;
}

.app-page.light-theme .feature {
    background: #ffffff;
    border-color: #e6e6e6;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.feature-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    background: var(--accent-soft);
    color: var(--accent);
    margin-bottom: 14px;
}

.feature h3 {
    font-size: 1rem;
    margin: 0 0 6px;
}

.feature p {
    font-size: 0.85rem;
    color: var(--muted);
    margin: 0;
}

/* ---------- Steps ---------- */
.steps {
    padding: 28px;
    animation-delay: 0.1s;
}

.steps h2 {
    font-size: 1.25rem;
    margin: 0 0 4px;
}

.step-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 18px 0 0;
    padding: 0;
}

.step {
    display: flex;
    gap: 14px;
    align-items: flex-start;
}

.step-num {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    border-radius: 10px;
    background: linear-gradient(135deg, #0b6dac, #21badc);
    color: #fff;
    font-weight: 700;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.step p {
    font-size: 0.95rem;
    margin: 0;
}

.step .hint {
    color: var(--muted);
    font-size: 0.85rem;
    margin-top: 4px;
}

/* ---------- Footer ---------- */
.page-footer {
    text-align: center;
    padding-top: 8px;
}

.page-footer a {
    color: var(--muted);
    text-decoration: none;
    font-size: 0.9rem;
    padding: 8px 12px;
    border-radius: 10px;
    transition: color 0.2s ease;
}

.page-footer a:hover {
    color: var(--accent);
}

.divider {
    color: var(--muted);
    opacity: 0.4;
    margin: 0 4px;
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(16px);
    }
    to {
        opacity: 1;
        transform: none;
    }
}

@media (max-width: 560px) {
    .qr {
        flex-direction: column;
        text-align: center;
    }

    h1 {
        font-size: 1.7rem;
    }
}
</style>
