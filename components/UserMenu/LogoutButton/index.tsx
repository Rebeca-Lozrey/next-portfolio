import { useActionState } from "react";

import { logoutAction } from "@/actions/logoutAction";
import { ActionState } from "@/lib/types/actions";

import style from "./LogoutButton.module.css";

export default function LogoutButton() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    logoutAction,
    {
      message: null,
      error: null,
    },
  );
  return (
    <form action={formAction}>
      <button className={style.logoutButton} disabled={pending}>
        {pending ? "logging out" : state.error ? "Error" : "Logout"}
      </button>
    </form>
  );
}
