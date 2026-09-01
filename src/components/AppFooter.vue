<template>
    <footer>
        <div class="footer-links">
            <a
                href="https://github.com/ThisIsHyum/OpenScheduleApi"
                target="_blank"
                class="footer-link"
                :class="{ 'light-theme': isLight }"
            >
                <span class="link-icon">⚡</span>
                OpenScheduleApi
            </a>
            <span class="divider" :class="{ 'light-theme': isLight }">•</span>
            <a
                href="https://github.com/Bircoder432/webosa"
                target="_blank"
                class="footer-link"
                :class="{ 'light-theme': isLight }"
            >
                <span class="link-icon">💻</span>
                GitHub
            </a>
            <span class="divider" :class="{ 'light-theme': isLight }">•</span>
            <a
                href="https://tkpst.ru"
                target="_blank"
                class="footer-link"
                :class="{ 'light-theme': isLight }"
            >
                <span class="link-icon">🌐</span>
                Сайт ТКПСТ
            </a>
            <span class="divider" :class="{ 'light-theme': isLight }">•</span>
            <a
                href="https://t.me/tkpst_podslushano"
                target="_blank"
                class="footer-link"
                :class="{ 'light-theme': isLight }"
            >
                <span class="link-icon">🗣</span>
                Подслушано ТКПСТ
            </a>
        </div>
    </footer>
</template>

<script>
export default {
    name: "AppFooter",
    computed: {
        isLight() {
            return document.body.classList.contains("light");
        },
    },
};
</script>

<style scoped>
footer {
    text-align: center;
    padding: 20px;
    margin-top: 20px;
}

.footer-links {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
}

.footer-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    padding: 10px 18px;
    border-radius: 12px;

    /* Темная тема */
    background: rgba(11, 109, 172, 0.1);
    color: #21BADC;
    border: 1px solid rgba(11, 109, 172, 0.2);
}

/* Светлая тема */
.footer-link.light-theme {
    background: rgba(11, 109, 172, 0.08);
    color: #0B6DAC;
    border: 1px solid rgba(11, 109, 172, 0.15);
}

/* Убираем фиолетовый цвет посещенных ссылок */
.footer-link:visited {
    color: #21BADC;
}

.footer-link.light-theme:visited {
    color: #0B6DAC;
}

.footer-link:hover {
    background: rgba(11, 109, 172, 0.25);
    color: #0C94C8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(11, 109, 172, 0.2);
}

.footer-link.light-theme:hover {
    background: rgba(11, 109, 172, 0.2);
    color: #084E73;
    box-shadow: 0 4px 12px rgba(11, 109, 172, 0.15);
}

.link-icon {
    font-size: 1rem;
}

.divider {
    opacity: 0.4;
    color: #94a3b8;
}

.divider.light-theme {
    color: #64748b;
}
</style>
