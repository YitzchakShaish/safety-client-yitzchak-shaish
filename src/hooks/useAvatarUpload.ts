import { useEffect, useRef, useState } from "react";
import { removeMyAvatar, uploadMyAvatar } from "../api/users.api";
import { useUser } from "./useUser";
import { mergeUserAvatar } from "../utils/avatar";

type MessageType = "success" | "info" | "error";

export function useAvatarUpload() {
    const { user, updateUser } = useUser();
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<MessageType>("info");
    const timer = useRef<number | null>(null);

    useEffect(() => () => {
        if (timer.current) window.clearTimeout(timer.current);
    }, []);

    const dismiss = () => {
        if (timer.current) window.clearTimeout(timer.current);
        setMessage(null);
    };

    const showMessage = (text: string, type: MessageType = "info") => {
        if (timer.current) window.clearTimeout(timer.current);
        setMessage(text);
        setMessageType(type);
        timer.current = window.setTimeout(() => setMessage(null), 4000);
    };

    const upload = async (file: File) => {
        if (!user || busy) return false;
        setBusy(true);
        try {
            const result = await uploadMyAvatar(file);
            updateUser(mergeUserAvatar(user, result.data));
            showMessage(result.message || "תמונת הפרופיל עודכנה בהצלחה", "success");
            return true;
        } catch (err) {
            showMessage(err instanceof Error ? err.message : "לא ניתן להעלות את הקובץ", "error");
            return false;
        } finally {
            setBusy(false);
        }
    };

    const remove = async () => {
        if (!user || busy) return false;
        setBusy(true);
        try {
            const result = await removeMyAvatar();
            updateUser(mergeUserAvatar(user, result.data));
            showMessage(result.message || "תמונת הפרופיל הוסרה", "success");
            return true;
        } catch (err) {
            showMessage(err instanceof Error ? err.message : "לא ניתן להסיר את תמונת הפרופיל", "error");
            return false;
        } finally {
            setBusy(false);
        }
    };

    return { user, busy, message, messageType, upload, remove, showMessage, dismiss };
}
