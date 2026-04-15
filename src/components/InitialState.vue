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
    text-align: left;
    padding: 2rem 1.5rem;
    border: 1px dashed var(--border);
    background: var(--bg-card);
    margin-bottom: 1.5rem;
    font-family: var(--font-mono);
}
.initial-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    color: var(--text-secondary);
    display: inline-block;
}
.initial-icon::before {
    content: "[ ";
    color: var(--accent);
    margin-right: 0.25rem;
}
.initial-icon::after {
    content: " ]";
    color: var(--accent);
    margin-left: 0.25rem;
}
p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-secondary);
    line-height: 1.5;
}
</style>
