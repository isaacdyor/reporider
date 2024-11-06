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

const formSchema = z.object({
  message: z.string().min(1, {
    message: "Message must be at least 1 character.",
  }),
});

const MemoButton = memo(Toolbar.Button);

export function InlineChatMenu({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const selectedText = editor.state.selection.empty
      ? ""
      : editor.view.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
        );

    console.log("Selected text:", selectedText);
    console.log("Form values:", values);
  }
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => form.setFocus("message"), 0);
    }
  }, [form, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void form.handleSubmit(onSubmit)();
    }
  };

  // Add useEffect for global keyboard shortcut
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
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
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
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-2 top-2 hover:text-foreground"
          >
            <X className="size-4 text-muted-foreground" />
          </button>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="message"
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
              <Button size="thin" type="submit">
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
