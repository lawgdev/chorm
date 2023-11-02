export function validateParam(obj: { [x: string]: string }) {
  return Object.values(obj).join(" ").trim();
}
