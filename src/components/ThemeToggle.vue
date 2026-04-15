<template>
    <button
        class="theme-toggle"
        @click="toggle"
        :title="isDark ? 'light_mode' : 'dark_mode'"
    >
        <span class="prompt">></span>
        <span class="theme-label text-lowercase">{{
            isDark ? "dark" : "light"
        }}</span>
    </button>
</template>

<style scoped>
.theme-toggle {
    position: fixed;
    top: 1rem;
    right: 1rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border);
    background: var(--bg-card);
    color: var(--text-secondary);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    transition: all var(--transition-fast);
    z-index: 1000;
    text-transform: lowercase;
}
.theme-toggle:hover {
    border-color: var(--accent);
    color: var(--accent);
}
.theme-icon {
    font-size: 1rem;
    opacity: 0.9;
}
@media (max-width: 600px) {
    .theme-toggle {
        top: 0.75rem;
        right: 0.75rem;
        padding: 0.4rem 0.6rem;
        font-size: 0.75rem;
    }
    .theme-label {
        display: none;
    }
}
</style>
<script>
export default {
    name: "ThemeToggle",
    props: {
        isDark: Boolean,
    },
    emits: ["toggle"],
    methods: {
        toggle() {
            this.$emit("toggle");
        },
    },
};
</script>
