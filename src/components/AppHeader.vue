<template>
    <header class="app-header">
        <div class="logo">
            <div class="logo-icon">📚</div>
            <h1>Расписание ТКПСТ</h1>
        </div>
    </header>
</template>

<style scoped>
.app-header {
    text-align: center;
    margin-bottom: 40px;
}

.logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 8px;
}

.logo-icon {
    font-size: 2.5rem;
    animation: float 3s ease-in-out infinite;
}

h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, #0B6DAC, #21BADC);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

@media (max-width: 600px) {
    h1 {
        font-size: 1.5rem;
    }

    .logo-icon {
        font-size: 2rem;
    }
}
</style>
