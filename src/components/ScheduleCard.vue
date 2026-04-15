<template>
    <div
        class="schedule-card"
        :class="{ 'light-theme': isLight }"
        ref="scheduleCard"
    >
        <div class="schedule-header">
            <div class="schedule-info">
                <h2>
                    <span class="group-badge">👥 {{ groupName }}</span>
                </h2>
                <div class="date-badge">
                    <span class="calendar-icon">📆</span>
                    {{ date }}
                </div>
            </div>
            <div class="header-actions">
                <div class="lessons-count">
                    {{ lessons.length }}
                    {{ pluralize(lessons.length, "пара", "пары", "пар") }}
                </div>
                <button
                    class="export-btn"
                    @click="exportToImage"
                    title="Сохранить как картинку"
                >
                    <span>💾</span>
                </button>
            </div>
        </div>

        <div class="schedule-timeline">
            <LessonCard
                v-for="(lesson, index) in lessons"
                :key="lesson.order"
                :lesson="lesson"
                :index="index"
            />
        </div>
    </div>
</template>

<script>
import LessonCard from "./LessonCard.vue";
import html2canvas from "html2canvas";

export default {
    name: "ScheduleCard",
    components: {
        LessonCard,
    },
    props: {
        lessons: {
            type: Array,
            required: true,
        },
        groupName: {
            type: String,
            default: "",
        },
        date: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            isLight: document.body.classList.contains("light"),
        };
    },
    mounted() {
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
    methods: {
        pluralize(n, one, few, many) {
            if (n % 10 === 1 && n % 100 !== 11) return one;
            if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20))
                return few;
            return many;
        },
        async exportToImage() {
            const element = this.$refs.scheduleCard;
            if (!element) return;

            try {
                // Показываем loader
                const btn = element.querySelector(".export-btn");
                const originalText = btn.innerHTML;
                btn.innerHTML = "<span>⏳</span>";
                btn.disabled = true;

                // ИСПРАВЛЕНИЕ: Ждем полной отрисовки всех анимаций
                // Анимация slideIn длится 0.5s, плюс задержки между карточками
                const lastIndex = this.lessons.length - 1;
                const totalAnimationTime = 500 + lastIndex * 100 + 200; // 200ms запас

                await new Promise((resolve) =>
                    setTimeout(resolve, totalAnimationTime),
                );

                // Дополнительно форсируем стили для финального состояния анимаций
                const lessonCards = element.querySelectorAll(".lesson-card");
                lessonCards.forEach((card, index) => {
                    card.style.animation = "none";
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0)";
                });

                const canvas = await html2canvas(element, {
                    backgroundColor: this.isLight ? "#ffffff" : "#1e293b",
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    logging: false,
                    onclone: (clonedDoc) => {
                        // Убираем кнопку экспорта
                        const exportBtn =
                            clonedDoc.querySelector(".export-btn");
                        if (exportBtn) {
                            exportBtn.style.display = "none";
                        }

                        // ИСПРАВЛЕНИЕ: Принудительно устанавливаем финальное состояние анимаций
                        const cards =
                            clonedDoc.querySelectorAll(".lesson-card");
                        cards.forEach((card) => {
                            card.style.animation = "none";
                            card.style.opacity = "1";
                            card.style.transform = "translateY(0)";
                            card.style.boxShadow = "none";
                        });
                    },
                });

                // Скачиваем
                const link = document.createElement("a");
                const fileName = `расписание_${this.groupName}_${this.date.replace(/\./g, "-")}.png`;
                link.download = fileName;
                link.href = canvas.toDataURL("image/png");
                link.click();

                // Восстанавливаем кнопку
                btn.innerHTML = originalText;
                btn.disabled = false;
            } catch (error) {
                console.error("Ошибка экспорта:", error);
                alert("Не удалось сохранить расписание");
            }
        },
    },
};
</script>

<style scoped>
.schedule-card {
    border: 1px solid var(--border);
    background: var(--bg-card);
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    position: relative;
    font-family: var(--font-mono);
}
.schedule-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
}
.schedule-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.schedule-info h2 {
    margin: 0;
}
.group-badge {
    font-size: 1.1rem;
    font-weight: 400;
    color: var(--text-primary);
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}
.group-badge::before {
    content: "[group]";
    color: var(--accent);
    text-transform: lowercase;
    font-size: 0.85rem;
    margin-right: 0.35rem;
}
.date-badge {
    font-size: 0.85rem;
    color: var(--text-secondary);
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
}
.date-badge::before {
    content: "[date]";
    color: var(--accent);
    text-transform: lowercase;
    font-size: 0.75rem;
    margin-right: 0.35rem;
}
.header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}
.lessons-count {
    font-size: 0.8rem;
    color: var(--text-secondary);
}
.lessons-count::before {
    content: "[count]";
    color: var(--accent);
    text-transform: lowercase;
    margin-right: 0.25rem;
}
.export-btn {
    width: 32px;
    height: 32px;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    color: var(--text-secondary);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.9rem;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
}
.export-btn:hover:not(:disabled) {
    border-color: var(--accent);
    color: var(--accent);
}
.export-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
.schedule-timeline {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}
</style>
