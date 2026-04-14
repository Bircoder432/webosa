<template>
    <div class="container">
        <ThemeToggle :isDark="isDark" @toggle="toggleTheme" />
        <AppHeader />

        <!-- Selectors Card -->
        <div class="selectors-card" :class="{ 'light-theme': isLight }">
            <div class="form-grid">
                <!-- College -->
                <div class="form-group">
                    <label>
                        <span class="label-icon">🏛️</span>
                        Колледж
                    </label>
                    <CustomDropdown
                        v-model="selectedCollege"
                        :items="colleges"
                        placeholder="Выберите колледж"
                        labelKey="name"
                        valueKey="collegeId"
                        @change="onCollegeChange"
                    />
                </div>

                <!-- Campus -->
                <div class="form-group">
                    <label>
                        <span class="label-icon">🏢</span>
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

                <!-- Group -->
                <div class="form-group">
                    <label>
                        <span class="label-icon">👥</span>
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

                <!-- Date -->
                <div class="form-group">
                    <label>
                        <span class="label-icon">📅</span>
                        Дата
                    </label>
                    <CustomDatepicker v-model="selectedDate" />
                </div>
            </div>

            <button
                class="load-btn"
                :disabled="!selectedGroup || isLoading"
                @click="loadSchedule"
                :class="{ loading: isLoading }"
            >
                <span v-if="isLoading" class="spinner"></span>
                <span v-else class="btn-icon">🔍</span>
                {{ isLoading ? "Загрузка..." : "Показать расписание" }}
            </button>
        </div>

        <!-- Расписание -->
        <ScheduleCard
            v-if="showSchedule"
            :lessons="schedule"
            :groupName="selectedGroupName"
            :date="formattedDate"
        />

        <!-- Не найдено -->
        <EmptyState
            v-else-if="showEmptyState"
            title="Расписание не найдено"
            subtitle="На выбранную дату занятий нет"
        />

        <!-- Начальное состояние -->
        <InitialState v-else-if="!selectedGroup && !schedule.length" />

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

        const {
            colleges,
            campuses,
            groups,
            schedule,
            selectedCollege,
            selectedCampus,
            selectedGroup,
            selectedDate,
            isLoading,
            selectedGroupName,
            formattedDate,
            showSchedule,
            showEmptyState,
            fetchColleges,
            onCollegeChange,
            onCampusChange,
            loadSchedule,
        } = useSchedule();

        const isLight = computed(() => !isDark.value);

        const applyTheme = (dark) => {
            document.body.classList.remove("dark", "light");
            document.body.classList.add(dark ? "dark" : "light");
            localStorage.setItem("theme", dark ? "dark" : "light");
        };

        const toggleTheme = () => {
            isDark.value = !isDark.value;
            applyTheme(isDark.value);
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

            fetchColleges();

            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    document.dispatchEvent(new CustomEvent("close-dropdowns"));
                }
            });
        });

        return {
            isDark,
            isLight,
            colleges,
            campuses,
            groups,
            schedule,
            selectedCollege,
            selectedCampus,
            selectedGroup,
            selectedDate,
            isLoading,
            selectedGroupName,
            formattedDate,
            showSchedule,
            showEmptyState,
            toggleTheme,
            onCollegeChange,
            onCampusChange,
            loadSchedule,
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

    /* Темная тема */
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.3),
        0 8px 10px -6px rgba(0, 0, 0, 0.2);

    transition: all 0.3s ease;
}

/* Светлая тема */
.selectors-card.light-theme {
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.1),
        0 8px 10px -6px rgba(0, 0, 0, 0.1);
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

.load-btn {
    width: 100%;
    padding: 14px 24px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    color: white;
    background: linear-gradient(135deg, #6366f1, #818cf8);
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
        0 0 30px rgba(99, 102, 241, 0.25);
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
}
</style>
