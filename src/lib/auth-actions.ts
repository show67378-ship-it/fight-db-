"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const password = (formData.get("password") as string | null)?.trim() ?? "";
  const next = (formData.get("next") as string | null) || "/admin";
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || password !== expected) {
    redirect(`/admin/login?next=${encodeURIComponent(next)}&error=1`);
  }

  const store = await cookies();
  store.set("admin_auth", password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect(next);
}

export async function logout() {
  const store = await cookies();
  store.delete("admin_auth");
  redirect("/admin/login");
}

export async function siteLogin(formData: FormData) {
  const password = (formData.get("password") as string | null)?.trim() ?? "";
  const next = (formData.get("next") as string | null) || "/";
  const expected = process.env.SITE_PASSWORD;

  if (!expected || password !== expected) {
    redirect(`/site-login?next=${encodeURIComponent(next)}&error=1`);
  }

  const store = await cookies();
  store.set("site_auth", password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect(next);
}
