import { ref, onMounted, onUnmounted } from "vue";

const MIN_THRESHOLD = 1024;
const MAX_THRESHOLD = 1280;

export function getMobileThreshold() {
    return Math.min(
        MAX_THRESHOLD,
        Math.max(MIN_THRESHOLD, window.screen.width / 2),
    );
}

export function useViewport() {
    const isMobile = ref(window.innerWidth <= getMobileThreshold());

    const onResize = () => {
        isMobile.value = window.innerWidth <= getMobileThreshold();
    };

    onMounted(() => window.addEventListener("resize", onResize));
    onUnmounted(() => window.removeEventListener("resize", onResize));

    return { isMobile, getMobileThreshold };
}
