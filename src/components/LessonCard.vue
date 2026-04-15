<template>
    <div class="lesson-card" :style="{ animationDelay: `${index * 0.05}s` }">
        <div class="lesson-number">
            <span class="prompt">#</span>{{ lesson.order }}
        </div>
        <div class="lesson-content">
            <div class="lesson-time">
                <span class="text-accent">[time]</span>
                {{ lesson.startTime }}–{{ lesson.endTime }}
            </div>
            <div class="subject">{{ lesson.title }}</div>
            <div class="meta">
                <span class="meta-item"
                    ><span class="text-muted">cabinet:</span>
                    {{ lesson.cabinet }}</span
                >
                <span class="meta-divider">|</span>
                <span class="meta-item"
                    ><span class="text-muted">teacher:</span>
                    {{ lesson.teacher }}</span
                >
            </div>
        </div>
    </div>
</template>

<style scoped>
.lesson-card {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid var(--border);
    background: var(--bg-card);
    animation: slideIn 0.2s ease forwards;
    opacity: 0;
    transform: translateY(5px);
    transition: border-color var(--transition-fast);
    font-family: var(--font-mono);
}
.lesson-card:hover {
    border-color: var(--accent);
}
.lesson-number {
    flex-shrink: 0;
    min-width: 3rem;
    padding: 0.5rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    text-align: center;
    font-weight: 400;
    color: var(--accent);
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
.lesson-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.time-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--text-secondary);
    text-transform: lowercase;
}
.time-badge::before {
    content: "[time]";
    color: var(--accent);
    margin-right: 0.25rem;
}
.subject {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.4;
    color: var(--text-primary);
}
.meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    font-size: 0.8rem;
    color: var(--text-secondary);
}
.meta-item {
    display: flex;
    align-items: center;
    gap: 0.35rem;
}
.meta-item .meta-icon {
    opacity: 0.7;
    font-size: 0.9rem;
}
.meta-item.cabinet::before {
    content: "cabinet:";
    color: var(--accent);
    text-transform: lowercase;
    margin-right: 0.25rem;
}
.meta-item.teacher::before {
    content: "teacher:";
    color: var(--accent);
    text-transform: lowercase;
    margin-right: 0.25rem;
}
@keyframes slideIn {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

<script>
export default {
    name: "LessonCard",
    props: {
        lesson: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            isLight: document.body.classList.contains("light"),
        };
    },
    mounted() {
        // Слушаем изменения темы
        this.themeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    this.isLight = document.body.classList.contains("light");
                }
            });
        });

        this.themeObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"],
        });
    },
    beforeUnmount() {
        if (this.themeObserver) {
            this.themeObserver.disconnect();
        }
    },
};
</script>
