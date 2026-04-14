<template>
    <div
        class="lesson-card"
        :class="{ 'light-theme': isLight }"
        :style="{ animationDelay: `${index * 0.1}s` }"
    >
        <div class="lesson-number">
            <span class="number">{{ lesson.order }}</span>
        </div>

        <div class="lesson-content">
            <div class="lesson-header">
                <div class="time-badge">
                    <span class="clock-icon">🕐</span>
                    {{ lesson.startTime }} – {{ lesson.endTime }}
                </div>
            </div>

            <div class="subject">
                {{ lesson.title }}
            </div>

            <div class="meta">
                <div class="meta-item cabinet">
                    <span class="meta-icon">🚪</span>
                    <span>{{ lesson.cabinet }}</span>
                </div>
                <div class="meta-item teacher">
                    <span class="meta-icon">👤</span>
                    <span>{{ lesson.teacher }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

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

<style scoped>
.lesson-card {
    display: flex;
    gap: 16px;
    padding: 20px;
    border-radius: 16px;
    transition: all 0.3s ease;
    animation: slideIn 0.5s ease forwards;
    opacity: 0;
    transform: translateY(20px);

    /* Темная тема (по умолчанию) */
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Светлая тема */
.lesson-card.light-theme {
    background: #f1f5f9;
    border: 1px solid rgba(0, 0, 0, 0.08);
}

.lesson-card:hover {
    transform: translateX(8px);
    border-color: #6366f1;
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.15);
}

.lesson-number {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #6366f1, #818cf8);
    color: white;
    font-weight: 700;
    font-size: 1.1rem;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.lesson-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.lesson-header {
    display: flex;
    align-items: center;
    gap: 12px;
}

.time-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    background: rgba(99, 102, 241, 0.15);
    color: #818cf8;
}

.light-theme .time-badge {
    background: rgba(99, 102, 241, 0.1);
    color: #4f46e5;
}

.clock-icon {
    font-size: 0.9rem;
}

.subject {
    font-size: 1.15rem;
    font-weight: 700;
    line-height: 1.4;
    color: #f1f5f9;
    transition: color 0.3s ease;
}

.light-theme .subject {
    color: #1e293b;
}

.meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    padding: 6px 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    color: #94a3b8;
    transition: all 0.3s ease;
}

.light-theme .meta-item {
    background: rgba(0, 0, 0, 0.05);
    color: #64748b;
}

.meta-icon {
    font-size: 1rem;
}

@keyframes slideIn {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 600px) {
    .lesson-card {
        flex-direction: column;
        gap: 12px;
    }

    .lesson-number {
        width: 40px;
        height: 40px;
        font-size: 1rem;
    }
}
</style>
