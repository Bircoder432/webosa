import { ref, computed } from "vue";
import axios from "axios";

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

  // Установлен колледж TKPST с ID 1 по умолчанию
  const selectedCollege = ref(1);
  const selectedCampus = ref("");
  const selectedGroup = ref("");
  const selectedDate = ref(getTodayString());
  const displayDate = ref(getTodayString());
  const scheduleLoaded = ref(false);
  const isLoading = ref(false);
  const hasError = ref(false);

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

  const apiDate = computed(() => {
    if (!selectedDate.value) return "";
    const [y, m, d] = selectedDate.value.split("-");
    return `${d}-${m}-${y}`;
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

  const pluralize = (n, one, few, many) => {
    if (n % 10 === 1 && n % 100 !== 11) return one;
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20))
      return few;
    return many;
  };

  // Автоматическая загрузка корпусов для TKPST (ID 1)
  const initializeCampuses = async () => {
    try {
      const res = await axios.get(
        `https://api.thisishyum.ru/schedule_api/tyumen/colleges/1/campuses`,
      );
      campuses.value = res.data;
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

    if (!selectedCampus.value) return;

    try {
      const res = await axios.get(
        `https://api.thisishyum.ru/schedule_api/tyumen/campuses/${selectedCampus.value}/groups`,
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
      const url = `https://api.thisishyum.ru/schedule_api/tyumen/groups/${selectedGroup.value}/schedules?date=${apiDate.value}`;
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
    apiDate,
    showSchedule,
    showEmptyState,
    pluralize,
    initializeCampuses,
    onCampusChange,
    loadSchedule,
  };
}
