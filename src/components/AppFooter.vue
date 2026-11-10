<template>
  <footer class="footer" :class="{ 'light-theme': isLight }">
    <div class="footer-links">
      <a
        href="https://github.com/ThisIsHyum/OpenScheduleApi"
        target="_blank"
        rel="noopener"
        class="footer-link"
      >
        <span class="link-icon"><i class="ri-thunderstorms-line"></i></span>
        <span class="link-text">OpenScheduleApi</span>
      </a>
      <span class="divider">•</span>

      <a
        href="https://storozhiloff.ru"
        target="_blank"
        rel="noopener"
        class="footer-link"
      >
        <span class="link-icon"><i class="ri-computer-line"></i></span>
        <span class="link-text">Разработчик</span>
      </a>
      <span class="divider">•</span>

      <a
        href="https://tkpst.ru"
        target="_blank"
        rel="noopener"
        class="footer-link"
      >
        <span class="link-icon"><i class="ri-global-line"></i></span>
        <span class="link-text">Сайт ТКПСТ</span>
      </a>
      <span class="divider">•</span>

      <router-link to="/app" class="footer-link">
        <span class="link-icon"><i class="ri-smartphone-line"></i></span>
        <span class="link-text">Приложение</span>
      </router-link>
      <span class="divider">•</span>

      <a
        href="https://storozhiloff.ru/donate"
        target="_blank"
        rel="noopener"
        class="donate-badge"
        title="Поддержать разработку"
      >
        <i class="ri-heart-fill"></i>
        <span class="link-text">Поддержать</span>
      </a>
    </div>
  </footer>
</template>

<script>
import { useTheme } from "../composables/useTheme.js";

export default {
  name: "AppFooter",
  setup() {
    const { isLight } = useTheme();
    return { isLight };
  },
};
</script>

<style scoped>
.footer {
  text-align: center;
  padding: 20px 16px;
  padding-bottom: max(20px, env(safe-area-inset-bottom));
  padding-left: max(16px, env(safe-area-inset-left));
  padding-right: max(16px, env(safe-area-inset-right));
  margin-top: 20px;
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px 12px;
  max-width: 900px;
  margin: 0 auto;
}

/* ---------- обычные ссылки ---------- */
.footer-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 18px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  background: rgba(11, 109, 172, 0.1);
  color: #21badc;
  border: 1px solid rgba(11, 109, 172, 0.2);
  transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease,
    box-shadow 0.2s ease, border-color 0.2s ease;
}

.light-theme .footer-link {
  background: rgba(11, 109, 172, 0.08);
  color: #0b6dac;
  border-color: rgba(11, 109, 172, 0.15);
}

.footer-link:visited {
  color: #21badc;
}
.light-theme .footer-link:visited {
  color: #0b6dac;
}

.link-icon {
  font-size: 1rem;
  line-height: 1;
  flex-shrink: 0;
}

.divider {
  opacity: 0.4;
  color: #94a3b8;
  user-select: none;
}
.light-theme .divider {
  color: #64748b;
}

/* ---------- золотая плашка «Поддержать» ---------- */
.donate-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 44px;
  padding: 10px 18px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  white-space: nowrap;
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
  transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease,
    box-shadow 0.2s ease, border-color 0.2s ease;
}

.light-theme .donate-badge {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border-color: rgba(245, 158, 11, 0.25);
}

.donate-badge i {
  font-size: 1rem;
  line-height: 1;
  animation: heartbeat 1.8s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

/* ---------- ховер только для мыши (на таче залипает) ---------- */
@media (hover: hover) and (pointer: fine) {
  .footer-link:hover {
    background: rgba(11, 109, 172, 0.25);
    color: #0c94c8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(11, 109, 172, 0.2);
  }
  .light-theme .footer-link:hover {
    background: rgba(11, 109, 172, 0.2);
    color: #084e73;
    box-shadow: 0 4px 12px rgba(11, 109, 172, 0.15);
  }
  .donate-badge:hover {
    background: rgba(251, 191, 36, 0.25);
    color: #fcd34d;
    border-color: rgba(251, 191, 36, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(251, 191, 36, 0.25);
  }
  .light-theme .donate-badge:hover {
    background: rgba(245, 158, 11, 0.2);
    color: #b45309;
    border-color: rgba(245, 158, 11, 0.4);
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.15);
  }
}

/* тактильный отклик для пальца */
.footer-link:active,
.donate-badge:active {
  transform: scale(0.96);
}

/* ---------- планшет ---------- */
@media (max-width: 900px) {
  .divider {
    display: none;
  }
  .footer-links {
    gap: 10px;
  }
}

/* ---------- телефон: сетка 2 колонки ---------- */
@media (max-width: 600px) {
  .footer {
    padding: 16px 12px;
    padding-bottom: max(16px, env(safe-area-inset-bottom));
    padding-left: max(12px, env(safe-area-inset-left));
    padding-right: max(12px, env(safe-area-inset-right));
    margin-top: 12px;
  }

  .footer-links {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .footer-link,
  .donate-badge {
    width: 100%;
    padding: 11px 10px;
    font-size: 0.82rem;
    border-radius: 11px;
    gap: 6px;
  }

  /* длинный OpenScheduleApi и «Поддержать» — на всю ширину */
  .footer-link:first-child,
  .donate-badge {
    grid-column: 1 / -1;
  }

  .donate-badge {
    margin-top: 2px;
    font-size: 0.88rem;
  }

  .link-icon,
  .donate-badge i {
    font-size: 0.95rem;
  }
}

/* ---------- совсем узкие экраны ---------- */
@media (max-width: 360px) {
  .footer-links {
    grid-template-columns: 1fr;
  }
  .footer-link,
  .donate-badge {
    font-size: 0.85rem;
  }
}

/* уважение к настройке «меньше движения» */
@media (prefers-reduced-motion: reduce) {
  .donate-badge i {
    animation: none;
  }
  .footer-link,
  .donate-badge {
    transition: none;
  }
}
</style>
