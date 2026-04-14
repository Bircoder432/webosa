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
    background: rgba(99, 102, 241, 0.1);
    color: #818cf8;
    border: 1px solid rgba(99, 102, 241, 0.2);
}

/* Светлая тема */
.footer-link.light-theme {
    background: rgba(99, 102, 241, 0.08);
    color: #4f46e5;
    border: 1px solid rgba(99, 102, 241, 0.15);
}

/* Убираем фиолетовый цвет посещенных ссылок */
.footer-link:visited {
    color: #818cf8;
}

.footer-link.light-theme:visited {
    color: #4f46e5;
}

.footer-link:hover {
    background: rgba(99, 102, 241, 0.25);
    color: #a5b4fc;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.footer-link.light-theme:hover {
    background: rgba(99, 102, 241, 0.2);
    color: #6366f1;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
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
