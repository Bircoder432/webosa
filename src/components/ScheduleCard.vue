<template>
    <div class="schedule-card" :class="{ 'light-theme': isLight }">
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
            <div class="lessons-count">
                {{ lessons.length }}
                {{ pluralize(lessons.length, "пара", "пары", "пар") }}
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
    methods: {
        pluralize(n, one, few, many) {
            if (n % 10 === 1 && n % 100 !== 11) return one;
            if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20))
                return few;
            return many;
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

    /* Темная тема (по умолчанию) */
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

    .group-badge {
        font-size: 1.2rem;
        padding: 10px 16px;
    }
}
</style>
