import { createApp, h, nextTick } from "vue";
import html2canvas from "html2canvas";

const TARGET_SCALE = 3;
const MAX_CANVAS_DIM = 8192;

export function useExport() {
    const exportToImage = async (
        lessons,
        groupName,
        date,
        isLight,
        isWeek = false,
        weekData = [],
    ) => {
        const ghostId = `export-ghost-${Date.now()}`;
        const ghost = document.createElement("div");
        ghost.id = ghostId;

        const DAY_W = 300;
        const GAP = 12;
        const daysCount = weekData.length || 6;
        const PAD = 32 * 2 + 20 * 2 + 8;
        const weekWidth = daysCount * DAY_W + (daysCount - 1) * GAP + PAD;

        Object.assign(ghost.style, {
            position: "absolute",
            left: "-99999px",
            top: "0",
            width: isWeek ? `${weekWidth}px` : "800px",
            padding: "32px",
            background: isLight ? "#f8fafc" : "#0f172a",
        });
        ghost.classList.add(isLight ? "light" : "dark");
        document.body.appendChild(ghost);

        const killStyle = document.createElement("style");
        killStyle.textContent = `
            #${ghostId} *, #${ghostId} *::before, #${ghostId} *::after {
                animation: none !important;
                transition: none !important;
            }
            #${ghostId} .lesson-card,
            #${ghostId} .break-indicator,
            #${ghostId} .day-column,
            #${ghostId} .schedule-card {
                opacity: 1 !important;
                transform: none !important;
            }
            #${ghostId} .days-scroll {
                overflow: visible !important;
                padding-bottom: 0 !important;
            }
            #${ghostId} .days-row {
                display: grid !important;
                grid-template-columns: repeat(${daysCount}, ${DAY_W}px) !important;
                gap: ${GAP}px !important;
                min-width: 0 !important;
            }
            #${ghostId} .day-column {
                width: auto !important;
                min-width: 0 !important;
                max-width: none !important;
            }
            #${ghostId} .day-column-body {
                max-height: none !important;
                overflow: visible !important;
            }
        `;
        ghost.appendChild(killStyle);

        const mountPoint = document.createElement("div");
        ghost.appendChild(mountPoint);

        let component;
        let props;
        if (isWeek && weekData.length > 0) {
            component = (await import("../components/WeekGrid.vue")).default;
            props = {
                weekSchedule: weekData,
                isLight,
                groupName,
                disableAnimation: true,
                hideExportBtn: true,
                exportMode: true,
            };
        } else {
            component = (await import("../components/ScheduleCard.vue")).default;
            props = {
                lessons,
                groupName,
                date,
                disableAnimation: true,
                hideExportBtn: true,
            };
        }

        const app = createApp({ render: () => h(component, props) });
        app.mount(mountPoint);
        await nextTick();
        await new Promise((r) => setTimeout(r, 200));

        try {
            const fullWidth = ghost.scrollWidth;
            const fullHeight = ghost.scrollHeight;

            const maxDim = Math.max(fullWidth, fullHeight);
            let scale = TARGET_SCALE;
            if (maxDim * scale > MAX_CANVAS_DIM) {
                scale = Math.max(1, Math.floor((MAX_CANVAS_DIM / maxDim) * 10) / 10);
            }

            const canvas = await html2canvas(ghost, {
                backgroundColor: isLight ? "#f8fafc" : "#0f172a",
                scale,
                useCORS: true,
                allowTaint: true,
                logging: false,
                width: fullWidth,
                height: fullHeight,
                windowWidth: fullWidth + 100,
                windowHeight: fullHeight + 100,
                scrollX: 0,
                scrollY: 0,
            });

            const link = document.createElement("a");
            link.download = isWeek
                ? `расписание_неделя_${groupName}.png`
                : `расписание_${groupName}_${(date || "").replace(/\./g, "-")}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (e) {
            console.error("Export error:", e);
            alert("Не удалось сохранить расписание");
        } finally {
            app.unmount();
            ghost.remove();
        }
    };

    return { exportToImage };
}
