<template>
    <footer class="terminal-footer">
        <div class="footer-content">
            <span class="prompt">></span>
            <span class="text-muted text-lowercase">links:</span>
            <a
                href="https://github.com/ThisIsHyum/OpenScheduleApi"
                target="_blank"
                class="footer-link"
            >
                [api]
            </a>
            <span class="divider">|</span>
            <a
                href="https://github.com/Bircoder432/webosa"
                target="_blank"
                class="footer-link"
            >
                [source]
            </a>
        </div>
    </footer>
</template>

<script>
export default {
    name: "AppFooter",
};
</script>

<style scoped>
footer {
    border-top: 1px solid var(--border);
    padding: 1rem 0;
    margin-top: 2rem;
    font-size: 0.85rem;
}
.footer-links {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}
.footer-link {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--accent);
    padding: 0.25rem 0.5rem;
    border: 1px solid transparent;
    transition: all var(--transition-fast);
}
.footer-link:hover {
    color: var(--text-primary);
    border-color: var(--accent);
    background: var(--bg-secondary);
}
.link-icon {
    font-size: 0.9rem;
}
.divider {
    color: var(--border);
    opacity: 0.6;
}
</style>
