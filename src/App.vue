<template>
    <div class="container">
        <h1>Расписание колледжей</h1>

        <!-- Селекторы -->
        <div class="selectors-card">
            <div class="form-group">
                <label>Колледж</label>
                <select v-model="selectedCollege" @change="onCollegeChange">
                    <option disabled value="">Выберите колледж</option>
                    <option
                        v-for="c in colleges"
                        :key="c.collegeId"
                        :value="c.collegeId"
                    >
                        {{ c.name }}
                    </option>
                </select>
            </div>

            <div class="form-group">
                <label>Кампус</label>
                <select
                    v-model="selectedCampus"
                    @change="onCampusChange"
                    :disabled="!campuses.length"
                >
                    <option disabled value="">Выберите кампус</option>
                    <option
                        v-for="c in campuses"
                        :key="c.campusId"
                        :value="c.campusId"
                    >
                        {{ c.name }}
                    </option>
                </select>
            </div>

            <div class="form-group">
                <label>Группа</label>
                <select v-model="selectedGroup" :disabled="!groups.length">
                    <option disabled value="">Выберите группу</option>
                    <option
                        v-for="g in groups"
                        :key="g.studentGroupId"
                        :value="g.studentGroupId"
                    >
                        {{ g.name }}
                    </option>
                </select>
            </div>

            <div class="form-group">
                <label>Дата</label>
                <input type="date" v-model="selectedDate" />
            </div>

            <button :disabled="!selectedGroup" @click="loadSchedule">
                Показать расписание
            </button>
        </div>

        <!-- Расписание -->
        <div v-if="schedule.length" class="schedule-card">
            <h2>
                Расписание группы {{ selectedGroupName }} на {{ formattedDate }}
            </h2>
            <table>
                <thead>
                    <tr>
                        <th>Время</th>
                        <th>Предмет</th>
                        <th>Кабинет</th>
                        <th>Преподаватель</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="lesson in schedule" :key="lesson.order">
                        <td>{{ lesson.startTime }} - {{ lesson.endTime }}</td>
                        <td>{{ lesson.title }}</td>
                        <td>{{ lesson.cabinet }}</td>
                        <td>{{ lesson.teacher }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else-if="selectedGroup" class="empty-schedule">
            Расписание пустое
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "App",
    data() {
        return {
            colleges: [],
            campuses: [],
            groups: [],
            schedule: [],
            selectedCollege: "",
            selectedCampus: "",
            selectedGroup: "",
            selectedDate: new Date().toISOString().slice(0, 10), // по умолчанию сегодня
        };
    },
    computed: {
        selectedGroupName() {
            const g = this.groups.find(
                (x) => x.studentGroupId === this.selectedGroup,
            );
            return g ? g.name : "";
        },
        formattedDate() {
            return this.selectedDate
                ? new Date(this.selectedDate).toLocaleDateString()
                : "";
        },
    },
    mounted() {
        this.fetchColleges();
    },
    methods: {
        async fetchColleges() {
            try {
                const res = await axios.get(
                    "https://api.thisishyum.ru/schedule_api/tyumen/colleges",
                );
                this.colleges = res.data;
            } catch (e) {
                console.error("Ошибка при загрузке колледжей:", e);
            }
        },
        async onCollegeChange() {
            this.selectedCampus = "";
            this.selectedGroup = "";
            this.campuses = [];
            this.groups = [];
            this.schedule = [];
            if (!this.selectedCollege) return;
            try {
                const res = await axios.get(
                    `https://api.thisishyum.ru/schedule_api/tyumen/colleges/${this.selectedCollege}/campuses`,
                );
                this.campuses = res.data;
            } catch (e) {
                console.error("Ошибка при загрузке кампусов:", e);
            }
        },
        async onCampusChange() {
            this.selectedGroup = "";
            this.groups = [];
            this.schedule = [];
            if (!this.selectedCampus) return;
            try {
                const res = await axios.get(
                    `https://api.thisishyum.ru/schedule_api/tyumen/campuses/${this.selectedCampus}/groups`,
                );
                this.groups = res.data;
            } catch (e) {
                console.error("Ошибка при загрузке групп:", e);
            }
        },
        async loadSchedule() {
            if (!this.selectedGroup) return;
            this.schedule = [];
            try {
                // Преобразуем дату в DD-MM-YYYY
                const [year, month, day] = this.selectedDate.split("-");
                const formattedDate = `${day}-${month}-${year}`;

                const res = await axios.get(
                    `https://api.thisishyum.ru/schedule_api/tyumen/groups/${this.selectedGroup}/schedules`,
                    {
                        params: {
                            date: formattedDate,
                        },
                    },
                );
                if (res.data.length && res.data[0].lessons) {
                    this.schedule = res.data[0].lessons;
                }
            } catch (e) {
                console.error("Ошибка при загрузке расписания:", e);
            }
        },
    },
};
</script>

<style>
body {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f5f6fa;
    margin: 0;
    padding: 0;
}

.container {
    max-width: 800px;
    margin: 40px auto;
    padding: 0 20px;
}

h1 {
    text-align: center;
    font-size: 2.5rem;
    color: #4f46e5;
    margin-bottom: 30px;
}

.selectors-card {
    background-color: #fff;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    margin-bottom: 30px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    font-weight: 600;
    margin-bottom: 6px;
    color: #374151;
}

select,
input[type="date"] {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    font-size: 1rem;
    outline: none;
    transition:
        border 0.2s,
        box-shadow 0.2s;
}

select:focus,
input[type="date"]:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

select:disabled,
input[type="date"]:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
}

button {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    background-color: #4f46e5;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

button:hover:not(:disabled) {
    background-color: #4338ca;
}

.schedule-card {
    background-color: #fff;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.schedule-card h2 {
    font-size: 1.8rem;
    color: #4f46e5;
    margin-bottom: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #e5e7eb;
}

th {
    background-color: #e0e7ff;
    color: #3730a3;
    font-weight: 600;
}

tr:hover td {
    background-color: #f0f4ff;
}

.empty-schedule {
    text-align: center;
    color: #6b7280;
    font-size: 1.1rem;
    margin-top: 15px;
}
</style>
