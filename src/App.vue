<template>
    <div class="container">
        <button class="theme-toggle" @click="toggleTheme">
            {{ isDark ? "☀️" : "🌙" }}
        </button>

        <h1>Расписание колледжей</h1>

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

        <footer>
            <b>
                Сделанo с помощью
                <a
                    href="https://github.com/ThisIsHyum/OpenScheduleApi"
                    target="_blank"
                    >OpenScheduleApi</a
                >
            </b>
        </footer>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            colleges: [],
            campuses: [],
            groups: [],
            schedule: [],
            selectedCollege: "",
            selectedCampus: "",
            selectedGroup: "",
            selectedDate: new Date().toISOString().slice(0, 10),
            isDark: true,
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
            if (!this.selectedDate) return "";
            const [year, month, day] = this.selectedDate.split("-");
            return `${day}.${month}.${year}`;
        },
        apiDate() {
            if (!this.selectedDate) return "";
            const [year, month, day] = this.selectedDate.split("-");
            return `${day}-${month}-${year}`;
        },
    },
    watch: {
        isDark(newVal) {
            document.body.classList.toggle("dark", newVal);
            document.body.classList.toggle("light", !newVal);
        },
    },
    mounted() {
        document.body.classList.add(this.isDark ? "dark" : "light");
        this.fetchColleges();
    },
    methods: {
        toggleTheme() {
            this.isDark = !this.isDark;
        },
        async fetchColleges() {
            try {
                const res = await axios.get(
                    "https://api.thisishyum.ru/schedule_api/tyumen/colleges",
                );
                this.colleges = res.data;
            } catch (e) {
                console.error(e);
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
                console.error(e);
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
                console.error(e);
            }
        },
        async loadSchedule() {
            if (!this.selectedGroup) return;
            try {
                const res = await axios.get(
                    `https://api.thisishyum.ru/schedule_api/tyumen/groups/${this.selectedGroup}/schedules`,
                    { params: { date: this.apiDate } },
                );
                if (res.data.length && res.data[0].lessons) {
                    this.schedule = res.data[0].lessons;
                }
            } catch (e) {
                console.error(e);
            }
        },
    },
};
</script>

<style>
:root {
    --bg-light: #f5f6fa;
    --text-light: #1f2937;
    --card-light: #fff;
    --primary-light: #4f46e5;

    --bg-dark: #12121e;
    --text-dark: #f3f4f6;
    --card-dark: #1e1e2e;
    --primary-dark: #6366f1;
}

body,
html {
    margin: 0;
    padding: 0;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    transition:
        background 0.3s,
        color 0.3s;
}

body.light {
    background-color: var(--bg-light);
    color: var(--text-light);
}

body.dark {
    background-color: var(--bg-dark);
    color: var(--text-dark);
}

.container {
    max-width: 800px;
    margin: 60px auto 40px;
    padding: 0 20px;
}

h1 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 20px;
}

.selectors-card,
.schedule-card {
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 30px;
    transition:
        background 0.3s,
        color 0.3s,
        box-shadow 0.3s;
}

body.light .selectors-card,
body.light .schedule-card {
    background-color: var(--card-light);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

body.dark .selectors-card,
body.dark .schedule-card {
    background-color: var(--card-dark);
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
    border: 1px solid rgba(99, 102, 241, 0.2);
}

select {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 1rem;
    border: 1px solid #555;
    background-color: inherit;
    color: inherit;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
    transition: all 0.3s;
}

select:focus {
    outline: none;
    border-color: var(--primary-dark);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

input[type="date"] {
    width: 100%;
    padding: 10px 0px;
    margin-bottom: 20px;
    border-radius: 8px;
    border: 1px solid #555;
    background-color: inherit;
    color: inherit;
    font-size: 1rem;
}

button {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    background: linear-gradient(90deg, #4f46e5, #6366f1);
    color: #fff;
    font-weight: 600;
    transition: all 0.3s;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

button:hover:not(:disabled) {
    filter: brightness(1.2);
}


table {
    width: 100%;
    border-collapse: collapse;
    transition: all 0.3s;
}

th,
td {
    padding: 12px;
    border-bottom: 1px solid #444;
    text-align: left;
}

body.light th {
    background: #e0e7ff;
    color: #3730a3;
}

body.dark th {
    background: #2a2a3a;
    color: #c7d2fe;
}

body.dark td {
    border-color: #555;
}

tr:hover td {
    background-color: rgba(99, 102, 241, 0.1);
}

.theme-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    color: #fff;
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.6);
    transition: all 0.3s;
    z-index: 1000;
}

.theme-toggle:hover {
    transform: scale(1.1);
    filter: brightness(1.2);
}


footer {
    text-align: center;
    margin-top: 40px;
    font-size: 0.9rem;
}

footer a {
    color: var(--primary-dark);
    text-decoration: none;
}

footer a:hover {
    text-decoration: underline;
}
</style>
