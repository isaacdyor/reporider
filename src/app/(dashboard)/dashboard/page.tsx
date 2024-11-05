import { DashboardContentLayout } from "@/components/dashboard-content-layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { getSession } from "@/lib/supabase/server";
import Link from "next/link";
export default async function DashboardPage() {
  const session = await getSession();
  console.log("session", session);
  return (
    <DashboardContentLayout>
      <Link className={buttonVariants()} href="/repos">
        Create article
      </Link>
      <Button>Sign out</Button>
    </DashboardContentLayout>
  );
}
