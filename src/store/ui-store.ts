import { create } from "zustand";
import type { ContentType } from "@/types";

export type ViewFilter = "all" | "favorites" | ContentType;
export type ActiveSection = "timeline" | "calendar";

interface UiState {
  activeSection: ActiveSection;
  view: ViewFilter;
  selectedCollectionId: string | null;
  searchQuery: string;
  selectedItemId: string | null;
  sidebarCollapsed: boolean;
  shortcutsOpen: boolean;
  settingsOpen: boolean;
  aboutOpen: boolean;
  setActiveSection: (section: ActiveSection) => void;
  setView: (view: ViewFilter) => void;
  setSelectedCollectionId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedItemId: (id: string | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setShortcutsOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setAboutOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeSection: "timeline",
  view: "all",
  selectedCollectionId: null,
  searchQuery: "",
  selectedItemId: null,
  sidebarCollapsed: false,
  shortcutsOpen: false,
  settingsOpen: false,
  aboutOpen: false,
  setActiveSection: (section) => set({ activeSection: section }),
  setView: (view) =>
    set({ view, selectedCollectionId: null, activeSection: "timeline" }),
  setSelectedCollectionId: (id) =>
    set({ selectedCollectionId: id, view: "all", activeSection: "timeline" }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedItemId: (id) => set({ selectedItemId: id }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setShortcutsOpen: (open) => set({ shortcutsOpen: open }),
  setSettingsOpen: (open) => set({ settingsOpen: open }),
  setAboutOpen: (open) => set({ aboutOpen: open }),
}));
