
/**
 * מאמת טקסט כללי לשדות טפסים
 * @param value - הערך שהוזן בשדה
 * @param fieldLabel - שם השדה שיופיע בהודעת השגיאה (לדוגמה: "תיאור האירוע")
 * @param minLength - אורך מינימום אופציונלי
 * @returns מחרוזת עם הודעת שגיאה או null אם תקין
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
