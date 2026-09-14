<template>
    <div
        class="week-view"
        :class="{ 'light-theme': isLight, 'export-mode': exportMode }"
    >
        <Transition name="fade" mode="out-in">
            <div v-if="zoomedDate" key="zoomed" class="zoomed-view">
                <button class="back-btn" @click.stop="zoomOut">
                    <i class="ri-arrow-left-line"></i> Назад к неделе
                </button>
                <ScheduleCard
                    :lessons="zoomedDay.lessons"
                    :groupName="`${getFullDayName(zoomedDay.date)}, ${zoomedDay.formattedDate}`"
                    :date="weekRangeText"
                    :disableAnimation="disableAnimation"
                />
            </div>

            <div
                v-else-if="isMobile && !exportMode && weekSchedule.length"
                key="mobile"
                class="week-card"
                :class="{ 'light-theme': isLight }"
            >
                <div class="week-header">
                    <div class="week-info">
                        <h2>
                            <span class="group-badge">
                                <i class="ri-calendar-line"></i> {{ groupName }}
                            </span>
                        </h2>
                        <div class="week-range">
                            <i class="ri-calendar-2-line"></i> {{ weekRangeText }}
                        </div>
                    </div>
                    <div class="week-actions">
                        <button
                            v-if="!hideExportBtn"
                            class="export-btn"
                            @click="handleWeekExport"
                            title="Сохранить неделю"
                        >
                            <i class="ri-save-line"></i>
                        </button>
                    </div>
                </div>

                <div class="day-pager">
                    <button class="pager-btn" @click="prevDay" title="Предыдущий день">
                        <i class="ri-arrow-left-s-line"></i>
                    </button>
                    <div class="pager-label">
                        <span class="pager-day-name">{{ getFullDayName(currentDay.date) }}</span>
                        <span class="pager-day-date">
                            {{ currentDay.formattedDate }} ·
                            {{ currentDay.lessons.length }}
                            {{ pluralize(currentDay.lessons.length, "пара", "пары", "пар") }}
                        </span>
                    </div>
                    <button class="pager-btn" @click="nextDay" title="Следующий день">
                        <i class="ri-arrow-right-s-line"></i>
                    </button>
                </div>

                <Transition name="day-slide" mode="out-in">
                    <div
                        class="day-column mobile-day"
                        :key="currentDay.date"
                        @click="zoomIn(currentDay.date)"
                    >
                        <div class="day-column-body">
                            <template v-if="currentDay.lessons.length > 0">
                                <template
                                    v-for="(item, idx) in getScheduleWithGaps(currentDay.lessons)"
                                    :key="idx"
                                >
                                    <LessonCard
                                        v-if="item.type === 'lesson'"
                                        :lesson="item.data"
                                        :index="idx"
                                        compact
                                        :disableAnimation="disableAnimation"
                                    />
                                    <div
                                        v-else-if="item.type === 'gap'"
                                        class="break-indicator"
                                        :class="{
                                            'window-indicator': item.gapType === 'window',
                                            'no-animation': disableAnimation,
                                        }"
                                    >
                                        <span class="break-line" :class="{ 'window-line': item.gapType === 'window' }"></span>
                                        <span class="break-text" :class="{ 'window-text': item.gapType === 'window' }">
                                            <i :class="item.icon"></i> {{ item.text }}
                                        </span>
                                        <span class="break-line" :class="{ 'window-line': item.gapType === 'window' }"></span>
                                    </div>
                                </template>
                            </template>
                            <div v-else class="empty-day">
                                <i class="ri-inbox-line"></i>
                                <p>Нет занятий</p>
                            </div>
                        </div>
                    </div>
                </Transition>

                <div class="pager-dots">
                    <span
                        v-for="(d, i) in weekSchedule"
                        :key="d.date"
                        class="dot"
                        :class="{ active: i === mobileDayIndex, 'has-lessons': d.lessons.length > 0 }"
                        @click="mobileDayIndex = i"
                    ></span>
                </div>
            </div>

            <div v-else key="overview" class="week-card" :class="{ 'light-theme': isLight }">
                <div class="week-header">
                    <div class="week-info">
                        <h2>
                            <span class="group-badge">
                                <i class="ri-calendar-line"></i> {{ groupName }}
                            </span>
                        </h2>
                        <div class="week-range">
                            <i class="ri-calendar-2-line"></i> {{ weekRangeText }}
                        </div>
                    </div>
                    <div class="week-actions">
                        <div class="total-count">
                            {{ totalLessonsCount }}
                            {{ pluralize(totalLessonsCount, "пара", "пары", "пар") }} за неделю
                        </div>
                        <button
                            v-if="!hideExportBtn"
                            class="export-btn"
                            @click="handleWeekExport"
                            title="Сохранить неделю"
                        >
                            <i class="ri-save-line"></i>
                        </button>
                    </div>
                </div>

                <div class="days-scroll">
                    <div
                        class="days-row"
                        :style="{
                            gridTemplateColumns: `repeat(${weekSchedule.length}, minmax(200px, 1fr))`,
                        }"
                    >
                        <div
                            v-for="(day, dayIdx) in weekSchedule"
                            :key="day.date"
                            class="day-column"
                            :class="{ 'no-animation': disableAnimation }"
                            :style="{ animationDelay: disableAnimation ? '0s' : `${dayIdx * 0.08}s` }"
                            :title="`Открыть ${getFullDayName(day.date)}`"
                            @click="zoomIn(day.date)"
                        >
                            <div class="day-column-header">
                                <span class="day-name">
                                    {{ getDayName(day.date) }} · {{ day.formattedDate.slice(0, 5) }}
                                </span>
                                <span class="day-count">
                                    {{ day.lessons.length }}
                                    {{ pluralize(day.lessons.length, "пара", "пары", "пар") }}
                                    <i v-if="!exportMode" class="ri-zoom-in-line zoom-hint"></i>
                                </span>
                            </div>

                            <div class="day-column-body">
                                <template v-if="day.lessons.length > 0">
                                    <template
                                        v-for="(item, idx) in getScheduleWithGaps(day.lessons)"
                                        :key="idx"
                                    >
                                        <LessonCard
                                            v-if="item.type === 'lesson'"
                                            :lesson="item.data"
                                            :index="idx"
                                            compact
                                            :disableAnimation="disableAnimation"
                                        />
                                        <div
                                            v-else-if="item.type === 'gap'"
                                            class="break-indicator"
                                            :class="{
                                                'window-indicator': item.gapType === 'window',
                                                'no-animation': disableAnimation,
                                            }"
                                        >
                                            <span class="break-line" :class="{ 'window-line': item.gapType === 'window' }"></span>
                                            <span class="break-text" :class="{ 'window-text': item.gapType === 'window' }">
                                                <i :class="item.icon"></i> {{ item.text }}
                                            </span>
                                            <span class="break-line" :class="{ 'window-line': item.gapType === 'window' }"></span>
                                        </div>
                                    </template>
                                </template>
                                <div v-else class="empty-day">
                                    <i class="ri-inbox-line"></i>
                                    <p>Нет занятий</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script>
