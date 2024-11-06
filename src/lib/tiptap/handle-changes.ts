import { type ChangePosition } from "@/components/editor/menus/text-menu/components/inline-chat-menu";
import { type Editor } from "@tiptap/react";

interface HandleChangesProps {
  editor: Editor;
  currentChangeRef: React.MutableRefObject<ChangePosition | null>;
  setIsOpen: (isOpen: boolean) => void;
}

export const handleAcceptChanges = ({
  editor,
  currentChangeRef,
  setIsOpen,
}: HandleChangesProps) => {
  if (!currentChangeRef.current) return;

  const { originalTextPos } = currentChangeRef.current;

  const tr = editor.state.tr;

  tr.delete(originalTextPos.from, originalTextPos.to);

  tr.removeMark(0, tr.doc.content.size, editor.schema.marks.highlight);

  editor.view.dispatch(tr);
  setIsOpen(false);
  currentChangeRef.current = null;
};

export const handleRejectChanges = ({
  editor,
  currentChangeRef,
  setIsOpen,
}: HandleChangesProps) => {
  if (!currentChangeRef.current) return;

  const { suggestedTextPos } = currentChangeRef.current;

  const tr = editor.state.tr;

  // Delete the suggested (green) text
  tr.delete(suggestedTextPos.from, suggestedTextPos.to);

  // Remove all highlight marks, just like in accept
  tr.removeMark(0, tr.doc.content.size, editor.schema.marks.highlight);

  editor.view.dispatch(tr);
  setIsOpen(false);
  currentChangeRef.current = null;
};
