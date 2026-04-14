<template>
    <div
        class="custom-datepicker"
        :class="{ active: showCalendar, 'light-theme': isLight }"
        v-click-outside="close"
    >
        <div class="datepicker-trigger" @click="toggle">
            <span>{{ displayDate }}</span>
            <span class="calendar-icon-trigger">📅</span>
        </div>
        <div class="calendar-popup" v-show="showCalendar">
            <div class="calendar-header">
                <button class="nav-btn" @click.stop="prevMonth">‹</button>
                <span class="month-year">{{ currentMonthYear }}</span>
                <button class="nav-btn" @click.stop="nextMonth">›</button>
            </div>
            <div class="calendar-weekdays">
                <span v-for="day in weekdays" :key="day">{{ day }}</span>
            </div>
            <div class="calendar-days">
                <button
                    v-for="date in calendarDays"
                    :key="date.key"
                    class="day-btn"
                    :class="{
                        other: date.otherMonth,
                        today: date.isToday,
                        selected: date.isSelected,
                        weekend: date.isWeekend,
                    }"
                    @click.stop="selectDate(date)"
                >
                    {{ date.day }}
                </button>
            </div>
            <div class="calendar-footer">
                <button class="today-btn" @click.stop="selectToday">
                    Сегодня
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import clickOutside from "../directives/clickOutside.js";

export default {
    name: "CustomDatepicker",
    directives: {
        "click-outside": clickOutside,
    },
    props: {
        modelValue: {
            type: String,
            default: () => {
                const now = new Date();
                const y = now.getFullYear();
                const m = String(now.getMonth() + 1).padStart(2, "0");
                const d = String(now.getDate()).padStart(2, "0");
                return `${y}-${m}-${d}`;
            },
        },
    },
    emits: ["update:modelValue"],
    data() {
        return {
            showCalendar: false,
            weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
            months: [
                "Январь",
                "Февраль",
                "Март",
                "Апрель",
                "Май",
                "Июнь",
                "Июль",
                "Август",
                "Сентябрь",
                "Октябрь",
                "Ноябрь",
                "Декабрь",
            ],
            isLight: document.body.classList.contains("light"),
        };
    },
    computed: {
        currentCalendarDate() {
            return this.parseDate(this.modelValue);
        },
        displayDate() {
            const today = this.formatDateLocal(new Date());

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = this.formatDateLocal(tomorrow);

            if (this.modelValue === today) return "Сегодня";
            if (this.modelValue === tomorrowStr) return "Завтра";

            if (!this.modelValue) return "";
            const [y, m, d] = this.modelValue.split("-");
            return `${d}.${m}.${y}`;
        },
        currentMonthYear() {
            const d = this.currentCalendarDate;
            return `${this.months[d.getMonth()]} ${d.getFullYear()}`;
        },
        calendarDays() {
            const currentDate = this.currentCalendarDate;
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();

            const firstDay = new Date(year, month, 1, 12, 0, 0);
            const lastDay = new Date(year, month + 1, 0, 12, 0, 0);
            const daysInMonth = lastDay.getDate();

            const startDayOfWeek = (firstDay.getDay() + 6) % 7;

            const days = [];
            const selected = this.parseDate(this.modelValue);

            // Previous month days
            const prevMonthLastDay = new Date(
                year,
                month,
                0,
                12,
                0,
                0,
            ).getDate();
            for (let i = startDayOfWeek - 1; i >= 0; i--) {
                const day = prevMonthLastDay - i;
                days.push({
                    key: `prev-${day}`,
                    day,
                    otherMonth: true,
                    isToday: false,
                    isSelected: false,
                    isWeekend: false,
                    date: new Date(year, month - 1, day, 12, 0, 0),
                });
            }

            // Current month days
            const today = new Date();

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day, 12, 0, 0);
                const dayOfWeek = date.getDay();

                const isToday = this.isSameDay(date, today);
                const isSelected = this.isSameDay(date, selected);

                days.push({
                    key: `curr-${day}`,
                    day,
                    otherMonth: false,
                    isToday,
                    isSelected,
                    isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
                    date,
                });
            }

            // Next month days
            const remainingCells = 42 - days.length;
            for (let day = 1; day <= remainingCells; day++) {
                days.push({
                    key: `next-${day}`,
                    day,
                    otherMonth: true,
                    isToday: false,
                    isSelected: false,
                    isWeekend: false,
                    date: new Date(year, month + 1, day, 12, 0, 0),
                });
            }

            return days;
        },
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
        // ИСПРАВЛЕНИЕ: Парсим дату с полуднем
        parseDate(dateStr) {
            if (!dateStr) return new Date();
            const [y, m, d] = dateStr.split("-").map(Number);
            return new Date(y, m - 1, d, 12, 0, 0);
        },
        // ИСПРАВЛЕНИЕ: Форматируем дату из локального времени
        formatDateLocal(date) {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, "0");
            const d = String(date.getDate()).padStart(2, "0");
            return `${y}-${m}-${d}`;
        },
        isSameDay(d1, d2) {
            return (
                d1.getDate() === d2.getDate() &&
                d1.getMonth() === d2.getMonth() &&
                d1.getFullYear() === d2.getFullYear()
            );
        },
        toggle() {
            this.showCalendar = !this.showCalendar;
        },
        close() {
            this.showCalendar = false;
        },
        prevMonth() {
            const d = this.currentCalendarDate;
            const newDate = new Date(
                d.getFullYear(),
                d.getMonth() - 1,
                1,
                12,
                0,
                0,
            );
            this.$emit("update:modelValue", this.formatDateLocal(newDate));
        },
        nextMonth() {
            const d = this.currentCalendarDate;
            const newDate = new Date(
                d.getFullYear(),
                d.getMonth() + 1,
                1,
                12,
                0,
                0,
            );
            this.$emit("update:modelValue", this.formatDateLocal(newDate));
        },
        // ИСПРАВЛЕНИЕ: Используем date с полуднем
        selectDate(dateInfo) {
            const d = dateInfo.date;
            // Убедимся что время 12:00
            const fixedDate = new Date(
                d.getFullYear(),
                d.getMonth(),
                d.getDate(),
                12,
                0,
                0,
            );
            const dateStr = this.formatDateLocal(fixedDate);
            this.$emit("update:modelValue", dateStr);
            this.showCalendar = false;
        },
        // ИСПРАВЛЕНИЕ: Сегодня с полуднем
        selectToday() {
            const now = new Date();
            const today = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                12,
                0,
                0,
            );
            const todayStr = this.formatDateLocal(today);
            this.$emit("update:modelValue", todayStr);
            this.showCalendar = false;
        },
    },
};
</script>
<style scoped>
.custom-datepicker {
    position: relative;
}

