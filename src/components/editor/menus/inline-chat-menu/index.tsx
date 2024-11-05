import { Button } from "@/components/ui/button";
import {
  useEditorStoreActions,
  useIsInlineChatOpen,
} from "@/stores/editor-store";
import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react";
import { X } from "lucide-react";
import { type MenuProps } from "../types";

export const InlineChatMenu = ({ editor }: MenuProps) => {
  const isInlineChatOpen = useIsInlineChatOpen();
  const { setIsInlineChatOpen } = useEditorStoreActions();

  if (!isInlineChatOpen) return null;

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey="inlineChatMenu"
      updateDelay={0}
      tippyOptions={{
        placement: "top",
        interactive: true,
        showOnCreate: true,
        onHide: () => {
          // Ensure state is updated when tippy hides
          setIsInlineChatOpen(false);
        },
      }}
    >
      <div className="size-40 bg-red-500">
        <p>hi</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsInlineChatOpen(false)}
        >
          <X className="size-4" />
        </Button>
      </div>
    </BaseBubbleMenu>
  );
};
