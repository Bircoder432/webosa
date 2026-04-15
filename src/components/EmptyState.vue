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
    text-align: left;
    padding: 2rem 1.5rem;
    border: 1px dashed var(--border);
    background: var(--bg-card);
    margin-bottom: 1.5rem;
    font-family: var(--font-mono);
}
.empty-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    color: var(--text-secondary);
    display: inline-block;
}
.empty-icon::before {
    content: "[ ";
    color: var(--accent);
    margin-right: 0.25rem;
}
.empty-icon::after {
    content: " ]";
    color: var(--accent);
    margin-left: 0.25rem;
}
h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    font-weight: 400;
    color: var(--text-primary);
}
p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-secondary);
}
</style>
