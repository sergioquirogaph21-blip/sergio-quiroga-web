"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={onLogout}
      className="flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
    >
      <LogOut className="h-4 w-4" />
      Cerrar sesión
    </button>
  );
}
