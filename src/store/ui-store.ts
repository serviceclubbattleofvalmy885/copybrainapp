import { create } from "zustand";
import type { ContentType } from "@/types";

export type ViewFilter = "all" | "favorites" | ContentType;

interface UiState {
  view: ViewFilter;
  selectedCollectionId: string | null;
  searchQuery: string;
  selectedItemId: string | null;
  sidebarCollapsed: boolean;
  shortcutsOpen: boolean;
  setView: (view: ViewFilter) => void;
  setSelectedCollectionId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedItemId: (id: string | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setShortcutsOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  view: "all",
  selectedCollectionId: null,
  searchQuery: "",
  selectedItemId: null,
  sidebarCollapsed: false,
  shortcutsOpen: false,
  setView: (view) => set({ view, selectedCollectionId: null }),
  setSelectedCollectionId: (id) => set({ selectedCollectionId: id, view: "all" }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedItemId: (id) => set({ selectedItemId: id }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setShortcutsOpen: (open) => set({ shortcutsOpen: open }),
}));
