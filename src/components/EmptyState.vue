<template>
    <div class="empty-state" :class="{ 'light-theme': isLight }">
        <div class="empty-icon">📭</div>
        <h3>{{ title }}</h3>
        <p>{{ subtitle }}</p>
    </div>
</template>

<script>
export default {
    name: "EmptyState",
    props: {
        title: {
            type: String,
            default: "Расписание не найдено",
        },
        subtitle: {
            type: String,
            default: "На выбранную дату занятий нет",
        },
    },
    data() {
        return {
            isLight: document.body.classList.contains("light"),
        };
    },
    mounted() {
        this.themeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    this.isLight = document.body.classList.contains("light");
                }
            });
        });

        this.themeObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"],
        });
    },
    beforeUnmount() {
        if (this.themeObserver) {
            this.themeObserver.disconnect();
        }
    },
};
</script>
<style scoped>
.empty-state {
    text-align: center;
    padding: 60px 20px;
    border-radius: 24px;
    margin-bottom: 24px;

    /* Темная тема */
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.3),
        0 8px 10px -6px rgba(0, 0, 0, 0.2);

    transition: all 0.3s ease;
}

/* Светлая тема */
.empty-state.light-theme {
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.1),
        0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: 16px;
    opacity: 0.8;
}

h3 {
    margin: 0 0 8px 0;
    font-size: 1.25rem;
    color: #f1f5f9;
    transition: color 0.3s ease;
}

.light-theme h3 {
    color: #1e293b;
}

p {
    margin: 0;
    opacity: 0.7;
    color: #94a3b8;
    transition: color 0.3s ease;
}

.light-theme p {
    color: #64748b;
}
</style>
