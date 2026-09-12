import { ref, computed, readonly } from "vue";

const isDark = ref(document.body.classList.contains("dark"));

const applyTheme = (dark) => {
    document.body.classList.remove("dark", "light");
    document.body.classList.add(dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
};

const syncFromDOM = () => {
    isDark.value = document.body.classList.contains("dark");
};

const observer = new MutationObserver(syncFromDOM);
observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
});

export function useTheme() {
    const isLight = computed(() => !isDark.value);

    const setTheme = (dark) => {
        isDark.value = !!dark;
        applyTheme(!!dark);
    };

    const toggleTheme = () => {
        setTheme(!isDark.value);
    };

    return {
        isDark: readonly(isDark),
        isLight,
        toggleTheme,
        setTheme,
    };
}
