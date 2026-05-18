// users.mapper.ts
import { PublicUser, User } from "./users.types";

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
  };
}
