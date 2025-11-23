// If you change ActionSuccess, you should also update the implementation of runActionWithDbHandling in action.types.ts.
export type ActionSuccess<T = void> = {
  ok: true;
  message?: string;
} & (T extends void ? { data?: undefined } : { data: T });

// ActionFailure is handled via thrown exceptions; ActionResult models only the success branch.
export type ActionResult<T = void> = ActionSuccess<T>;
