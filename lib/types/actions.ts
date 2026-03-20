export type ActionState = {
  error: string | null;
  message: string | null;
};

export type ServerAction<TState> = (
  prevState: TState,
  formData: FormData,
) => Promise<TState>;

export type FormAction = ServerAction<ActionState>;
