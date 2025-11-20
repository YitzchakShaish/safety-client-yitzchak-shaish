
/**
 * Validates a general text field.
 * @param value - The text entered in the field.
 * @param fieldLabel - The field name to show in the error message (for example: "Event description").
 * @param minLength - Optional minimum length for the text.
 * @returns A string with an error message, or null if the value is valid.
 */
export function validateTextField(
  value: unknown,
  fieldLabel: string,
  minLength?: number
): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  if (trimmed === "") {
    return `שדה זה (${fieldLabel}) הוא חובה`;
  }

  if (minLength && trimmed.length < minLength) {
    return `${fieldLabel} חייב להכיל לפחות ${minLength} תווים`;
  }

  if (!/^[\p{L}\s]+$/u.test(trimmed)) {
    return `${fieldLabel} יכול להכיל רק אותיות ורווחים`;
  }

  return null;
}


export function validateFullName(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  if (trimmed === "") {
    return "שדה זה הוא חובה";
  }

  if (!trimmed.includes(" ")) {
    return "נא להזין שם פרטי ושם משפחה";
  }

  if (!/^[\p{L}\s]+$/u.test(trimmed)) {
    return "השם יכול להכיל רק אותיות ורווחים";
  }

  return null;
}

export function validateDateRange(dateFrom: string | null, dateTo: string | null) {
  const today = new Date().toISOString().split("T")[0];

  if (dateFrom && dateFrom > today) {
    return { field: "dateFrom", message: "תאריך לא יכול להיות בעתיד." };
  }

  if (dateTo && dateTo > today) {
    return { field: "dateTo", message: "תאריך לא יכול להיות בעתיד." };
  }

  // Range check
  if (dateFrom && dateTo && dateFrom > dateTo) {
    return { field: "dateTo", message: "טווח תאריכים אינו חוקי"};
  }

  return null;
}
