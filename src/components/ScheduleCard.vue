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
    border-radius: 24px;
    padding: 28px;
    margin-bottom: 24px;
    transition: all 0.3s ease;
    position: relative;

    /* Темная тема */
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.3),
        0 8px 10px -6px rgba(0, 0, 0, 0.2);
}

/* Светлая тема */
.schedule-card.light-theme {
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.1),
        0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.schedule-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    transition: border-color 0.3s ease;
}

.light-theme .schedule-header {
    border-bottom-color: rgba(0, 0, 0, 0.08);
}

.schedule-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.schedule-info h2 {
    margin: 0;
}

/* Крупное и красивое название группы */
.group-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border-radius: 16px;
    font-weight: 700;
    font-size: 1.4rem;
    background: linear-gradient(
        135deg,
        rgba(99, 102, 241, 0.2),
        rgba(129, 140, 248, 0.15)
    );
    color: #818cf8;
    border: 1px solid rgba(99, 102, 241, 0.3);
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.15);
    transition: all 0.3s ease;
}

.light-theme .group-badge {
    background: linear-gradient(
        135deg,
        rgba(99, 102, 241, 0.1),
        rgba(129, 140, 248, 0.08)
    );
    color: #4f46e5;
    border: 1px solid rgba(99, 102, 241, 0.2);
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.1);
}

.date-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #94a3b8;
    transition: color 0.3s ease;
}

.light-theme .date-badge {
    color: #64748b;
}

.calendar-icon {
    font-size: 1rem;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.lessons-count {
    padding: 8px 16px;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 600;
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    transition: all 0.3s ease;
}

.light-theme .lessons-count {
    background: rgba(16, 185, 129, 0.1);
    color: #059669;
}

/* Кнопка экспорта */
.export-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: none;
    background: rgba(99, 102, 241, 0.15);
    color: #818cf8;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: all 0.2s ease;
}

.light-theme .export-btn {
    background: rgba(99, 102, 241, 0.1);
    color: #4f46e5;
}

.export-btn:hover:not(:disabled) {
    background: rgba(99, 102, 241, 0.3);
    transform: scale(1.1);
}

.export-btn:disabled {
    opacity: 0.5;
    cursor: wait;
}

.schedule-timeline {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

@media (max-width: 600px) {
    .schedule-card {
        padding: 20px;
        border-radius: 20px;
    }

    .schedule-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .header-actions {
        width: 100%;
        justify-content: space-between;
    }

    .group-badge {
        font-size: 1.2rem;
        padding: 10px 16px;
    }
}
</style>
