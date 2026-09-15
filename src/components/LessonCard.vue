<template>
    <div
        class="lesson-card"
        :class="{ 'light-theme': isLight, 'no-animation': disableAnimation, compact }"
        :style="{ animationDelay: disableAnimation ? '0s' : `${index * 0.1}s` }"
    >
        <div v-if="!compact" class="lesson-number">
            <span class="number" :class="{ 'is-kch': lesson.displayOrder === 'КЧ' }">
                {{ lesson.displayOrder !== undefined ? lesson.displayOrder : lesson.order }}
            </span>
        </div>

        <div class="lesson-content">
            <div class="lesson-header">
                <div class="time-badge">
                    <span v-if="compact" class="compact-number" :class="{ 'is-kch': lesson.displayOrder === 'КЧ' }">
                        {{ lesson.displayOrder !== undefined ? lesson.displayOrder : lesson.order }}
                    </span>
                    <span class="clock-icon"><i class="ri-time-line"></i></span>
                    {{ lesson.startTime }} – {{ lesson.endTime }}
                </div>
            </div>

            <div class="subject">{{ lesson.title }}</div>

            <div class="meta">
                <div class="meta-item cabinet">
                    <span class="meta-icon"><i class="ri-door-line"></i></span>
                    <span>{{ lesson.cabinet }}</span>
                </div>
                <div class="meta-item teacher">
                    <span class="meta-icon"><i class="ri-user-line"></i></span>
                    <span>{{ lesson.teacher }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "LessonCard",
    props: {
        lesson: { type: Object, required: true },
        index: { type: Number, default: 0 },
        disableAnimation: { type: Boolean, default: false },
        compact: { type: Boolean, default: false },
    },
    data() {
        return { isLight: document.body.classList.contains("light") };
    },
    mounted() {
        this.themeObserver = new MutationObserver(() => {
            this.isLight = document.body.classList.contains("light");
        });
        this.themeObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"],
        });
    },
    beforeUnmount() {
        if (this.themeObserver) this.themeObserver.disconnect();
    },
};
</script>

<style scoped>
.lesson-card {
    display: flex;
    gap: 16px;
    padding: 20px;
    border-radius: 16px;
    transition: all 0.3s ease;
    animation: slideIn 0.5s ease forwards;
    opacity: 0;
    transform: translateY(20px);
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.lesson-card.light-theme {
    background: #f1f5f9;
    border: 1px solid #e6e6e6;
}

.lesson-card.no-animation {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
}

.lesson-card:hover {
    border-color: #0b6dac;
    box-shadow: 0 10px 25px rgba(11, 109, 172, 0.15);
}

.lesson-number {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0b6dac, #21badc);
    color: white;
    font-weight: 700;
    font-size: 1.1rem;
    box-shadow: 0 4px 15px rgba(11, 109, 172, 0.3);
}

.number.is-kch {
    font-size: 0.85em;
    letter-spacing: 0.5px;
}

.lesson-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
}

.lesson-header { display: flex; align-items: center; gap: 12px; }

.time-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    background: rgba(11, 109, 172, 0.15);
    color: #21badc;
}

.light-theme .time-badge {
    background: rgba(11, 109, 172, 0.1);
    color: #0b6dac;
}

.clock-icon { font-size: 0.9rem; }

.compact-number { display: none; }

.lesson-card.compact .compact-number.is-kch {
    font-size: 0.75rem;
    font-weight: 700;
}

.subject {
    font-size: 1.15rem;
    font-weight: 700;
    line-height: 1.4;
    color: #f1f5f9;
    overflow-wrap: break-word;
}

.light-theme .subject { color: #1e293b; }

.meta { display: flex; flex-wrap: wrap; gap: 12px; }

.meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    padding: 6px 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    color: #94a3b8;
    min-width: 0;
}

.meta-item span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.light-theme .meta-item {
    background: rgba(0, 0, 0, 0.05);
    color: #64748b;
}

.meta-icon { font-size: 1rem; flex-shrink: 0; }

.lesson-card.compact {
    padding: 10px 12px;
    border-radius: 10px;
    gap: 6px;
}

.lesson-card.compact .lesson-content { gap: 5px; }

.lesson-card.compact .time-badge {
    font-size: 0.72rem;
    padding: 3px 8px;
    border-radius: 6px;
    gap: 5px;
    width: fit-content;
    max-width: 100%;
}

.lesson-card.compact .clock-icon { font-size: 0.75rem; }

.lesson-card.compact .compact-number {
    display: inline;
    font-size: 0.85rem;
    font-weight: 800;
    line-height: 1;
    flex-shrink: 0;
}

.lesson-card.compact .subject {
    font-size: 0.9rem;
    line-height: 1.3;
}

.lesson-card.compact .meta { gap: 5px; }

.lesson-card.compact .meta-item {
    font-size: 0.72rem;
    padding: 3px 7px;
    border-radius: 6px;
    gap: 4px;
}

.lesson-card.compact .meta-icon { font-size: 0.8rem; }

.lesson-card.compact:hover {
    box-shadow: 0 4px 12px rgba(11, 109, 172, 0.15);
}

@keyframes slideIn {
    to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 600px) {
    .lesson-card { flex-direction: column; gap: 12px; }
    .lesson-number { width: 40px; height: 40px; font-size: 1rem; }
}
</style>
