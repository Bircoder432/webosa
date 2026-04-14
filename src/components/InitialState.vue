<template>
    <div class="initial-state" :class="{ 'light-theme': isLight }">
        <div class="initial-icon">🎓</div>
        <p>Выберите колледж, корпус и группу для просмотра расписания</p>
    </div>
</template>

<script>
export default {
    name: "InitialState",
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
.initial-state {
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
.initial-state.light-theme {
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.1),
        0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.initial-icon {
    font-size: 4rem;
    margin-bottom: 16px;
    opacity: 0.8;
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
