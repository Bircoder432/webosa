<template>
    <div class="container">
        <AppHeader />

        <!-- Selectors Card -->
        <div class="selectors-card">
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
import { onMounted } from "vue";
import { useSchedule } from "../composables/useSchedule.js";
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
        AppHeader,
        CustomDropdown,
        CustomDatepicker,
        ScheduleCard,
        EmptyState,
        InitialState,
        AppFooter,
    },
    setup() {
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

        onMounted(() => {
            fetchColleges();
        });

        return {
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
            onCollegeChange,
            onCampusChange,
            loadSchedule,
        };
    },
};
</script>

<style scoped>
.container {
    max-width: 900px;
    margin: 0 auto;
    padding: 1.5rem 1rem;
    position: relative;
    font-family: var(--font-mono);
}
.selectors-card {
    border: 1px solid var(--border);
    background: var(--bg-card);
    padding: 1.25rem;
    margin-bottom: 1.5rem;
}
.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
}
.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}
label {
    font-size: 0.75rem;
    color: var(--accent);
    text-transform: lowercase;
    letter-spacing: 0.5px;
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}
.label-icon {
    margin-right: 0.25rem;
    opacity: 0.8;
    font-size: 0.9rem;
}
.load-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all var(--transition-fast);
    text-transform: lowercase;
}
.load-btn::before {
    content: ">";
    color: var(--accent);
    margin-right: 0.5rem;
}
.load-btn:hover:not(:disabled) {
    border-color: var(--accent);
    color: var(--accent);
}
.load-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
.load-btn.loading {
    cursor: wait;
}
.spinner {
    width: 14px;
    height: 14px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
