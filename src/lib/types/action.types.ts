// If you change ActionSuccess, you should also update the implementation of runActionWithDbHandling in action.types.ts.
export type ActionSuccess<T = void> = {
  ok: true;
  message?: string;
} & (T extends void ? { data?: undefined } : { data: T });

export type ActionFailure = {
  ok: false;
  message: string;
  errorCode?: string;
  errorId?: string;
};

export type ActionResult<T = void> = ActionSuccess<T> | ActionFailure;
