<template>
    <div
        class="custom-datepicker"
        :class="{ active: showCalendar, 'light-theme': isLight }"
        v-click-outside="close"
    >
        <div class="datepicker-trigger" @click="toggle">
            <span>{{ displayDate }}</span>
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
    font-family: var(--font-mono);
}
.datepicker-trigger {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 0.75rem;
    background: var(--bg-card);
    border: 1px solid var(--border);
    color: var(--text-primary);
    font-family: inherit;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: border-color var(--transition-fast);
}
.datepicker-trigger:hover {
    border-color: var(--accent);
}
.custom-datepicker.active .datepicker-trigger {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent-glow);
}
.calendar-icon-trigger {
    font-size: 1rem;
    color: var(--text-secondary);
    margin-left: 0.25rem;
}
.calendar-popup {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 280px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    z-index: 100;
    animation: dropdownSlide 0.15s ease;
}
.calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    border-bottom: 1px solid var(--border);
    background: var(--bg-secondary);
}
.nav-btn {
    width: 28px;
    height: 28px;
    border: 1px solid var(--border);
    background: var(--bg-card);
    color: var(--text-secondary);
    cursor: pointer;
    font-family: inherit;
    font-size: 1rem;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
}
.nav-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
}
.month-year {
    font-weight: 400;
    font-size: 0.9rem;
    color: var(--text-primary);
    text-transform: lowercase;
}
.calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    padding: 0.5rem 0.75rem;
    text-align: center;
    border-bottom: 1px solid var(--border);
}
.calendar-weekdays span {
    font-size: 0.7rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 400;
}
.calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    padding: 0.5rem 0.75rem;
}
.day-btn {
    width: 32px;
    height: 32px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--text-primary);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.85rem;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
}
.day-btn:hover:not(.other) {
    border-color: var(--accent);
    color: var(--accent);
}
.day-btn.other {
    color: var(--text-secondary);
    opacity: 0.4;
    cursor: default;
}
.day-btn.today {
    border-color: var(--accent);
    position: relative;
}
.day-btn.today::after {
    content: "";
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    background: var(--accent);
}
.day-btn.selected {
    background: var(--accent);
    color: var(--bg-primary);
    font-weight: 400;
}
.day-btn.selected:hover {
    background: var(--accent-dim);
}
.day-btn.weekend:not(.selected) {
    color: var(--warning);
    opacity: 0.9;
}
.calendar-footer {
    padding: 0.5rem 0.75rem;
    border-top: 1px solid var(--border);
    background: var(--bg-secondary);
}
.today-btn {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--border);
    background: var(--bg-card);
    color: var(--text-secondary);
    font-family: inherit;
    font-size: 0.8rem;
    cursor: pointer;
    text-transform: lowercase;
    transition: all var(--transition-fast);
}
.today-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
}
@keyframes dropdownSlide {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
