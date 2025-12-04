import { useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";

interface StatusAlertProps {
  open: boolean;
  statusCode: number;
  message?: string[];
  duration?: number;
  onClose: () => void;
}

export default function StatusAlert({
  open,
  statusCode,
  message = [],
  onClose,
  duration = 3000,
}: StatusAlertProps) {
  const severity = (() => {
    if (statusCode >= 200 && statusCode < 300) return "success";
    if (statusCode === 400) return "error";
    if (statusCode === 401) return "warning";
    if (statusCode === 403) return "error";
    if (statusCode >= 500) return "error";
    if (statusCode === 0) return "error";
    return "info";
  })() as "success" | "info" | "warning" | "error";

  const buildMessage = () => {
    if (statusCode >= 200 && statusCode < 300) {
      return message.length ? message.join("\n") : "הפעולה בוצעה בהצלחה";
    }

    switch (statusCode) {
      case 400:
        return message.length ? message.join("\n") : "שגיאת בקשה — בדוק את השדות";
      case 401:
        return message.length ? message.join("\n") : "אין אימות — התחבר מחדש";
      case 403:
        return message.length ? message.join("\n") : "אין הרשאה לבצע את הפעולה";
      case 0:
        return message.length ? message.join("\n") : "שגיאת רשת — בדוק חיבור אינטרנט";
      default:
        if (statusCode >= 500) return "שגיאת שרת פנימית — נסה שוב מאוחר יותר";
        return message.length ? message.join("\n") : "שגיאה לא צפויה";
    }
  };

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose(), duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={onClose}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="standard"
        sx={{
          width: "100%", whiteSpace: "pre-line", boxShadow: 3, "& .MuiAlert-action": {
            marginRight: 1.5,
          }
        }}
      >
        {buildMessage()}
      </Alert>
    </Snackbar>
  );
}
