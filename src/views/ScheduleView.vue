<template>
    <div class="container">
        <ThemeToggle :isDark="isDark" @toggle="toggleTheme" />
        <AppHeader />

        <div class="selectors-card" :class="{ 'light-theme': isLight }">
            <!-- Mode Tabs -->
            <div class="mode-tabs" :class="{ 'light-theme': isLight }">
                <button
                    class="mode-tab"
                    :class="{ active: mode === 'group' }"
                    @click="switchMode('group')"
                >
                    <span><i class="ri-group-line"></i></span> По группе
                </button>
                <button
                    class="mode-tab"
                    :class="{ active: mode === 'teacher' }"
                    @click="switchMode('teacher')"
                >
                    <span><i class="ri-user-line"></i></span> По преподавателю
                </button>
            </div>

            <div v-if="mode === 'group'" class="form-grid">
                <div class="form-group">
                    <label>
                        <span class="label-icon"><i class="ri-building-line"></i></span>
                        Корпус
                    </label>
                    <CustomDropdown
                        v-model="selectedCampus"
                        :items="campuses"
                        placeholder="Выберите корпус"
                        labelKey="name"
                        valueKey="campusId"
                        :disabled="!campuses.length"
                        @change="onCampusChange"
                    />
                </div>

                <div class="form-group">
                    <label>
                        <span class="label-icon"><i class="ri-group-line"></i></span>
                        Группа
                    </label>
                    <CustomDropdown
                        v-model="selectedGroup"
                        :items="groups"
                        placeholder="Выберите группу"
                        labelKey="name"
                        valueKey="studentGroupId"
                        :disabled="!groups.length"
                    />
                </div>

                <div class="form-group">
                    <label>
                        <span class="label-icon"><i class="ri-calendar-2-line"></i></span>
                        Дата
                    </label>
                    <CustomDatepicker v-model="selectedDate" />
                </div>
            </div>

            <div v-else class="form-grid">
                <div class="form-group">
                    <label>
                        <span class="label-icon"><i class="ri-user-line"></i></span>
                        Преподаватель
                    </label>
                    <input
                        type="text"
                        class="teacher-input"
                        :class="{ 'light-theme': isLight }"
                        v-model="teacherName"
                        placeholder="Введите фамилию преподавателя"
                        @keydown.enter="loadTeacherSchedule"
                    />
                </div>

                <div class="form-group">
                    <label>
                        <span class="label-icon"><i class="ri-calendar-2-line"></i></span>
                        Дата
                    </label>
                    <CustomDatepicker v-model="selectedDate" />
                </div>
            </div>

            <button
                class="load-btn"
                :disabled="isLoadDisabled"
                @click="mode === 'group' ? loadSchedule() : loadTeacherSchedule()"
                :class="{ loading: isBtnLoading }"
            >
                <span v-if="isBtnLoading" class="spinner"></span>
                <span v-else class="btn-icon"><i class="ri-search-line"></i></span>
                {{ isBtnLoading ? "Загрузка..." : "Показать расписание" }}
            </button>
        </div>

        <template v-if="mode === 'group'">
            <ScheduleCard
                v-if="showSchedule"
                :lessons="schedule"
                :groupName="selectedGroupName"
                :date="formattedDate"
            />
            <EmptyState
                v-else-if="showEmptyState"
                title="Расписание не найдено"
                subtitle="На выбранную дату занятий нет"
            />
            <InitialState
                v-else-if="!selectedGroup && !schedule.length"
            />
        </template>

        <template v-if="mode === 'teacher'">
            <ScheduleCard
                v-if="showTeacherSchedule"
                :lessons="teacherSchedule"
                :groupName="displayTeacherName"
                :date="formattedDate"
            />
            <EmptyState
                v-else-if="showTeacherEmptyState"
                title="Пары не найдены"
                subtitle="На выбранную дату пар у преподавателя нет"
            />
            <InitialState
                v-else-if="!teacherSchedule.length"
                icon="ri-user-line"
                message="Введите фамилию преподавателя и выберите дату для просмотра расписания"
            />
        </template>

        <AppFooter />
    </div>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import { useSchedule } from "../composables/useSchedule.js";
import ThemeToggle from "../components/ThemeToggle.vue";
import AppHeader from "../components/AppHeader.vue";
import CustomDropdown from "../components/CustomDropdown.vue";
import CustomDatepicker from "../components/CustomDatepicker.vue";
import ScheduleCard from "../components/ScheduleCard.vue";
import EmptyState from "../components/EmptyState.vue";
import InitialState from "../components/InitialState.vue";
import AppFooter from "../components/AppFooter.vue";

