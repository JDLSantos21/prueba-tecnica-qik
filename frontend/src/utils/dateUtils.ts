export function formatDateForDisplay(isoString: string | undefined): string {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getDateRangeLabel(
  start: string | undefined,
  end: string | undefined,
): string {
  if (!start && !end) return "Todas las fechas";
  if (start && end) {
    return `${formatDateForDisplay(start)} - ${formatDateForDisplay(end)}`;
  }
  if (start) return `Desde ${formatDateForDisplay(start)}`;
  return `Hasta ${formatDateForDisplay(end)}`;
}

export function toCalendarFormat(isoString: string | undefined): string {
  if (!isoString) return "";
  return isoString.split("T")[0];
}

export function fromCalendarFormat(dateString: string): string {
  return new Date(dateString + "T00:00:00").toISOString();
}

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}
