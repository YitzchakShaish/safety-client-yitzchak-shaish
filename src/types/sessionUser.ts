/** Signed-in user stored in session state. Fields stay optional where login and profile payloads differ. */
export interface SessionUser {
  id?: string;
  fullName: string;
  email?: string;
  rank?: string;
  role?: string;
  unit?: string;
  position?: string;
  avatarUrl?: string | null;
  reportsCount?: number;
  updatesCount?: number;
  deletesCount?: number;
}
