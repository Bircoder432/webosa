<template>
    <div
        class="schedule-card"
        :class="{ 'light-theme': isLight, 'no-animation': disableAnimation }"
        ref="scheduleCard"
    >
        <div class="schedule-header">
            <div class="schedule-info">
                <h2>
                    <span class="group-badge">
                        <i :class="badgeIcon"></i> {{ groupName }}
                    </span>
                </h2>
                <div class="date-badge">
                    <span class="calendar-icon"><i class="ri-calendar-line"></i></span>
                    {{ date }}
                </div>
            </div>
            <div class="header-actions">
                <div class="lessons-count">
                    {{ lessons.length }}
                    {{ pluralize(lessons.length, "пара", "пары", "пар") }}
                </div>
                <button
                    v-if="!hideExportBtn"
                    class="export-btn"
                    @click="handleExport"
                    title="Сохранить как картинку"
                >
                    <span><i class="ri-save-line"></i></span>
                </button>
            </div>
        </div>

        <div class="schedule-timeline">
            <template v-for="(item, idx) in scheduleWithGaps" :key="idx">
                <LessonCard
                    v-if="item.type === 'lesson'"
                    :lesson="item.data"
                    :index="item.index"
                    :disableAnimation="disableAnimation"
                />

                <div
                    v-else-if="item.type === 'gap'"
                    class="break-indicator"
                    :class="{
                        'light-theme': isLight,
                        'window-indicator': item.gapType === 'window',
                        'no-animation': disableAnimation,
                    }"
                >
                    <span class="break-line" :class="{ 'window-line': item.gapType === 'window' }"></span>
                    <span class="break-text" :class="{ 'window-text': item.gapType === 'window' }">
                        <i :class="item.icon" class="break-text-icon"></i>
                        {{ item.text }}
                    </span>
                    <span class="break-line" :class="{ 'window-line': item.gapType === 'window' }"></span>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import LessonCard from "./LessonCard.vue";
import { useExport } from "../composables/useExport.js";

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
        badgeIcon: {
            type: String,
            default: "ri-group-line",
        },
        disableAnimation: {
            type: Boolean,
            default: false,
        },
        hideExportBtn: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const { exportToImage } = useExport();
        const handleExport = async () => {
            const isLight = document.body.classList.contains("light");
            await exportToImage(props.lessons, props.groupName, props.date, isLight);
        };
        return { handleExport };
    },
    data() {
        return {
            isLight: document.body.classList.contains("light"),
        };
    },
    computed: {
        isMonday() {
            if (!this.date) return false;
            const parts = this.date.split('.');
            if (parts.length === 3) {
                const [d, m, y] = parts.map(Number);
                return new Date(y, m - 1, d).getDay() === 1;
            }
            return false;
        },
        scheduleWithGaps() {
            const result = [];
            const sortedLessons = [...this.lessons].sort((a, b) => Number(a.order) - Number(b.order));

            sortedLessons.forEach((lesson, index) => {
                const lessonCopy = { ...lesson };
                const originalOrder = Number(lesson.order);

                if (this.isMonday && (originalOrder === 1 || originalOrder === 5)) {
                    lessonCopy.displayOrder = "КЧ";
                } else if (this.isMonday) {
                    let kchCountBefore = 0;
                    if (originalOrder > 1) kchCountBefore++; // КЧ №1
                    if (originalOrder > 5) kchCountBefore++; // КЧ №5
                    lessonCopy.displayOrder = originalOrder - kchCountBefore;
                } else {
                    lessonCopy.displayOrder = originalOrder;
                }

                result.push({ type: 'lesson', data: lessonCopy, index: index });

                if (index < sortedLessons.length - 1) {
                    const nextLesson = sortedLessons[index + 1];
                    const duration = this.getBreakDuration(lesson.endTime, nextLesson.startTime);

                    if (nextLesson.order > lesson.order + 1) {
                        result.push({
                            type: 'gap',
                            gapType: 'window',
                            icon: 'ri-window-line',
                            text: `Окно — ${duration} мин`
                        });
                    }
                    else if (duration > 10) {
                        result.push({
                            type: 'gap',
                            gapType: 'break',
                            icon: 'ri-cup-line',
                            text: `Большая перемена — ${duration} мин`
                        });
                    }
                }
            });
            return result;
        }
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
        getBreakDuration(endTime, startTime) {
            if (!endTime || !startTime) return 0;

            const [eh, em] = endTime.split(':').map(Number);
            const [sh, sm] = startTime.split(':').map(Number);

            let endMinutes = eh * 60 + em;
            let startMinutes = sh * 60 + sm;

            if (startMinutes < endMinutes) {
                startMinutes += 24 * 60;
            }

            return startMinutes - endMinutes;
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
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.3),
        0 8px 10px -6px rgba(0, 0, 0, 0.2);
}

.schedule-card.light-theme {
    background: #ffffff;
    border: 1px solid #E6E6E6;
    box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.1),
        0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.schedule-card.no-animation {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
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
    border-bottom-color: #E6E6E6;
}

.schedule-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.schedule-info h2 {
    margin: 0;
}

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
        rgba(11, 109, 172, 0.2),
        rgba(33, 186, 220, 0.15)
    );
    color: #21BADC;
    border: 1px solid rgba(11, 109, 172, 0.3);
    box-shadow: 0 4px 15px rgba(11, 109, 172, 0.15);
    transition: all 0.3s ease;
}

.light-theme .group-badge {
    background: linear-gradient(
        135deg,
        rgba(11, 109, 172, 0.1),
        rgba(33, 186, 220, 0.08)
    );
    color: #0B6DAC;
    border: 1px solid rgba(11, 109, 172, 0.2);
    box-shadow: 0 4px 15px rgba(11, 109, 172, 0.1);
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

.export-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: none;
    background: rgba(11, 109, 172, 0.15);
    color: #21BADC;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: all 0.2s ease;
}

.light-theme .export-btn {
    background: rgba(11, 109, 172, 0.1);
    color: #0B6DAC;
}

.export-btn:hover:not(:disabled) {
    background: rgba(11, 109, 172, 0.3);
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

.break-indicator {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: -4px 0;
    padding: 0 16px;
    opacity: 0;
    transform: translateY(10px);
    animation: slideIn 0.5s ease forwards;
    animation-delay: 0.2s;
}

.break-indicator.no-animation {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
}

.break-line {
    flex: 1;
    height: 2px;
    background: rgba(16, 185, 129, 0.4);
    border-radius: 2px;
}

.break-text {
    font-size: 0.8rem;
    font-weight: 600;
    color: #10b981;
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 4px 12px;
    border-radius: 12px;
    white-space: nowrap;
}

.break-text-icon {
    font-size: 1rem;
    margin-right: 4px;
}

.light-theme .break-text {
    color: #059669;
    background: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.2);
}

.window-line {
    background: rgba(245, 158, 11, 0.4) !important;
}

.window-text {
    color: #f59e0b !important;
    background: rgba(245, 158, 11, 0.15) !important;
    border: 1px solid rgba(245, 158, 11, 0.3) !important;
}

.light-theme .window-text {
    color: #d97706 !important;
    background: rgba(245, 158, 11, 0.1) !important;
    border-color: rgba(245, 158, 11, 0.2) !important;
}

@keyframes slideIn {
    to {
        opacity: 1;
        transform: translateY(0);
    }
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

    .break-indicator {
        padding: 0 8px;
    }
}
</style>
