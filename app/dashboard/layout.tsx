import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { DashboardHeader } from "@/components/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <DashboardHeader userName={session!.name} />
      <main className="mx-auto max-w-6xl px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}
