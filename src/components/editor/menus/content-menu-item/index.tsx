import { Icon } from "@/components/ui/icon";
import { Toolbar } from "@/components/ui/toolbar";
import DragHandle from "@tiptap-pro/extension-drag-handle-react";
import { type Editor } from "@tiptap/react";

import * as Popover from "@radix-ui/react-popover";
import { Surface } from "@/components/ui/surface";
import { DropdownButton } from "@/components/ui/dropdown";
import useContentItemActions from "./hooks/use-content-item-actions";
import { useData } from "./hooks/use-data";
import { useEffect, useState } from "react";

export type ContentItemMenuProps = {
  editor: Editor;
};

export const ContentItemMenu = ({ editor }: ContentItemMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const data = useData();
  const actions = useContentItemActions(
    editor,
    data.currentNode,
    data.currentNodePos,
  );

  useEffect(() => {
    if (menuOpen) {
      editor.commands.setMeta("lockDragHandle", true);
    } else {
      editor.commands.setMeta("lockDragHandle", false);
    }
  }, [editor, menuOpen]);

  return (
    <DragHandle
      pluginKey="ContentItemMenu"
      editor={editor}
      onNodeChange={data.handleNodeChange}
      tippyOptions={{
        offset: [-2, 16],
        zIndex: 0,
      }}
    >
      <div className="relative z-10 flex items-center gap-0.5">
        <Toolbar.Button onClick={actions.handleAdd}>
          <Icon name="Plus" />
        </Toolbar.Button>
        <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Popover.Trigger asChild>
            <Toolbar.Button>
              <Icon name="GripVertical" />
            </Toolbar.Button>
          </Popover.Trigger>
          <Popover.Content side="bottom" align="start" sideOffset={8}>
            <Surface className="flex min-w-[16rem] flex-col p-2">
              <DropdownButton
                onClick={() => {
                  actions.resetTextFormatting();
                  setMenuOpen(false);
                }}
              >
                <Icon name="RemoveFormatting" />
                Clear formatting
              </DropdownButton>
              <DropdownButton
                onClick={() => {
                  actions.copyNodeToClipboard();
                  setMenuOpen(false);
                }}
              >
                <Icon name="Clipboard" />
                Copy to clipboard
              </DropdownButton>
              <DropdownButton
                onClick={() => {
                  actions.duplicateNode();
                  setMenuOpen(false);
                }}
              >
                <Icon name="Copy" />
                Duplicate
              </DropdownButton>
              <Toolbar.Divider horizontal />
              <DropdownButton
                onClick={() => {
                  actions.deleteNode();
                  setMenuOpen(false);
                }}
                className="bg-red-500 bg-opacity-10 text-red-500 hover:bg-red-500 hover:bg-opacity-20 dark:text-red-500 dark:hover:bg-red-500 dark:hover:bg-opacity-20 dark:hover:text-red-500"
              >
                <Icon name="Trash2" />
                Delete
              </DropdownButton>
            </Surface>
          </Popover.Content>
        </Popover.Root>
      </div>
    </DragHandle>
  );
};
