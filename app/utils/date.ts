// date 字段可能是 string 或 Date，统一归一为 YYYY-MM-DD 展示
export const toIsoDate = (value: string | Date | undefined): string => {
  if (!value) return ''
  return (value instanceof Date ? value.toISOString() : String(value)).slice(0, 10)
}
