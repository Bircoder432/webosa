<template>
    <aside class="sidebar" :class="{ 'light-theme': isLight, 'is-mobile': isMobile }">
        <div class="sidebar-inner">
            <div class="sidebar-header">
                <h3 class="sidebar-title">
                    <i class="ri-filter-3-line"></i> Фильтры
                </h3>
                <button class="close-btn" @click="$emit('close')" title="Закрыть фильтры">
                    <i class="ri-close-line"></i>
                </button>
            </div>

            <div class="selectors-card" :class="{ 'light-theme': isLight }">
                <div class="mode-switcher" :class="{ 'light-theme': isLight }">
                    <button :class="{ active: !isWeekMode }" @click="$emit('update:isWeekMode', false)">День</button>
                    <button :class="{ active: isWeekMode }" @click="$emit('update:isWeekMode', true)">Неделя</button>
                </div>

                <div class="mode-tabs" :class="{ 'light-theme': isLight }">
                    <button
                        class="mode-tab"
                        :class="{ active: mode === 'group' }"
                        @click="$emit('update:mode', 'group')"
                    >
                        <i class="ri-group-line"></i> По группе
                    </button>
                    <button
                        class="mode-tab"
                        :class="{ active: mode === 'teacher' }"
                        @click="$emit('update:mode', 'teacher')"
                    >
                        <i class="ri-user-line"></i> По преподавателю
                    </button>
                </div>

                <div class="form-grid">
                    <Transition name="mode-fade" mode="out-in">
                        <div v-if="mode === 'group'" key="group-fields" class="fields-wrap">
                            <div class="form-group">
                                <label><i class="ri-building-line label-icon"></i> Корпус</label>
                                <CustomDropdown
                                    :modelValue="selectedCampus"
                                    @update:modelValue="$emit('update:selectedCampus', $event)"
                                    :items="campuses"
                                    placeholder="Выберите корпус"
                                    labelKey="name"
                                    valueKey="campusId"
                                    :disabled="!campuses.length"
                                    @change="$emit('on-campus-change')"
                                />
                            </div>
                            <div class="form-group">
                                <label><i class="ri-group-line label-icon"></i> Группа</label>
                                <CustomDropdown
                                    :modelValue="selectedGroup"
                                    @update:modelValue="$emit('update:selectedGroup', $event)"
                                    :items="groups"
                                    placeholder="Выберите группу"
                                    labelKey="name"
                                    valueKey="studentGroupId"
                                    :disabled="!groups.length"
                                />
                            </div>
                        </div>

                        <div v-else key="teacher-fields" class="fields-wrap">
                            <div class="form-group">
                                <label><i class="ri-user-line label-icon"></i> Преподаватель</label>
                                <input
                                    type="text"
                                    class="text-input"
                                    :class="{ 'light-theme': isLight }"
                                    :value="teacherName"
                                    @input="$emit('update:teacherName', $event.target.value)"
                                    placeholder="Введите фамилию"
                                    @keydown.enter="$emit('load')"
                                />
                            </div>
                        </div>
                    </Transition>

                    <div v-if="!isWeekMode" class="form-group">
                        <label><i class="ri-calendar-2-line label-icon"></i> Дата</label>
                        <CustomDatepicker
                            :modelValue="selectedDate"
                            @update:modelValue="$emit('update:selectedDate', $event)"
                        />
                    </div>
                    <div v-else class="form-group">
                        <label><i class="ri-calendar-2-line label-icon"></i> Неделя</label>
                        <div class="week-nav" :class="{ 'light-theme': isLight }">
                            <button class="week-nav-btn" @click="$emit('change-week', -1)" title="Предыдущая неделя">‹</button>
                            <span class="week-nav-text">{{ weekRangeText }}</span>
                            <button class="week-nav-btn" @click="$emit('change-week', 1)" title="Следующая неделя">›</button>
                        </div>
                    </div>
                </div>

                <button
                    class="load-btn"
                    :disabled="isLoadDisabled"
                    @click="$emit('load')"
                    :class="{ loading: isBtnLoading }"
                >
                    <span v-if="isBtnLoading" class="spinner"></span>
                    <i v-else class="ri-search-line btn-icon"></i>
                    {{ isBtnLoading ? "Загрузка..." : "Показать расписание" }}
                </button>
            </div>
        </div>
    </aside>
</template>

<script>
import CustomDropdown from "./CustomDropdown.vue";
import CustomDatepicker from "./CustomDatepicker.vue";

export default {
    name: "ScheduleSidebar",
    components: { CustomDropdown, CustomDatepicker },
    props: [
        "mode", "isWeekMode", "campuses", "groups", "selectedCampus", "selectedGroup",
        "selectedDate", "isLoading", "teacherName", "isLight", "isMobile",
        "isLoadDisabled", "isBtnLoading", "weekStartDate",
    ],
    emits: [
        "update:mode", "update:isWeekMode", "update:selectedCampus", "on-campus-change",
        "update:selectedGroup", "update:selectedDate", "update:teacherName",
        "load", "change-week", "close",
    ],
    computed: {
        weekRangeText() {
            const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
            const start = new Date(this.weekStartDate);
            const end = new Date(start);
            end.setDate(start.getDate() + 5);
            return `${start.getDate()} ${months[start.getMonth()]} — ${end.getDate()} ${months[end.getMonth()]}`;
        },
    },
};
</script>

