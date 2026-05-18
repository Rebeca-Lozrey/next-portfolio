"use client";

import { createContext, useContext } from "react";

import { useQuery } from "@tanstack/react-query";

import { fetchCurrentUser } from "@/lib/modules/users/users.api";
import { usersKeys } from "@/lib/modules/users/users.keys";
import { PublicUser } from "@/lib/modules/users/users.types";

const UserContext = createContext<PublicUser | null>(null);

export function UserProvider({
  initialUser,
  children,
}: {
  initialUser: PublicUser | null;
  children: React.ReactNode;
}) {
  const { data: user } = useQuery({
    queryKey: usersKeys.current,
    queryFn: fetchCurrentUser,
    initialData: initialUser,
    staleTime: 1000 * 60 * 5,
  });
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
