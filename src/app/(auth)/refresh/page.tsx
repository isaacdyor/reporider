"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function RefreshPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = searchParams.get("pathname");
  const supabase = createClient();

  useEffect(() => {
    const refreshSession = async () => {
      const { data, error } = await supabase.auth.refreshSession();

      console.log("refreshing session", data, error);

      if (error) {
        console.error(error);
      }

      if (pathname) {
        router.push(pathname);
      }
    };

    void refreshSession();
  }, [pathname, router, supabase.auth]);

  return null;
}

export default function RefreshPage() {
  return (
    <Suspense fallback={null}>
      <RefreshPageContent />
    </Suspense>
  );
}
