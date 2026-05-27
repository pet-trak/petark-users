// utils/formatServiceLabel.ts
export function formatServiceLabel(service: string): string {
  return service
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}