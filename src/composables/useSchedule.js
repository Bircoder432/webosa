import { ref, computed } from "vue";
import axios from "axios";

const API_BASE_URL = "https://api.thisishyum.ru/schedule_api/tyumen";

export function useSchedule() {
    const getTodayString = () => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, "0");
        const d = String(now.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const getMonday = (d) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };

    const formatDateStr = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };

    const getWeekDates = () => {
        const monday = new Date(weekStartDate.value);
        const days = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            days.push(formatDateStr(d));
        }
        return days;
    };

    const buildDaySkeleton = (days) =>
        days.map((dateStr) => {
            const [y, m, d] = dateStr.split("-");
            return { date: dateStr, formattedDate: `${d}.${m}.${y}`, lessons: [] };
        });

    const colleges = ref([]);
    const campuses = ref([]);
    const groups = ref([]);
    const schedule = ref([]);
    const collegeGroups = ref([]);

    const selectedCollege = ref(1);
    const selectedCampus = ref("");
    const selectedGroup = ref("");
    const selectedDate = ref(getTodayString());
    const displayDate = ref(getTodayString());
    const scheduleLoaded = ref(false);
    const isLoading = ref(false);
    const hasError = ref(false);

    const isWeekMode = ref(false);
    const weekSchedule = ref([]);
    const weekStartDate = ref(getMonday(new Date()));

    const teacherName = ref("");
    const displayTeacherName = ref("");
    const teacherSchedule = ref([]);
    const teacherWeekSchedule = ref([]);
    const teacherScheduleLoaded = ref(false);
    const isTeacherLoading = ref(false);
    const hasTeacherError = ref(false);

    const selectedGroupName = computed(() => {
        const g = groups.value.find((x) => x.studentGroupId === selectedGroup.value);
        return g ? g.name : "";
    });

    const formattedDate = computed(() => {
        if (!displayDate.value) return "";
        const [y, m, d] = displayDate.value.split("-");
        return `${d}.${m}.${y}`;
    });

    const showSchedule = computed(
        () => schedule.value.length > 0 && scheduleLoaded.value && !isLoading.value,
    );

    const showEmptyState = computed(
        () =>
            selectedGroup.value &&
            scheduleLoaded.value &&
            !isLoading.value &&
            (schedule.value.length === 0 || hasError.value),
    );

    const showTeacherSchedule = computed(
        () =>
            teacherSchedule.value.length > 0 &&
            teacherScheduleLoaded.value &&
            !isTeacherLoading.value,
    );

    const showTeacherEmptyState = computed(
        () =>
            teacherName.value.trim() &&
            teacherScheduleLoaded.value &&
            !isTeacherLoading.value &&
            (teacherSchedule.value.length === 0 || hasTeacherError.value),
    );

    const showTeacherWeekSchedule = computed(
        () =>
            teacherWeekSchedule.value.length > 0 &&
            teacherScheduleLoaded.value &&
            !isTeacherLoading.value,
    );

    const showTeacherWeekEmptyState = computed(
        () =>
            teacherName.value.trim() &&
            teacherScheduleLoaded.value &&
            !isTeacherLoading.value &&
            teacherWeekSchedule.value.length === 0,
    );

    const initializeCampuses = async () => {
        try {
            const res = await axios.get(
                `${API_BASE_URL}/colleges/${selectedCollege.value}/campuses`,
            );
            campuses.value = res.data;
            const groupsRes = await axios.get(
                `${API_BASE_URL}/colleges/${selectedCollege.value}/groups`,
            );
            collegeGroups.value = groupsRes.data;
        } catch (e) {
            console.error(e);
        }
    };

    const onCampusChange = async () => {
        selectedGroup.value = "";
        groups.value = [];
        schedule.value = [];
        scheduleLoaded.value = false;
        hasError.value = false;
        weekSchedule.value = [];
        teacherSchedule.value = [];
        teacherWeekSchedule.value = [];
        teacherScheduleLoaded.value = false;
        hasTeacherError.value = false;

        if (!selectedCampus.value) return;
        try {
            const res = await axios.get(
                `${API_BASE_URL}/campuses/${selectedCampus.value}/groups`,
            );
            groups.value = res.data;
        } catch (e) {
            console.error(e);
        }
    };

    const loadSchedule = async () => {
        if (!selectedGroup.value) return;
        isLoading.value = true;
        schedule.value = [];
        scheduleLoaded.value = false;
        hasError.value = false;

        try {
            const res = await axios.get(
                `${API_BASE_URL}/groups/${selectedGroup.value}/schedules?date=${selectedDate.value}`,
            );
            scheduleLoaded.value = true;
            schedule.value =
                res.data.length && res.data[0].lessons ? res.data[0].lessons : [];
            displayDate.value = selectedDate.value;
        } catch (e) {
            console.error("Error loading schedule:", e);
            schedule.value = [];
            scheduleLoaded.value = true;
            hasError.value = true;
            displayDate.value = selectedDate.value;
        } finally {
            isLoading.value = false;
        }
    };

    const changeWeek = (direction) => {
        const current = new Date(weekStartDate.value);
        current.setDate(current.getDate() + direction * 7);
        weekStartDate.value = current;
    };

    const loadWeekSchedule = async () => {
        if (!selectedGroup.value) return;
        isLoading.value = true;
        weekSchedule.value = [];
        scheduleLoaded.value = false;
        hasError.value = false;

        const days = getWeekDates();

        try {
            const results = await Promise.all(
                days.map((date) =>
                    axios.get(
                        `${API_BASE_URL}/groups/${selectedGroup.value}/schedules?date=${date}`,
                    ),
                ),
            );

            const skeleton = buildDaySkeleton(days);
            weekSchedule.value = skeleton.map((day, index) => {
                const res = results[index];
                const lessons =
                    res.data.length && res.data[0].lessons ? res.data[0].lessons : [];
                return { ...day, lessons };
            });

            scheduleLoaded.value = true;
            displayDate.value = days[0];
        } catch (e) {
            console.error("Error loading week schedule:", e);
            weekSchedule.value = [];
            scheduleLoaded.value = true;
            hasError.value = true;
        } finally {
            isLoading.value = false;
        }
    };

    const loadTeacherSchedule = async () => {
        if (!teacherName.value.trim()) return;
        isTeacherLoading.value = true;
        teacherSchedule.value = [];
        teacherScheduleLoaded.value = false;
        hasTeacherError.value = false;
        displayTeacherName.value = teacherName.value.trim();

        try {
            const url = `${API_BASE_URL}/colleges/${selectedCollege.value}/schedules?date=${selectedDate.value}&teacher=${encodeURIComponent(teacherName.value.trim())}`;
            const res = await axios.get(url);
            teacherScheduleLoaded.value = true;

            const teacherMap = {};
            (res.data || []).forEach((item) => {
                if (item.lessons && item.lessons.length > 0) {
                    const group = collegeGroups.value.find(
                        (g) => g.studentGroupId === item.groupId,
                    );
                    const groupName = group ? group.name : `Группа ${item.groupId}`;
                    item.lessons.forEach((lesson) => {
                        const t = lesson.teacher || "Без преподавателя";
                        if (!teacherMap[t]) teacherMap[t] = [];
                        teacherMap[t].push({ ...lesson, teacher: groupName });
                    });
                }
            });

            const grouped = Object.keys(teacherMap).map((teacher) => ({
                teacherName: teacher,
                lessons: teacherMap[teacher].sort((a, b) => a.order - b.order),
            }));
            grouped.sort((a, b) => a.teacherName.localeCompare(b.teacherName));

            teacherSchedule.value = grouped;
            displayDate.value = selectedDate.value;
        } catch (e) {
            console.error("Error loading teacher schedule:", e);
            teacherSchedule.value = [];
            teacherScheduleLoaded.value = true;
            hasTeacherError.value = true;
            displayDate.value = selectedDate.value;
        } finally {
            isTeacherLoading.value = false;
        }
    };
    const loadTeacherWeekSchedule = async () => {
        if (!teacherName.value.trim()) return;
        isTeacherLoading.value = true;
        teacherWeekSchedule.value = [];
        teacherScheduleLoaded.value = false;
        hasTeacherError.value = false;
        displayTeacherName.value = teacherName.value.trim();

        const days = getWeekDates();

        try {
            const results = await Promise.all(
                days.map((date) =>
                    axios.get(
                        `${API_BASE_URL}/colleges/${selectedCollege.value}/schedules?date=${date}&teacher=${encodeURIComponent(teacherName.value.trim())}`,
                    ),
                ),
            );

            const teacherMap = {};

            results.forEach((res, idx) => {
                (res.data || []).forEach((item) => {
                    if (!item.lessons || !item.lessons.length) return;
                    const group = collegeGroups.value.find(
                        (g) => g.studentGroupId === item.groupId,
                    );
                    const groupName = group ? group.name : `Группа ${item.groupId}`;

                    item.lessons.forEach((lesson) => {
                        const t = lesson.teacher || "Без преподавателя";
                        if (!teacherMap[t]) teacherMap[t] = buildDaySkeleton(days);
                        teacherMap[t][idx].lessons.push({
                            ...lesson,
                            teacher: groupName,
                        });
                    });
                });
            });

            teacherWeekSchedule.value = Object.keys(teacherMap)
                .sort((a, b) => a.localeCompare(b))
                .map((t) => ({
                    teacherName: t,
                    weekSchedule: teacherMap[t].map((day) => ({
                        ...day,
                        lessons: day.lessons.sort((a, b) => a.order - b.order),
                    })),
                }));

            teacherScheduleLoaded.value = true;
            displayDate.value = days[0];
        } catch (e) {
            console.error("Error loading teacher week schedule:", e);
            teacherWeekSchedule.value = [];
            teacherScheduleLoaded.value = true;
            hasTeacherError.value = true;
        } finally {
            isTeacherLoading.value = false;
        }
    };

    return {
        colleges,
        campuses,
        groups,
        schedule,
        selectedCollege,
        selectedCampus,
        selectedGroup,
        selectedDate,
        displayDate,
        scheduleLoaded,
        isLoading,
        hasError,
        selectedGroupName,
        formattedDate,
        showSchedule,
        showEmptyState,
        initializeCampuses,
        onCampusChange,
        loadSchedule,
        isWeekMode,
        weekSchedule,
        weekStartDate,
        changeWeek,
        loadWeekSchedule,
        teacherName,
        displayTeacherName,
        teacherSchedule,
        teacherWeekSchedule,
        teacherScheduleLoaded,
        isTeacherLoading,
        hasTeacherError,
        showTeacherSchedule,
        showTeacherEmptyState,
        showTeacherWeekSchedule,
        showTeacherWeekEmptyState,
        loadTeacherSchedule,
        loadTeacherWeekSchedule,
    };
}
