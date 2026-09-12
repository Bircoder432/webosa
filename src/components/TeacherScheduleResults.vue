<template>
    <div class="teacher-results">
        <div
            class="teacher-header"
            :class="{ 'light-theme': isLight }"
            ref="teacherHeader"
        >
            <div class="header-top">
                <h2>
                    <span class="teacher-badge">👨‍🏫 {{ teacherName }}</span>
                </h2>
                <div class="header-actions">
                    <div class="summary-badge">
                        {{ groups.length }}
                        {{ pluralize(groups.length, "группа", "группы", "групп") }}
                        •
                        {{ totalLessons }}
                        {{ pluralize(totalLessons, "пара", "пары", "пар") }}
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
            <div class="date-badge">
                <span class="calendar-icon">📆</span>
                {{ date }}
            </div>
        </div>

        <ScheduleCard
            v-for="group in groups"
            :key="group.groupId"
            :lessons="group.lessons"
            :groupName="group.groupName"
            :date="date"
        />
    </div>
</template>

<script>
import ScheduleCard from "./ScheduleCard.vue";
import html2canvas from "html2canvas";

export default {
    name: "TeacherScheduleResults",
    components: { ScheduleCard },
    props: {
        teacherName: {
            type: String,
            required: true,
        },
        groups: {
            type: Array,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            isLight: document.body.classList.contains("light"),
        };
    },
    computed: {
        totalLessons() {
            return this.groups.reduce(
                (sum, g) => sum + g.lessons.length,
                0,
            );
        },
    },
    mounted() {
        this.themeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    this.isLight =
                        document.body.classList.contains("light");
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
            if (
                n % 10 >= 2 &&
                n % 10 <= 4 &&
                (n % 100 < 10 || n % 100 >= 20)
            )
                return few;
            return many;
        },
        async exportToImage() {
            const element = this.$el;
            if (!element) return;

            try {
                const btn = element.querySelector(".export-btn");
                const originalText = btn.innerHTML;
                btn.innerHTML = "<span>⏳</span>";
                btn.disabled = true;

                // Wait for animations
                const lessonCards =
                    element.querySelectorAll(".lesson-card");
                const lastIndex = lessonCards.length - 1;
                const totalAnimationTime = 500 + lastIndex * 100 + 200;

                await new Promise((resolve) =>
                    setTimeout(resolve, totalAnimationTime),
                );

                lessonCards.forEach((card) => {
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
                        const exportBtn =
                            clonedDoc.querySelector(".export-btn");
                        if (exportBtn) {
                            exportBtn.style.display = "none";
                        }

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

                const link = document.createElement("a");
                const fileName = `расписание_${this.teacherName}_${this.date.replace(/\./g, "-")}.png`;
                link.download = fileName;
                link.href = canvas.toDataURL("image/png");
                link.click();

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
.teacher-header {
    border-radius: 24px;
    padding: 28px;
    margin-bottom: 24px;
    transition: all 0.3s ease;

    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.3),
        0 8px 10px -6px rgba(0, 0, 0, 0.2);
}

.teacher-header.light-theme {
    background: #ffffff;
    border: 1px solid #e6e6e6;
    box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.1),
        0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 12px;
}

.teacher-header h2 {
    margin: 0;
}

.teacher-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border-radius: 16px;
    font-weight: 700;
    font-size: 1.4rem;
    background: linear-gradient(
        135deg,
        rgba(11, 109, 172, 0.2),
        rgba(33, 186, 220, 0.15)
    );
    color: #21badc;
    border: 1px solid rgba(11, 109, 172, 0.3);
    box-shadow: 0 4px 15px rgba(11, 109, 172, 0.15);
    transition: all 0.3s ease;
}

.light-theme .teacher-badge {
    background: linear-gradient(
        135deg,
        rgba(11, 109, 172, 0.1),
        rgba(33, 186, 220, 0.08)
    );
    color: #0b6dac;
    border: 1px solid rgba(11, 109, 172, 0.2);
    box-shadow: 0 4px 15px rgba(11, 109, 172, 0.1);
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.summary-badge {
    padding: 8px 16px;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 600;
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    transition: all 0.3s ease;
}

.light-theme .summary-badge {
    background: rgba(16, 185, 129, 0.1);
    color: #059669;
}

.export-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: none;
    background: rgba(11, 109, 172, 0.15);
    color: #21badc;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: all 0.2s ease;
}

.light-theme .export-btn {
    background: rgba(11, 109, 172, 0.1);
    color: #0b6dac;
}

.export-btn:hover:not(:disabled) {
    background: rgba(11, 109, 172, 0.3);
    transform: scale(1.1);
}

.export-btn:disabled {
    opacity: 0.5;
    cursor: wait;
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

@media (max-width: 600px) {
    .header-top {
        flex-direction: column;
        align-items: flex-start;
    }

    .header-actions {
        width: 100%;
        justify-content: space-between;
    }

    .teacher-badge {
        font-size: 1.2rem;
        padding: 10px 16px;
    }
}
</style>
