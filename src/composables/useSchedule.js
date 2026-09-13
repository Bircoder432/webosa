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

  const teacherName = ref("");
  const displayTeacherName = ref("");
  const teacherSchedule = ref([]);
  const teacherScheduleLoaded = ref(false);
  const isTeacherLoading = ref(false);
  const hasTeacherError = ref(false);

  const selectedCampusName = computed(() => {
    const c = campuses.value.find((x) => x.campusId === selectedCampus.value);
    return c ? c.name : "";
  });

  const selectedGroupName = computed(() => {
    const g = groups.value.find(
      (x) => x.studentGroupId === selectedGroup.value,
    );
    return g ? g.name : "";
  });

  const formattedDate = computed(() => {
    if (!displayDate.value) return "";
    const [y, m, d] = displayDate.value.split("-");
    return `${d}.${m}.${y}`;
  });

  const showSchedule = computed(() => {
    return (
      schedule.value.length > 0 && scheduleLoaded.value && !isLoading.value
    );
  });

  const showEmptyState = computed(() => {
    return (
      selectedGroup.value &&
      scheduleLoaded.value &&
      !isLoading.value &&
      (schedule.value.length === 0 || hasError.value)
    );
  });

  const showTeacherSchedule = computed(() => {
    return (
      teacherSchedule.value.length > 0 &&
      teacherScheduleLoaded.value &&
      !isTeacherLoading.value
    );
  });

  const showTeacherEmptyState = computed(() => {
    return (
      teacherName.value.trim() &&
      teacherScheduleLoaded.value &&
      !isTeacherLoading.value &&
      (teacherSchedule.value.length === 0 || hasTeacherError.value)
    );
  });

  const pluralize = (n, one, few, many) => {
    if (n % 10 === 1 && n % 100 !== 11) return one;
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20))
      return few;
    return many;
  };

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

    teacherSchedule.value = [];
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
      const url = `${API_BASE_URL}/groups/${selectedGroup.value}/schedules?date=${selectedDate.value}`;
      const res = await axios.get(url);

      scheduleLoaded.value = true;
      hasError.value = false;

      if (res.data.length && res.data[0].lessons) {
        schedule.value = res.data[0].lessons;
      } else {
        schedule.value = [];
      }
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
      hasTeacherError.value = false;

      // Группируем пары по конкретным преподавателям
      const teacherMap = {};

      (res.data || []).forEach((item) => {
        if (item.lessons && item.lessons.length > 0) {
          const group = collegeGroups.value.find(
            (g) => g.studentGroupId === item.groupId,
          );
          const groupName = group ? group.name : `Группа ${item.groupId}`;

          item.lessons.forEach((lesson) => {
            const teacherFullName = lesson.teacher || "Без преподавателя";

            if (!teacherMap[teacherFullName]) {
              teacherMap[teacherFullName] = [];
            }

            // ИСПРАВЛЕНИЕ: Заменяем ФИО препода на название группы для отображения внутри карточки пары
            teacherMap[teacherFullName].push({
              ...lesson,
              teacher: groupName,
            });
          });
        }
      });

      // Формируем массив объектов для карточек
      const groupedSchedules = Object.keys(teacherMap).map((teacher) => {
        return {
          teacherName: teacher,
          lessons: teacherMap[teacher].sort((a, b) => a.order - b.order),
        };
      });

      // Сортируем преподавателей по алфавиту
      groupedSchedules.sort((a, b) => a.teacherName.localeCompare(b.teacherName));

      teacherSchedule.value = groupedSchedules;
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
    selectedCampusName,
    selectedGroupName,
    formattedDate,
    showSchedule,
    showEmptyState,
    pluralize,
    initializeCampuses,
    onCampusChange,
    loadSchedule,
    teacherName,
    displayTeacherName,
    teacherSchedule,
    teacherScheduleLoaded,
    isTeacherLoading,
    hasTeacherError,
    showTeacherSchedule,
    showTeacherEmptyState,
    loadTeacherSchedule,
  };
}
