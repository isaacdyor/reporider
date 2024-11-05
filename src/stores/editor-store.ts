import { create } from "zustand";

interface EditorStoreState {
  isSaving: boolean;
  isInlineChatOpen: boolean;
  isFullChatOpen: boolean;
  setIsSaving: (saving: boolean) => void;
  setIsInlineChatOpen: (open: boolean) => void;
  setIsFullChatOpen: (open: boolean) => void;
}

export const useEditorStore = create<EditorStoreState>((set) => ({
  isSaving: false,
  isInlineChatOpen: true,
  isFullChatOpen: false,
  setIsSaving: (saving) => set({ isSaving: saving }),
  setIsInlineChatOpen: (open) => set({ isInlineChatOpen: open }),
  setIsFullChatOpen: (open) => set({ isFullChatOpen: open }),
}));

// Selector hooks
export const useIsSaving = () => useEditorStore((state) => state.isSaving);
export const useIsInlineChatOpen = () =>
  useEditorStore((state) => state.isInlineChatOpen);
export const useIsFullChatOpen = () =>
  useEditorStore((state) => state.isFullChatOpen);

// Action hooks
export const useEditorStoreActions = () => ({
  setIsSaving: useEditorStore((state) => state.setIsSaving),
  setIsInlineChatOpen: useEditorStore((state) => state.setIsInlineChatOpen),
  setIsFullChatOpen: useEditorStore((state) => state.setIsFullChatOpen),
});
