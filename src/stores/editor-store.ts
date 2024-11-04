import { create } from "zustand";

interface EditorStoreState {
  isSaving: boolean;

  // Actions
  setIsSaving: (saving: boolean) => void;
}

export const useEditorStore = create<EditorStoreState>((set) => ({
  // Initial state
  isSaving: false,

  // Actions
  setIsSaving: (saving) => set({ isSaving: saving }),
}));

// Selector hooks
export const useIsSaving = () => useEditorStore((state) => state.isSaving);

// Action hooks
export const useEditorStoreActions = () => ({
  setIsSaving: useEditorStore((state) => state.setIsSaving),
});
