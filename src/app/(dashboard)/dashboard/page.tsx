import { DashboardContentLayout } from "@/components/dashboard-content-layout";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
export default async function DashboardPage() {
  return (
    <DashboardContentLayout>
      <Link className={buttonVariants()} href="/repos">
        Create article
      </Link>
      <Button>Sign out</Button>
    </DashboardContentLayout>
  );
}
