<template>
    <header class="app-header">
        <div class="logo">
            <span class="prompt">></span>
            <h1>college_schedule<span class="cursor"></span></h1>
        </div>
        <p class="subtitle text-muted text-lowercase">tyumen_region</p>
    </header>
</template>

<style scoped>
.app-header {
    text-align: left;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
}
.logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
}
.logo-icon {
    font-size: 1.5rem;
    color: var(--accent);
    animation: float 3s ease-in-out infinite;
}
h1 {
    font-size: 1.25rem;
    font-weight: 400;
    margin: 0;
    color: var(--text-primary);
}
.subtitle {
    font-size: 0.85rem;
    margin: 0;
    color: var(--text-secondary);
    text-transform: lowercase;
}
@keyframes float {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-3px);
    }
}
</style>
