"use server";

import { randomUUID } from "crypto";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { compare, hash } from "bcryptjs";
import { count, eq } from "drizzle-orm";

import type { NewUser } from "@/database/schema";
import type { resetPasswordSchema, signUpSchema } from "@/schemas/auth-schema";
import type { z } from "zod";

import { db } from "@/database";
import { users } from "@/database/schema";

export async function createNewAccount(
  credentials: z.infer<typeof signUpSchema>
) {
  const { email, password } = credentials;

  const hashedPassword = await hash(password, 10);

  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  if (user) {
    throw new Error("Email already exists, please try logging in");
  }

  await db
    .insert(users)
    .values({ username: randomUUID(), email, password: hashedPassword });

  redirect("/");
}

export async function resetPassword(
  credentials: z.infer<typeof resetPasswordSchema>
) {
  const { email, password, newPassword } = credentials;

  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  if (!user) {
    throw new Error("User not found, please try signing up");
  }

  if (!user.password) {
    throw new Error(
      "User does not have a password, you might have signed up with a social account"
    );
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Previous password is incorrect, please try again");
  }

  const hashedPassword = await hash(newPassword, 10);

  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.email, email));

  redirect("/login");
}

export async function updateUser(user: NewUser) {
  const usernameExists = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.username, user.username!),
  });

  if (usernameExists) {
    throw new Error("Username already exists, please try another one");
  }

  const [updatedUser] = await db
    .update(users)
    .set(user)
    .where(eq(users.id, user.id!))
    .returning();

  if (!updatedUser) {
    throw new Error("Failed to update user, please try again");
  }

  return updatedUser;
}

export async function deleteUser(userId: string) {
  const [deletedUser] = await db
    .delete(users)
    .where(eq(users.id, userId))
    .returning();

  if (!deletedUser) {
    throw new Error("Failed to delete user, please try again");
  }

  return deletedUser;
}
