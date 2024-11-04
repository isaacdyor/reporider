"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function RefreshPage() {
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
