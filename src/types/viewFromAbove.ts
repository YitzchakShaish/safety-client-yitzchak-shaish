import type { ReactNode } from "react";

export type StatCardProps = {
  icon: ReactNode;
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
  label: string;
  value: string | number;
  elevation?: number;
};
