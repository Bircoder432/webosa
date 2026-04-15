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
            <span class="dropdown-arrow">▼</span>
        </div>
        <div class="dropdown-menu" v-show="isOpen">
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
        };
    },
    computed: {
        isLight() {
            return document.body.classList.contains("light");
        },
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
        toggle() {
            if (this.disabled) return;
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
    font-family: var(--font-mono);
}
.dropdown-trigger {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 0.75rem;
    background: var(--bg-card);
    border: 1px solid var(--border);
    color: var(--text-primary);
    font-family: inherit;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: border-color var(--transition-fast);
}
.dropdown-trigger:hover:not(.disabled) {
    border-color: var(--accent);
}
.custom-dropdown.active .dropdown-trigger {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent-glow);
}
.dropdown-trigger.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.dropdown-trigger .placeholder {
    color: var(--text-secondary);
}
.dropdown-arrow {
    font-size: 0.6rem;
    color: var(--text-secondary);
    transition: transform var(--transition-fast);
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
}
.custom-dropdown.active .dropdown-arrow {
    transform: translateY(-50%) rotate(180deg);
}
.dropdown-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    max-height: 240px;
    overflow-y: auto;
    background: var(--bg-card);
    border: 1px solid var(--border);
    z-index: 100;
    animation: dropdownSlide 0.15s ease;
}
.dropdown-item {
    padding: 0.6rem 0.75rem;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.85rem;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border);
    transition: all var(--transition-fast);
    text-transform: lowercase;
}
.dropdown-item:last-child {
    border-bottom: none;
}
.dropdown-item:hover {
    background: var(--bg-secondary);
    color: var(--accent);
}
.dropdown-item.active {
    background: var(--accent);
    color: var(--bg-primary);
}
.dropdown-item.active:hover {
    background: var(--accent-dim);
}
@keyframes dropdownSlide {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
