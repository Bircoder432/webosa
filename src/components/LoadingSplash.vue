<template>
    <div class="splash-card" :class="{ 'light-theme': isLight }">
        <div class="splash-icon"><i class="ri-loader-4-line"></i></div>
        <p class="splash-text">{{ text }}</p>
        <div class="skeleton-list">
            <div
                v-for="n in 4"
                :key="n"
                class="skeleton-row"
                :style="{ animationDelay: `${(n - 1) * 0.15}s` }"
            >
                <div class="skeleton-circle"></div>
                <div class="skeleton-lines">
                    <div class="skeleton-line w40"></div>
                    <div class="skeleton-line w90"></div>
                    <div class="skeleton-line w60"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useTheme } from "../composables/useTheme.js";

export default {
    name: "LoadingSplash",
    props: {
        text: {
            type: String,
            default: "Загружаем расписание...",
        },
    },
    setup() {
        const { isLight } = useTheme();
        return { isLight };
    },
};
</script>

<style scoped>
.splash-card {
    border-radius: 24px;
    padding: 40px 28px;
    margin-bottom: 24px;
    text-align: center;
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    animation: fadeIn 0.3s ease;
}

.splash-card.light-theme {
    background: #ffffff;
    border-color: #e6e6e6;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.splash-icon {
    display: inline-block;
    margin-bottom: 12px;
}

.splash-icon i {
    display: block;
    font-size: 3rem;
    color: #21badc;
    animation: spin 1s linear infinite;
}

.splash-text {
    margin: 0 0 28px;
    font-size: 1.05rem;
    font-weight: 600;
    color: #94a3b8;
}

.light-theme .splash-text {
    color: #64748b;
}

.skeleton-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 560px;
    margin: 0 auto;
}

.skeleton-row {
    display: flex;
    gap: 14px;
    align-items: center;
    padding: 16px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.04);
    animation: pulse 1.2s ease-in-out infinite;
}

.light-theme .skeleton-row {
    background: rgba(0, 0, 0, 0.03);
}

.skeleton-circle {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.08);
    flex-shrink: 0;
}

.light-theme .skeleton-circle {
    background: rgba(0, 0, 0, 0.06);
}

.skeleton-lines {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.skeleton-line {
    height: 10px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.08);
}

.light-theme .skeleton-line {
    background: rgba(0, 0, 0, 0.06);
}

.w40 { width: 40%; }
.w60 { width: 60%; }
.w90 { width: 90%; }

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.45; }
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