import LessonCard from "./LessonCard.vue";
import ScheduleCard from "./ScheduleCard.vue";
import { useExport } from "../composables/useExport.js";
import { useViewport } from "../composables/useViewport.js";

export default {
    name: "WeekGrid",
    components: { LessonCard, ScheduleCard },
    props: {
        weekSchedule: { type: Array, required: true },
        isLight: { type: Boolean, default: false },
        groupName: { type: String, default: "" },
        disableAnimation: { type: Boolean, default: false },
        hideExportBtn: { type: Boolean, default: false },
        exportMode: { type: Boolean, default: false },
    },
    setup(props) {
        const { exportToImage } = useExport();
        const { isMobile } = useViewport();

        const handleWeekExport = async () => {
            const isLight = document.body.classList.contains("light");
            await exportToImage([], props.groupName, "", isLight, true, props.weekSchedule);
        };
        return { handleWeekExport, isMobile };
    },
    data() {
        return {
            zoomedDate: null,
            mobileDayIndex: 0,
        };
    },
    computed: {
        weekRangeText() {
            if (!this.weekSchedule.length) return "";
            const first = this.weekSchedule[0].formattedDate;
            const last = this.weekSchedule[this.weekSchedule.length - 1].formattedDate;
            return `${first} — ${last}`;
        },
        totalLessonsCount() {
            return this.weekSchedule.reduce((s, d) => s + d.lessons.length, 0);
        },
        zoomedDay() {
            return this.weekSchedule.find((d) => d.date === this.zoomedDate);
        },
        currentDay() {
            return (
                this.weekSchedule[this.mobileDayIndex] ||
                this.weekSchedule[0] || { date: "", formattedDate: "", lessons: [] }
            );
        },
    },
    watch: {
        weekSchedule() {
            this.mobileDayIndex = 0;
            this.zoomedDate = null;
        },
    },
    methods: {
        zoomIn(date) { this.zoomedDate = date; },
        zoomOut() { this.zoomedDate = null; },
        prevDay() {
            const len = this.weekSchedule.length;
            this.mobileDayIndex = (this.mobileDayIndex - 1 + len) % len;
        },
        nextDay() {
            this.mobileDayIndex = (this.mobileDayIndex + 1) % this.weekSchedule.length;
        },
        getDayName(dateStr) {
            const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
            const [y, m, d] = dateStr.split("-").map(Number);
            return days[new Date(y, m - 1, d).getDay()];
        },
        getFullDayName(dateStr) {
            const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
            const [y, m, d] = dateStr.split("-").map(Number);
            return days[new Date(y, m - 1, d).getDay()];
        },
        pluralize(n, one, few, many) {
            if (n % 10 === 1 && n % 100 !== 11) return one;
            if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return few;
            return many;
        },
        getScheduleWithGaps(lessons) {
            const result = [];
            const sorted = [...lessons].sort((a, b) => a.order - b.order);
            sorted.forEach((lesson, index) => {
                result.push({ type: "lesson", data: lesson, index });
                if (index < sorted.length - 1) {
                    const next = sorted[index + 1];
                    const dur = this.getBreakDuration(lesson.endTime, next.startTime);
                    if (next.order > lesson.order + 1) {
                        result.push({ type: "gap", gapType: "window", icon: "ri-window-line", text: `Окно — ${dur} мин` });
                    } else if (dur > 10) {
                        result.push({ type: "gap", gapType: "break", icon: "ri-cup-line", text: `Большая перемена — ${dur} мин` });
                    }
                }
            });
            return result;
        },
        getBreakDuration(endTime, startTime) {
            if (!endTime || !startTime) return 0;
            const [eh, em] = endTime.split(":").map(Number);
            const [sh, sm] = startTime.split(":").map(Number);
            let end = eh * 60 + em;
            let start = sh * 60 + sm;
            if (start < end) start += 1440;
            return start - end;
        },
    },
};
</script>

