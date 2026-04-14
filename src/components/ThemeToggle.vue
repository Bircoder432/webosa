<template>
    <button
        class="theme-toggle"
        @click="toggle"
        :title="isDark ? 'Светлая тема' : 'Тёмная тема'"
    >
        <span class="theme-icon">{{ isDark ? "☀️" : "🌙" }}</span>
    </button>
</template>

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

<style scoped>
.theme-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background: linear-gradient(135deg, #6366f1, #818cf8);
    color: white;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.1),
        0 0 30px rgba(99, 102, 241, 0.25);
    transition: all 0.3s ease;
    z-index: 10000;
}

.theme-toggle:hover {
    transform: scale(1.1) rotate(15deg);
}

.theme-icon {
    display: block;
    transition: transform 0.3s ease;
}

.theme-toggle:hover .theme-icon {
    transform: scale(1.2);
}

@media (max-width: 600px) {
    .theme-toggle {
        top: 16px;
        right: 16px;
        width: 44px;
        height: 44px;
        font-size: 1.25rem;
    }
}
</style>
