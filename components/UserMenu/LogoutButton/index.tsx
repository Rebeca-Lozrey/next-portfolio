"use client";

import { SubmitEvent } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { articlesKeys } from "@/lib/modules/articles/articles.keys";
import { logout } from "@/lib/modules/auth/auth.api";
import { usersKeys } from "@/lib/modules/users/users.keys";

import style from "./LogoutButton.module.css";

export default function LogoutButton() {
  const queryClient = useQueryClient();

  const router = useRouter();
  const pathname = usePathname();
  const protectedRoutes = ["/profile", "/my-articles"];

  const logoutMutation = useMutation({
    mutationFn: logout,
    onError: (err, _vars) => {
      console.error("Failed to logout user: ", err);
    },
    onSuccess: () => {
      if (protectedRoutes.includes(pathname)) {
        router.push("/login");
      } else {
        router.refresh();
      }
      queryClient.setQueryData(usersKeys.current, null);
      queryClient.removeQueries({
        queryKey: articlesKeys.myArticles(null),
      });
    },
  });
  const { isPending, error } = logoutMutation;

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    logoutMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" className={style.logoutButton} disabled={isPending}>
        {isPending ? "logging out" : error?.message ? "Error" : "Logout"}
      </button>
    </form>
  );
}