.datepicker-trigger {
    width: 100%;
    padding: 12px 40px 12px 14px;
    border-radius: 12px;
    border: 2px solid transparent;
    font-size: 0.95rem;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;

    /* Темная тема */
    background: #0f172a;
    color: #f1f5f9;
    border-color: rgba(255, 255, 255, 0.1);
}

/* Светлая тема */
.light-theme .datepicker-trigger {
    background: #ffffff;
    color: #1e293b;
    border-color: rgba(0, 0, 0, 0.08);
}

.datepicker-trigger:hover {
    border-color: #818cf8;
}

.custom-datepicker.active .datepicker-trigger {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.calendar-icon-trigger {
    font-size: 1rem;
}

.calendar-popup {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 320px;
    border-radius: 16px;
    z-index: 9999;
    animation: dropdownSlide 0.2s ease;
    overflow: hidden;

    /* Темная тема */
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow:
        0 20px 25px -5px rgba(0, 0, 0, 0.3),
        0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

/* Светлая тема */
.light-theme .calendar-popup {
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow:
        0 20px 25px -5px rgba(0, 0, 0, 0.15),
        0 10px 10px -5px rgba(0, 0, 0, 0.1);
}

.calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.light-theme .calendar-header {
    border-bottom-color: rgba(0, 0, 0, 0.08);
}

.nav-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    color: #94a3b8;
}

.light-theme .nav-btn {
    color: #64748b;
}

.nav-btn:hover {
    background: #6366f1;
    color: white;
}

.month-year {
    font-weight: 600;
    font-size: 1rem;
    color: #f1f5f9;
}

.light-theme .month-year {
    color: #1e293b;
}

.calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    padding: 12px 16px 8px;
    text-align: center;
}

.calendar-weekdays span {
    font-size: 0.75rem;
    font-weight: 600;
    opacity: 0.6;
    color: #94a3b8;
}

.light-theme .calendar-weekdays span {
    color: #64748b;
}

.calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    padding: 0 16px 16px;
}

.day-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 0.9rem;
    font-family: inherit;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f1f5f9;
}

.light-theme .day-btn {
    color: #1e293b;
}

.day-btn:hover:not(.other) {
    background: #6366f1;
    color: white;
}

.day-btn.other {
    opacity: 0.3;
    cursor: default;
}

.day-btn.today {
    border: 2px solid #6366f1;
    font-weight: 600;
}

.day-btn.selected {
    background: linear-gradient(135deg, #6366f1, #818cf8);
    color: white;
    font-weight: 600;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.day-btn.weekend:not(.selected) {
    color: #ef4444;
    opacity: 0.8;
}

.calendar-footer {
    padding: 12px 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: center;
}

.light-theme .calendar-footer {
    border-top-color: rgba(0, 0, 0, 0.08);
}

.today-btn {
    padding: 8px 20px;
    border-radius: 8px;
    border: none;
    background: #6366f1;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.today-btn:hover {
    background: #4f46e5;
    transform: translateY(-1px);
}

@keyframes dropdownSlide {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 600px) {
    .calendar-popup {
        width: 280px;
        left: 50%;
        transform: translateX(-50%);
    }

    .day-btn {
        width: 32px;
        height: 32px;
        font-size: 0.85rem;
    }
}
</style>
