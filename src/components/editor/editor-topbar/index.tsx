"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsSaving } from "@/stores/editor-store";
import { type Article } from "@prisma/client";
import { CheckCheck, RefreshCw } from "lucide-react";
import { ExportButton } from "./export-button";

export function EditorTopbar({ article }: { article: Article }) {
  const isSaving = useIsSaving();

  return (
    <div className="flex items-center gap-4">
      {isSaving ? (
        <div className="flex items-center gap-1">
          <p className="text-xs text-muted-foreground">Saving...</p>
          <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <CheckCheck className="h-3 w-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Saved</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <ExportButton article={article} />
    </div>
  );
}
