<template>
    <div class="dashboard" :class="{ 'sidebar-hidden': isSidebarHidden, 'is-mobile': isMobile }">
        <ThemeToggle :isDark="isDark" @toggle="toggleTheme" />

        <Transition :name="isMobile ? 'slide-bottom' : 'slide-sidebar'">
            <ScheduleSidebar
                v-if="!isSidebarHidden"
                :mode="mode"
                @update:mode="updateMode"
                :isWeekMode="isWeekMode"
                @update:isWeekMode="updateIsWeekMode"
                :campuses="campuses"
                :groups="groups"
                :selectedCampus="selectedCampus"
                @update:selectedCampus="updateCampus"
                :selectedGroup="selectedGroup"
                @update:selectedGroup="updateGroup"
                :selectedDate="selectedDate"
                @update:selectedDate="updateDate"
                :isLoading="isLoading"
                :teacherName="teacherName"
                @update:teacherName="updateTeacher"
                :isLight="isLight"
                :isMobile="isMobile"
                :isLoadDisabled="isLoadDisabled"
                :isBtnLoading="isBtnLoading"
                :weekStartDate="weekStartDate"
                @on-campus-change="onCampusChange"
                @load="handleLoad"
                @change-week="changeWeek"
                @close="hideSidebar"
            />
        </Transition>

        <main class="workspace">
            <AppHeader />

            <button
                v-if="isSidebarHidden"
                class="filter-fab"
                @click="showSidebar"
                title="Открыть фильтры"
            >
                <i class="ri-filter-3-line"></i>
            </button>

            <template v-if="mode === 'group'">
                <LoadingSplash v-if="isLoading" text="Загружаем расписание группы..." />

                <template v-else-if="!isWeekMode">
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
                        v-else-if="!scheduleLoaded && !selectedGroup"
                        message="Выберите корпус и группу для просмотра расписания"
                    />
                    <InitialState
                        v-else-if="!scheduleLoaded && selectedGroup"
                        message="Нажмите «Показать расписание», чтобы загрузить пары"
                    />
                </template>

                <template v-else>
                    <WeekGrid
                        v-if="scheduleLoaded && weekSchedule.length > 0"
                        :weekSchedule="weekSchedule"
                        :isLight="isLight"
                        :groupName="selectedGroupName"
                    />
                    <EmptyState
                        v-else-if="scheduleLoaded"
                        title="Неделя пуста"
                        subtitle="На этой неделе занятий нет"
                    />
                    <InitialState
                        v-else-if="!scheduleLoaded && !selectedGroup"
                        message="Выберите корпус и группу для просмотра расписания на неделю"
                    />
                    <InitialState
                        v-else-if="!scheduleLoaded && selectedGroup"
                        message="Нажмите «Показать расписание», чтобы загрузить неделю"
                    />
                </template>
            </template>

            <template v-else>
                <LoadingSplash v-if="isTeacherLoading" text="Ищем пары преподавателя..." />

                <template v-else-if="!isWeekMode">
                    <template v-if="showTeacherSchedule">
                        <ScheduleCard
                            v-for="t in teacherSchedule"
                            :key="t.teacherName"
                            :lessons="t.lessons"
                            :groupName="t.teacherName"
                            :date="formattedDate"
                            badgeIcon="ri-user-line"
                        />
                    </template>
                    <EmptyState
                        v-else-if="showTeacherEmptyState"
                        title="Пары не найдены"
                        subtitle="На выбранную дату пар у преподавателя нет"
                    />
                    <InitialState
                        v-else-if="!teacherScheduleLoaded && !teacherName.trim()"
                        icon="ri-user-line"
                        message="Введите фамилию преподавателя и выберите дату"
                    />
                    <InitialState
                        v-else-if="!teacherScheduleLoaded && teacherName.trim()"
                        icon="ri-user-line"
                        message="Нажмите «Показать расписание», чтобы найти пары"
                    />
                </template>

                <template v-else>
                    <template v-if="showTeacherWeekSchedule">
                        <WeekGrid
                            v-for="tw in teacherWeekSchedule"
                            :key="tw.teacherName"
                            :weekSchedule="tw.weekSchedule"
                            :isLight="isLight"
                            :groupName="tw.teacherName"
                        />
                    </template>
                    <EmptyState
                        v-else-if="showTeacherWeekEmptyState"
                        title="Пары не найдены"
                        subtitle="На этой неделе у преподавателя нет пар"
                    />
                    <InitialState
                        v-else-if="!teacherScheduleLoaded && !teacherName.trim()"
                        icon="ri-user-line"
                        message="Введите фамилию преподавателя и выберите неделю"
                    />
                    <InitialState
                        v-else-if="!teacherScheduleLoaded && teacherName.trim()"
                        icon="ri-user-line"
                        message="Нажмите «Показать расписание», чтобы загрузить неделю"
                    />
                </template>
            </template>

            <AppFooter />
        </main>

        <div v-if="isMobile && !isSidebarHidden" class="overlay" @click="hideSidebar"></div>
    </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useSchedule } from "../composables/useSchedule.js";
