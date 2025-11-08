export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; message: string; errorCode?: string; errorId?: string };
