"use client";

import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { Toolbar } from "@/components/ui/toolbar";
import { getContext, getSelection } from "@/lib/wordware/formatNode";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Popover from "@radix-ui/react-popover";
import { TextSelection } from "@tiptap/pm/state";
import { type Editor } from "@tiptap/react";
import { X } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  edit: z.string().min(1, {
    message: "Message must be at least 1 character.",
  }),
});

const MemoButton = memo(Toolbar.Button);

interface ChangePosition {
  suggestedTextPos: { from: number; to: number };
  originalTextPos: { from: number; to: number };
}

export function InlineChatMenu({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "submitted"
  >("idle");

  const currentChangeRef = useRef<ChangePosition | null>(null);

  const { mutate } = api.wordware.inlineEdit.useMutation({
    onSuccess: (result) => {
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
      editor.commands.insertContent(result.edit, {
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

      // Update the current change reference
      currentChangeRef.current = {
        suggestedTextPos: { from: suggestedFrom, to: suggestedTo },
        originalTextPos: { from: originalFrom, to: originalTo },
      };

      setSubmitStatus("submitted");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      edit: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitStatus("submitting");
    const context = getContext(editor);
    const selection = getSelection(editor);
    mutate({
      context: JSON.stringify(context),
      selection: selection ?? "",
      edit: values.edit,
    });
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => form.setFocus("edit"), 0);
    } else {
      setSubmitStatus("idle");
      form.reset();
    }
  }, [form, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && submitStatus === "idle") {
      e.preventDefault();
      void form.handleSubmit(onSubmit)();
    }
  };

  const handleAcceptChanges = () => {
    if (!currentChangeRef.current) return;

    const { originalTextPos } = currentChangeRef.current;

    const tr = editor.state.tr;

    tr.delete(originalTextPos.from, originalTextPos.to);

    tr.removeMark(0, tr.doc.content.size, editor.schema.marks.highlight);

    editor.view.dispatch(tr);
    setIsOpen(false);
    currentChangeRef.current = null;
  };

  const handleRejectChanges = () => {
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

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
      if (
        e.key === "Enter" &&
        (e.metaKey || e.ctrlKey) &&
        submitStatus === "submitted"
      ) {
        e.preventDefault();
        handleAcceptChanges();
      }
      if (
        e.key === "Backspace" &&
        (e.metaKey || e.ctrlKey) &&
        submitStatus === "submitted"
      ) {
        e.preventDefault();
        handleRejectChanges();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [editor, submitStatus]);

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setSubmitStatus("idle");
        }
      }}
    >
      <Popover.Trigger asChild>
        <MemoButton tooltip="Chat" tooltipShortcut={["Mod", "K"]}>
          <Icon name="Sparkles" />
          Chat
        </MemoButton>
      </Popover.Trigger>
      <Popover.Content
        onOpenAutoFocus={(e) => e.preventDefault()}
        side="bottom"
        asChild
      >
        <div className="relative flex w-80 flex-col gap-2 rounded-md border bg-background p-2 pb-4">
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
            variant="ghost"
            className="absolute right-2 top-2 size-6 p-0"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </Button>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="edit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">
                      Suggest Edits
                    </FormLabel>
                    <FormControl>
                      <AutosizeTextarea
                        placeholder="Editing instructions..."
                        className="resize-none rounded-none border-none p-0 text-xs text-foreground focus-visible:ring-0"
                        onKeyDown={handleKeyDown}
                        minHeight={32}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button
                  size="tiny"
                  type="submit"
                  disabled={submitStatus === "submitting"}
                >
                  {submitStatus === "submitting" && "Submitting..."}
                  {submitStatus === "submitted" && "Accept (⌘ ↵)"}
                  {submitStatus === "idle" && "Submit"}
                </Button>
                {submitStatus === "submitted" && (
                  <Button
                    size="tiny"
                    variant="ghost"
                    onClick={handleRejectChanges}
                    className="text-muted-foreground"
                  >
                    Reject (⌘ ⌫)
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