<style scoped>
.week-view { position: relative; }

.week-card {
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 24px;
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

.week-card.light-theme {
    background: #ffffff;
    border-color: #e6e6e6;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.week-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.light-theme .week-header { border-bottom-color: #e6e6e6; }

.week-info h2 { margin: 0; }

.group-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 14px;
    font-weight: 700;
    font-size: 1.15rem;
    background: linear-gradient(135deg, rgba(11, 109, 172, 0.2), rgba(33, 186, 220, 0.15));
    color: #21badc;
    border: 1px solid rgba(11, 109, 172, 0.3);
}

.light-theme .group-badge {
    background: linear-gradient(135deg, rgba(11, 109, 172, 0.1), rgba(33, 186, 220, 0.08));
    color: #0b6dac;
    border-color: rgba(11, 109, 172, 0.2);
}

.week-range {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    color: #94a3b8;
    margin-top: 6px;
}

.light-theme .week-range { color: #64748b; }

.week-actions { display: flex; align-items: center; gap: 10px; }

.total-count {
    padding: 6px 12px;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: 600;
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
}

.light-theme .total-count {
    background: rgba(16, 185, 129, 0.1);
    color: #059669;
}

.export-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: none;
    background: rgba(11, 109, 172, 0.15);
    color: #21badc;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    transition: all 0.2s;
}

.light-theme .export-btn {
    background: rgba(11, 109, 172, 0.1);
    color: #0b6dac;
}

.export-btn:hover {
    background: rgba(11, 109, 172, 0.3);
    transform: scale(1.1);
}

.days-scroll {
    overflow-x: auto;
    padding-bottom: 4px;
}

.days-scroll::-webkit-scrollbar { height: 8px; }
.days-scroll::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}
.days-scroll::-webkit-scrollbar-thumb { background: #0b6dac; border-radius: 4px; }

.days-row {
    display: grid;
    gap: 12px;
}

.day-column {
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 14px;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    opacity: 0;
    transform: translateY(10px);
    animation: slideIn 0.4s ease forwards;
}

.day-column.no-animation {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
}

.light-theme .day-column {
    background: #f8fafc;
    border-color: #e6e6e6;
}

.day-column:hover {
    border-color: #0b6dac;
    box-shadow: 0 8px 25px rgba(11, 109, 172, 0.2);
}

.day-column-header {
    padding: 10px 12px;
    background: rgba(11, 109, 172, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.light-theme .day-column-header {
    background: rgba(11, 109, 172, 0.06);
    border-bottom-color: #e6e6e6;
}

.day-name {
    font-weight: 700;
    font-size: 0.9rem;
    color: #21badc;
    white-space: nowrap;
}

.light-theme .day-name { color: #0b6dac; }

.day-count {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.7rem;
    font-weight: 600;
    color: #10b981;
    white-space: nowrap;
}

.light-theme .day-count { color: #059669; }

.zoom-hint { font-size: 0.8rem; opacity: 0.7; }

.day-column-body {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
}

.empty-day {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 12px;
    opacity: 0.6;
    text-align: center;
}

.empty-day i { font-size: 2rem; margin-bottom: 6px; color: #94a3b8; }
.light-theme .empty-day i { color: #64748b; }
.empty-day p { margin: 0; font-size: 0.8rem; color: #94a3b8; }
.light-theme .empty-day p { color: #64748b; }

.week-view.export-mode .days-scroll {
    overflow: visible;
    padding-bottom: 0;
}

.week-view.export-mode .days-row {
    grid-template-columns: repeat(6, 300px) !important;
}

.week-view.export-mode .day-column { cursor: default; }

.break-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 2px;
    opacity: 0;
    animation: slideIn 0.4s ease forwards;
    animation-delay: 0.1s;
}

.break-indicator.no-animation {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
}

.break-line {
    flex: 1;
    height: 1px;
    background: rgba(16, 185, 129, 0.4);
    border-radius: 2px;
}

.break-text {
    font-size: 0.62rem;
    font-weight: 600;
    color: #10b981;
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 2px 7px;
    border-radius: 8px;
    white-space: nowrap;
}

.light-theme .break-text {
    color: #059669;
    background: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.2);
}

.window-line { background: rgba(245, 158, 11, 0.4) !important; }

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

.day-pager {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
}

.pager-btn {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(11, 109, 172, 0.15);
    color: #21badc;
    font-size: 1.6rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
}

.light-theme .pager-btn {
    background: rgba(11, 109, 172, 0.08);
    color: #0b6dac;
    border-color: #e6e6e6;
}

.pager-btn:active { transform: scale(0.92); }

.pager-label {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.pager-day-name { font-weight: 700; font-size: 1.15rem; color: #21badc; }
.light-theme .pager-day-name { color: #0b6dac; }

.pager-day-date { font-size: 0.82rem; color: #94a3b8; }
.light-theme .pager-day-date { color: #64748b; }

.day-column.mobile-day {
    width: 100%;
    animation: none;
    opacity: 1;
    transform: none;
}

.pager-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 14px;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    cursor: pointer;
    transition: all 0.2s;
}

.light-theme .dot { background: rgba(0, 0, 0, 0.12); }
.dot.has-lessons:not(.active) { background: rgba(16, 185, 129, 0.5); }

.dot.active {
    background: linear-gradient(135deg, #0b6dac, #21badc);
    transform: scale(1.3);
}

.day-slide-enter-active,
.day-slide-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.day-slide-enter-from { opacity: 0; transform: translateX(24px); }
.day-slide-leave-to { opacity: 0; transform: translateX(-24px); }

.zoomed-view { animation: fadeIn 0.3s ease; }

.back-btn {
    margin-bottom: 20px;
    padding: 10px 20px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
    font-weight: 600;
    font-family: inherit;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
}

.light-theme .back-btn {
    border-color: #e6e6e6;
    color: #64748b;
    background: #ffffff;
}

.back-btn:hover { background: rgba(255, 255, 255, 0.05); color: #f1f5f9; }
.light-theme .back-btn:hover { background: rgba(0, 0, 0, 0.05); color: #1e293b; }

@keyframes slideIn {
    to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.98); }
    to { opacity: 1; transform: scale(1); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 600px) {
    .week-card { padding: 14px; }
    .week-header { flex-direction: column; align-items: flex-start; }
}
</style>