export default {
    name: "ScheduleView",
    components: {
        ThemeToggle,
        AppHeader,
        CustomDropdown,
        CustomDatepicker,
        ScheduleCard,
        EmptyState,
        InitialState,
        AppFooter,
    },
    setup() {
        const isDark = ref(true);
        const mode = ref("group");

        const {
            campuses,
            groups,
            schedule,
            selectedCampus,
            selectedGroup,
            selectedDate,
            isLoading,
            selectedGroupName,
            formattedDate,
            showSchedule,
            showEmptyState,
            initializeCampuses,
            onCampusChange,
            loadSchedule,
            teacherName,
            displayTeacherName,
            teacherSchedule,
            isTeacherLoading,
            showTeacherSchedule,
            showTeacherEmptyState,
            loadTeacherSchedule,
        } = useSchedule();

        const isLight = computed(() => !isDark.value);

        const isLoadDisabled = computed(() => {
            if (mode.value === "group") {
                return !selectedGroup.value || isLoading.value;
            }
            return !teacherName.value.trim() || isTeacherLoading.value;
        });

        const isBtnLoading = computed(() => {
            return mode.value === "group"
                ? isLoading.value
                : isTeacherLoading.value;
        });

        const applyTheme = (dark) => {
            document.body.classList.remove("dark", "light");
            document.body.classList.add(dark ? "dark" : "light");
            localStorage.setItem("theme", dark ? "dark" : "light");
        };

        const toggleTheme = () => {
            isDark.value = !isDark.value;
            applyTheme(isDark.value);
        };

        const switchMode = (newMode) => {
            mode.value = newMode;
        };

        watch(isDark, (newVal) => {
            applyTheme(newVal);
        });

        onMounted(() => {
            const savedTheme = localStorage.getItem("theme");
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)",
            ).matches;

            isDark.value = savedTheme ? savedTheme === "dark" : prefersDark;
            applyTheme(isDark.value);

            initializeCampuses();

            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    document.dispatchEvent(new CustomEvent("close-dropdowns"));
                }
            });
        });

        return {
            isDark,
            isLight,
            mode,
            switchMode,
            campuses,
            groups,
            schedule,
            selectedCampus,
            selectedGroup,
            selectedDate,
            isLoading,
            isLoadDisabled,
            isBtnLoading,
            selectedGroupName,
            formattedDate,
            showSchedule,
            showEmptyState,
            toggleTheme,
            onCampusChange,
            loadSchedule,
            teacherName,
            displayTeacherName,
            teacherSchedule,
            isTeacherLoading,
            showTeacherSchedule,
            showTeacherEmptyState,
            loadTeacherSchedule,
        };
    },
};
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
    position: relative;
}

.selectors-card {
    border-radius: 24px;
    padding: 28px;
    margin-bottom: 24px;
    position: relative;
    z-index: 100;

    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.3),
        0 8px 10px -6px rgba(0, 0, 0, 0.2);

    transition: all 0.3s ease;
}

.selectors-card.light-theme {
    background: #ffffff;
    border: 1px solid #e6e6e6;
    box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.1),
        0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.mode-tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 24px;
    padding: 5px;
    border-radius: 14px;
    background: rgba(0, 0, 0, 0.25);
}

.mode-tabs.light-theme {
    background: rgba(0, 0, 0, 0.05);
}

.mode-tab {
    flex: 1;
    padding: 12px 20px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    font-family: inherit;
    transition: all 0.3s ease;
    background: transparent;
    color: #94a3b8;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.mode-tabs.light-theme .mode-tab {
    color: #64748b;
}

.mode-tab.active {
    background: linear-gradient(135deg, #0b6dac, #21badc);
    color: white;
    box-shadow: 0 4px 15px rgba(11, 109, 172, 0.3);
}

.mode-tab:hover:not(.active) {
    color: #f1f5f9;
}

.mode-tabs.light-theme .mode-tab:hover:not(.active) {
    color: #1e293b;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

label {
    font-size: 0.875rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #94a3b8;
    transition: color 0.3s ease;
}

.light-theme label {
    color: #64748b;
}

.label-icon {
    font-size: 1rem;
}

.teacher-input {
    width: 100%;
    padding: 12px 14px;
    border-radius: 12px;
    border: 2px solid transparent;
    font-size: 0.95rem;
    font-family: inherit;
    transition: all 0.2s ease;
    background: #0f172a;
    color: #f1f5f9;
    border-color: rgba(255, 255, 255, 0.1);
}

.teacher-input.light-theme {
    background: #ffffff;
    color: #1e293b;
    border-color: #e6e6e6;
}

.teacher-input:focus {
    outline: none;
    border-color: #0b6dac;
    box-shadow: 0 0 0 3px rgba(11, 109, 172, 0.15);
}

.teacher-input::placeholder {
    opacity: 0.6;
}

/* Load Button */
.load-btn {
    width: 100%;
    padding: 14px 24px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    font-family: inherit;
    font-size: 1rem;
    color: white;
    background: linear-gradient(135deg, #0b6dac, #21badc);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    overflow: hidden;
}

.load-btn::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
    );
    transition: left 0.5s ease;
}

.load-btn:hover:not(:disabled)::before {
    left: 100%;
}

.load-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.3),
        0 0 30px rgba(11, 109, 172, 0.25);
}

.load-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    filter: grayscale(0.5);
}

.load-btn.loading {
    cursor: wait;
}

.btn-icon {
    font-size: 1.1rem;
}

.spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 600px) {
    .container {
        padding: 20px 16px;
    }

    .form-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .selectors-card {
        padding: 20px;
        border-radius: 20px;
    }

    .mode-tab {
        padding: 10px 12px;
        font-size: 0.85rem;
    }
}
</style>