<style scoped>
.sidebar {
    width: 440px;
    flex-shrink: 0;
    padding: 24px;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 100;
}

.sidebar-inner {
    position: sticky;
    top: 24px;
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.sidebar-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.light-theme .sidebar-title { color: #1e293b; }

.close-btn {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    transition: all 0.2s;
}

.light-theme .close-btn {
    border-color: #e6e6e6;
    background: rgba(0, 0, 0, 0.03);
    color: #64748b;
}

.close-btn:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.3);
    color: #ef4444;
    transform: scale(1.05);
}

.selectors-card {
    border-radius: 20px;
    padding: 24px;
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

.selectors-card.light-theme {
    background: #ffffff;
    border-color: #e6e6e6;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
}

.mode-switcher {
    display: flex;
    gap: 4px;
    margin-bottom: 16px;
    padding: 4px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.25);
}

.mode-switcher.light-theme { background: rgba(0, 0, 0, 0.05); }

.mode-switcher button {
    flex: 1;
    padding: 10px;
    border: none;
    background: transparent;
    color: #94a3b8;
    font-weight: 600;
    font-size: 0.9rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.mode-switcher.light-theme button { color: #64748b; }

.mode-switcher button.active {
    background: linear-gradient(135deg, #0b6dac, #21badc);
    color: white;
    box-shadow: 0 2px 10px rgba(11, 109, 172, 0.3);
}

.mode-tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 20px;
    padding: 5px;
    border-radius: 14px;
    background: rgba(0, 0, 0, 0.25);
}

.mode-tabs.light-theme { background: rgba(0, 0, 0, 0.05); }

.mode-tab {
    flex: 1;
    padding: 12px 16px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    background: transparent;
    color: #94a3b8;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.25s ease;
}

.mode-tabs.light-theme .mode-tab { color: #64748b; }

.mode-tab:hover:not(.active) {
    color: #f1f5f9;
    background: rgba(255, 255, 255, 0.05);
}

.mode-tabs.light-theme .mode-tab:hover:not(.active) {
    color: #1e293b;
    background: rgba(0, 0, 0, 0.03);
}

.mode-tab.active {
    background: linear-gradient(135deg, #0b6dac, #21badc) !important;
    color: #ffffff !important;
    box-shadow: 0 4px 15px rgba(11, 109, 172, 0.3);
}

.form-grid {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-bottom: 20px;
}

.fields-wrap {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

label {
    font-size: 0.85rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #94a3b8;
}

.light-theme label { color: #64748b; }

.label-icon { font-size: 1rem; }

.week-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #0f172a;
    padding: 8px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.week-nav.light-theme {
    background: #f8fafc;
    border-color: #e6e6e6;
}

.week-nav-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: #f1f5f9;
    cursor: pointer;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
}

.week-nav.light-theme .week-nav-btn {
    background: rgba(0, 0, 0, 0.05);
    color: #1e293b;
}

.week-nav-btn:hover {
    background: #0b6dac;
    color: white;
}

.week-nav-text {
    font-weight: 600;
    font-size: 0.9rem;
    color: #f1f5f9;
    text-align: center;
}

.week-nav.light-theme .week-nav-text { color: #1e293b; }

.text-input {
    width: 100%;
    padding: 12px 14px;
    border-radius: 12px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    font-size: 0.95rem;
    font-family: inherit;
    background: #0f172a;
    color: #f1f5f9;
    transition: all 0.2s;
}

.text-input.light-theme {
    background: #ffffff;
    color: #1e293b;
    border-color: #e6e6e6;
}

.text-input:focus {
    outline: none;
    border-color: #0b6dac;
    box-shadow: 0 0 0 3px rgba(11, 109, 172, 0.15);
}

.text-input::placeholder { opacity: 0.5; }

.load-btn {
    width: 100%;
    padding: 14px 24px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    font-family: inherit;
    color: white;
    background: linear-gradient(135deg, #0b6dac, #21badc);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s;
}

.load-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(11, 109, 172, 0.35);
}

.load-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-icon { font-size: 1.1rem; }

.spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.mode-fade-enter-active,
.mode-fade-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.mode-fade-enter-from,
.mode-fade-leave-to {
    opacity: 0;
    transform: translateY(8px);
}

.sidebar.is-mobile {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    max-height: 85vh;
    background: #1e293b;
    border-radius: 24px 24px 0 0;
    z-index: 1000;
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
    padding: 20px;
    overflow-y: auto;
}

.sidebar.is-mobile.light-theme { background: #ffffff; }

.sidebar.is-mobile .selectors-card {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
}

.sidebar.is-mobile .sidebar-inner {
    position: static;
}

@media (max-width: 768px) {
    .sidebar:not(.is-mobile) {
        width: 100%;
    }
}
</style>
