import { type ChangePosition } from "@/components/editor/menus/text-menu/components/inline-chat-menu";
import { type Editor } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";

export const renderEdits = (
  editor: Editor,
  edits: string,
  currentChangeRef: React.MutableRefObject<ChangePosition | null>,
) => {
  const { from, to } = editor.state.selection;
  const originalPos = { from, to };

  // Store the original content before any changes
  const originalContent = editor.state.doc.textBetween(
    originalPos.from,
    originalPos.to,
  );

  // Create transaction and ensure selection
  const tr = editor.state.tr;
  tr.setSelection(editor.state.selection);

  // Delete the original content first
  tr.delete(from, to);
  editor.view.dispatch(tr);

  // Insert and mark suggested (new) content
  const suggestedFrom = from;
  editor.commands.insertContent(edits, {
    parseOptions: {
      preserveWhitespace: false,
    },
  });
  const suggestedTo = editor.state.selection.to;

  // Insert and mark original content
  const originalFrom = suggestedTo;
  editor.commands.insertContent(originalContent, {
    parseOptions: {
      preserveWhitespace: false,
    },
  });
  const originalTo = editor.state.selection.to;

  // Add highlight marks
  const highlightMark = editor.schema.marks.highlight;
  if (!highlightMark) return;

  // Apply highlights in a new transaction
  const markTr = editor.state.tr;

  // Add green highlight to suggested text
  markTr.addMark(
    suggestedFrom,
    suggestedTo,
    highlightMark.create({
      color: "var(--highlight-green)",
    }),
  );

  // Add red highlight to original text
  markTr.addMark(
    originalFrom,
    originalTo,
    highlightMark.create({ color: "var(--highlight-red)" }),
  );

  // Set the final selection to cover both sections
  const newSelection = TextSelection.create(
    markTr.doc,
    suggestedFrom,
    originalTo,
  );
  markTr.setSelection(newSelection);

  editor.view.dispatch(markTr);

  currentChangeRef.current = {
    suggestedTextPos: { from: suggestedFrom, to: suggestedTo },
    originalTextPos: { from: originalFrom, to: originalTo },
  };
};
