"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Plus } from "lucide-react";
import { useRouter } from "next/dist/client/components/navigation";
import { useState } from "react";

export function CreateBlankButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { mutate } = api.articles.create.useMutation({
    onSuccess: async (data) => {
      router.push(`/articles/${data.id}/edit`);
      setIsLoading(false);
    },
  });

  const handleClick = () => {
    setIsLoading(true);
    mutate({ title: "", content: "", tags: [], user: {} });
  };
  return (
    <Button size="thin" onClick={handleClick} disabled={isLoading}>
      {isLoading ? (
        "Creating..."
      ) : (
        <>
          <Plus className="mr-1 h-4 w-4" />
          Create
        </>
      )}
    </Button>
  );
}
