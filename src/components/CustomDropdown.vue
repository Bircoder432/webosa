<template>
    <div
        class="custom-dropdown"
        :class="{ active: isOpen, disabled: disabled, 'light-theme': isLight }"
        v-click-outside="close"
    >
        <div
            class="dropdown-trigger"
            @click="toggle"
            :class="{ disabled: disabled }"
        >
            <span :class="{ placeholder: !modelValue }">
                {{ displayValue || placeholder }}
            </span>
            <span class="dropdown-arrow"><i class="ri-arrow-down-s-line"></i></span>
        </div>
        <div class="dropdown-menu" :class="{ 'drop-up': dropUp }" v-show="isOpen">
            <div
                v-for="item in items"
                :key="getItemValue(item)"
                class="dropdown-item"
                :class="{ active: modelValue === getItemValue(item) }"
                @click="select(item)"
            >
                {{ getItemLabel(item) }}
            </div>
        </div>
    </div>
</template>

<script>
import clickOutside from "../directives/clickOutside.js";
import { useTheme } from "../composables/useTheme.js";

export default {
    name: "CustomDropdown",
    directives: {
        "click-outside": clickOutside,
    },
    props: {
        modelValue: [String, Number],
        items: {
            type: Array,
            default: () => [],
        },
        placeholder: {
            type: String,
            default: "Выберите...",
        },
        disabled: Boolean,
        labelKey: {
            type: String,
            default: "name",
        },
        valueKey: {
            type: String,
            default: "id",
        },
    },
    emits: ["update:modelValue", "change"],
    data() {
        return {
            isOpen: false,
            dropUp: false,
        };
    },
    setup() {
        const { isLight } = useTheme();
        return { isLight };
    },
    computed: {
        displayValue() {
            if (!this.modelValue) return "";
            const item = this.items.find(
                (i) => i[this.valueKey] === this.modelValue,
            );
            return item ? item[this.labelKey] : "";
        },
    },
    methods: {
        getItemValue(item) {
            return item[this.valueKey];
        },
        getItemLabel(item) {
            return item[this.labelKey];
        },
        // Решаем, куда раскрыться: вниз или вверх
        updateDirection() {
            const el = this.$el;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const MENU_HEIGHT = 280; // max-height меню
            const GAP = 8;
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            this.dropUp =
                spaceBelow < MENU_HEIGHT + GAP + 16 && spaceAbove > spaceBelow;
        },
        toggle() {
            if (this.disabled) return;
            if (!this.isOpen) this.updateDirection();
            this.isOpen = !this.isOpen;
        },
        close() {
            this.isOpen = false;
        },
        select(item) {
            this.$emit("update:modelValue", this.getItemValue(item));
            this.$emit("change");
            this.isOpen = false;
        },
    },
};
</script>

<style scoped>
.custom-dropdown {
    position: relative;
}

.dropdown-trigger {
    width: 100%;
    padding: 12px 40px 12px 14px;
    border-radius: 12px;
    border: 2px solid transparent;
    font-size: 0.95rem;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;

    background: #0f172a;
    color: #f1f5f9;
    border-color: rgba(255, 255, 255, 0.1);
}

.light-theme .dropdown-trigger {
    background: #ffffff;
    color: #1e293b;
    border-color: #E6E6E6;
}

.dropdown-trigger:hover:not(.disabled) {
    border-color: #21BADC;
}

.custom-dropdown.active .dropdown-trigger {
    border-color: #0B6DAC;
    box-shadow: 0 0 0 3px rgba(11, 109, 172, 0.15);
}

.dropdown-trigger.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.dropdown-trigger .placeholder {
    opacity: 0.6;
}

.dropdown-arrow {
    font-size: 0.7rem;
    transition: transform 0.2s ease;
}

.custom-dropdown.active .dropdown-arrow {
    transform: rotate(180deg);
}

.dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    max-height: 280px;
    overflow-y: auto;
    border-radius: 12px;
    z-index: 100;
    animation: dropdownSlide 0.2s ease;

    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow:
        0 20px 25px -5px rgba(0, 0, 0, 0.3),
        0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

/* Раскрытие ВВЕРХ, когда внизу нет места */
.dropdown-menu.drop-up {
    top: auto;
    bottom: calc(100% + 8px);
    animation: dropdownSlideUp 0.2s ease;
}

.light-theme .dropdown-menu {
    background: #ffffff;
    border: 1px solid #E6E6E6;
    box-shadow:
        0 20px 25px -5px rgba(0, 0, 0, 0.15),
        0 10px 10px -5px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.15s ease;
    font-size: 0.9rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    color: #f1f5f9;
}

.light-theme .dropdown-item {
    border-bottom-color: #f1f5f9;
    color: #1e293b;
}

.dropdown-item:last-child {
    border-bottom: none;
}

.dropdown-item:hover {
    background: rgba(255, 255, 255, 0.05);
}

.light-theme .dropdown-item:hover {
    background: rgba(0, 0, 0, 0.03);
}

.dropdown-item.active {
    background: linear-gradient(135deg, #0B6DAC, #21BADC) !important;
    color: white;
    font-weight: 600;
}

@keyframes dropdownSlide {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes dropdownSlideUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.dropdown-menu::-webkit-scrollbar {
    width: 6px;
}

.dropdown-menu::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #0B6DAC;
}
</style>
