"use client";

import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import * as Popover from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { Toolbar } from "@/components/ui/toolbar";
import { type Editor } from "@tiptap/react";
import { X } from "lucide-react";
import { memo } from "react";
import { getContext, getSelection } from "@/lib/wordware/formatNode";
import { api } from "@/trpc/react";

const formSchema = z.object({
  edit: z.string().min(1, {
    message: "Message must be at least 1 character.",
  }),
});

const MemoButton = memo(Toolbar.Button);

export function InlineChatMenu({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "submitted"
  >("idle");

  const { mutate } = api.wordware.inlineEdit.useMutation({
    onSuccess: (result) => {
      const { from } = editor.state.selection;
      editor
        .chain()
        .focus()
        .insertContent([
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                marks: [
                  {
                    type: "highlight",
                    attrs: { color: "var(--highlight-green)" },
                  },
                ],
                text: result.edit,
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                marks: [
                  {
                    type: "highlight",
                    attrs: { color: "var(--highlight-red)" },
                  },
                ],
                text: editor.state.doc.textBetween(
                  from,
                  editor.state.selection.to,
                ),
              },
            ],
          },
        ])
        .run();
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

  // Focus the textarea when the menu opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => form.setFocus("edit"), 0);
    } else {
      setSubmitStatus("idle");
      form.reset();
    }
  }, [form, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void form.handleSubmit(onSubmit)();
    }
  };

  // keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

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
              <Button
                size="thin"
                type="submit"
                disabled={submitStatus !== "idle"}
              >
                {submitStatus === "submitting" && "Submitting..."}
                {submitStatus === "submitted" && "Submitted!"}
                {submitStatus === "idle" && "Submit"}
              </Button>
            </form>
          </Form>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
