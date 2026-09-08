export function revealInvalidControl(target: HTMLElement | null) {
  if (!target) return;

  target.scrollIntoView({ behavior: "smooth", block: "center" });
  if (typeof target.focus === "function") {
    window.requestAnimationFrame(() => {
      target.focus({ preventScroll: true });
    });
  }
}