import { useTheme } from "../composables/useTheme.js";
import { useViewport } from "../composables/useViewport.js";
import ThemeToggle from "../components/ThemeToggle.vue";
import AppHeader from "../components/AppHeader.vue";
import ScheduleSidebar from "../components/ScheduleSidebar.vue";
import ScheduleCard from "../components/ScheduleCard.vue";
import EmptyState from "../components/EmptyState.vue";
import InitialState from "../components/InitialState.vue";
import AppFooter from "../components/AppFooter.vue";
import WeekGrid from "../components/WeekGrid.vue";
import LoadingSplash from "../components/LoadingSplash.vue";

export default {
    name: "ScheduleView",
    components: {
        ThemeToggle,
        AppHeader,
        ScheduleSidebar,
        ScheduleCard,
        EmptyState,
        InitialState,
        AppFooter,
        WeekGrid,
        LoadingSplash,
    },
    setup() {
        const mode = ref("group");
        const { isMobile } = useViewport();
        const isSidebarHidden = ref(isMobile.value);

        const { isDark, isLight, toggleTheme, setTheme } = useTheme();
        const s = useSchedule();

        const updateMode = (v) => { mode.value = v; };
        const updateIsWeekMode = (v) => { s.isWeekMode.value = v; };
        const updateCampus = (v) => { s.selectedCampus.value = v; };
        const updateGroup = (v) => { s.selectedGroup.value = v; };
        const updateDate = (v) => { s.selectedDate.value = v; };
        const updateTeacher = (v) => { s.teacherName.value = v; };

        const isLoadDisabled = computed(() => {
            if (mode.value === "group")
                return !s.selectedGroup.value || s.isLoading.value;
            return !s.teacherName.value.trim() || s.isTeacherLoading.value;
        });

        const isBtnLoading = computed(() =>
            mode.value === "group" ? s.isLoading.value : s.isTeacherLoading.value,
        );

        const handleLoad = () => {
            if (mode.value === "group") {
                if (s.isWeekMode.value) s.loadWeekSchedule();
                else s.loadSchedule();
            } else {
                if (s.isWeekMode.value) s.loadTeacherWeekSchedule();
                else s.loadTeacherSchedule();
            }
            isSidebarHidden.value = true;
        };

        const showSidebar = () => { isSidebarHidden.value = false; };
        const hideSidebar = () => { isSidebarHidden.value = true; };

        onMounted(() => {
            const saved = localStorage.getItem("theme");
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setTheme(saved ? saved === "dark" : prefersDark);
            s.initializeCampuses();
        });

        return {
            mode,
            isMobile,
            isSidebarHidden,
            isDark,
            isLight,
            toggleTheme,
            handleLoad,
            showSidebar,
            hideSidebar,
            isLoadDisabled,
            isBtnLoading,
            updateMode,
            updateIsWeekMode,
            updateCampus,
            updateGroup,
            updateDate,
            updateTeacher,
            campuses: s.campuses,
            groups: s.groups,
            schedule: s.schedule,
            selectedCampus: s.selectedCampus,
            selectedGroup: s.selectedGroup,
            selectedDate: s.selectedDate,
            isLoading: s.isLoading,
            teacherName: s.teacherName,
            selectedGroupName: s.selectedGroupName,
            formattedDate: s.formattedDate,
            showSchedule: s.showSchedule,
            showEmptyState: s.showEmptyState,
            onCampusChange: s.onCampusChange,
            isWeekMode: s.isWeekMode,
            weekSchedule: s.weekSchedule,
            weekStartDate: s.weekStartDate,
            changeWeek: s.changeWeek,
            scheduleLoaded: s.scheduleLoaded,
            teacherSchedule: s.teacherSchedule,
            teacherWeekSchedule: s.teacherWeekSchedule,
            isTeacherLoading: s.isTeacherLoading,
            teacherScheduleLoaded: s.teacherScheduleLoaded,
            showTeacherSchedule: s.showTeacherSchedule,
            showTeacherEmptyState: s.showTeacherEmptyState,
            showTeacherWeekSchedule: s.showTeacherWeekSchedule,
            showTeacherWeekEmptyState: s.showTeacherWeekEmptyState,
        };
    },
};
</script>

<style scoped>
.dashboard {
    display: flex;
    min-height: 100vh;
    position: relative;
}

.workspace {
    flex: 1;
    padding: 40px 24px;
    min-width: 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.dashboard.sidebar-hidden .workspace {
    margin-left: 0;
}

.filter-fab {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0b6dac, #21badc);
    color: white;
    border: none;
    font-size: 1.4rem;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(11, 109, 172, 0.4);
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.filter-fab:hover {
    transform: scale(1.1) rotate(5deg);
}

.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    backdrop-filter: blur(2px);
}

.slide-sidebar-enter-active,
.slide-sidebar-leave-active {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-sidebar-enter-from,
.slide-sidebar-leave-to {
    transform: translateX(-100%);
}

.slide-bottom-enter-active,
.slide-bottom-leave-active {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-bottom-enter-from,
.slide-bottom-leave-to {
    transform: translateY(100%);
}

@media (max-width: 1024px) {
    .dashboard {
        flex-direction: column;
    }

    .workspace {
        padding: 20px 16px;
        padding-top: 80px;
    }

    .filter-fab {
        top: 16px;
        left: 16px;
        width: 44px;
        height: 44px;
        font-size: 1.2rem;
    }
}
</style>
