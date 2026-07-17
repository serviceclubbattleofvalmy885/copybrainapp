import {
  Calendar,
  ClipboardList,
  FolderClosed,
  Info,
  Keyboard,
  Plus,
  Settings,
  Star,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { AboutDialog } from "@/components/about-dialog";
import { CreateCollectionDialog } from "@/components/create-collection-dialog";
import { SettingsDialog } from "@/components/settings-dialog";
import { ShortcutsDialog } from "@/components/shortcuts-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { contentTypeMeta } from "@/lib/content-type-meta";
import { cn } from "@/lib/utils";
import { useCollections, useStats } from "@/hooks/use-clipboard-data";
import { useUiStore, type ViewFilter } from "@/store/ui-store";
import type { ContentType } from "@/types";

function NavRow({
  active,
  icon,
  label,
  count,
  collapsed,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  count?: number;
  collapsed: boolean;
  onClick: () => void;
}) {
  const button = (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors",
        collapsed && "justify-center px-0",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
      )}
    >
      <span className="flex size-4 items-center justify-center text-muted-foreground">
        {icon}
      </span>
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {count !== undefined && count > 0 && (
            <span className="text-xs tabular-nums text-muted-foreground">
              {count}
            </span>
          )}
        </>
      )}
    </button>
  );

  if (!collapsed) return button;

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function Sidebar() {
  const {
    view,
    selectedCollectionId,
    activeSection,
    setActiveSection,
    setView,
    setSelectedCollectionId,
    sidebarCollapsed,
    shortcutsOpen,
    setShortcutsOpen,
    settingsOpen,
    setSettingsOpen,
  } = useUiStore();
  const { data: stats } = useStats();
  const { data: collections } = useCollections();
  const [createOpen, setCreateOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  function select(v: ViewFilter) {
    setView(v);
  }

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-150",
        sidebarCollapsed ? "w-14" : "w-60"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-4",
          sidebarCollapsed && "justify-center px-0"
        )}
      >
        <img src="/app-icon.png" alt="CopyBrain" className="size-6 rounded-md shrink-0" />
        {!sidebarCollapsed && (
          <span className="font-heading text-sm font-semibold">CopyBrain</span>
        )}
      </div>

      <div
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden pb-4",
          sidebarCollapsed ? "px-1.5" : "px-2"
        )}
      >
        <div className="mb-4 space-y-0.5">
          <NavRow
            active={view === "all" && !selectedCollectionId}
            icon={<ClipboardList className="size-4" />}
            label="All Clipboard"
            count={stats?.total}
            collapsed={sidebarCollapsed}
            onClick={() => select("all")}
          />
          <NavRow
            active={view === "favorites"}
            icon={<Star className="size-4" />}
            label="Favorites"
            count={stats?.favorites}
            collapsed={sidebarCollapsed}
            onClick={() => select("favorites")}
          />
          <NavRow
            active={activeSection === "calendar"}
            icon={<Calendar className="size-4" />}
            label="Calendar"
            collapsed={sidebarCollapsed}
            onClick={() => setActiveSection("calendar")}
          />
        </div>

        <div className="mb-4">
          {!sidebarCollapsed && (
            <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Types
            </div>
          )}
          <div className="space-y-0.5">
            {(Object.keys(contentTypeMeta) as ContentType[]).map((ct) => {
              const meta = contentTypeMeta[ct];
              const Icon = meta.icon;
              const count = stats?.by_type.find(
                (t) => t.content_type === ct
              )?.count;
              return (
                <NavRow
                  key={ct}
                  active={view === ct}
                  icon={<Icon className="size-4" />}
                  label={meta.label}
                  count={count}
                  collapsed={sidebarCollapsed}
                  onClick={() => select(ct)}
                />
              );
            })}
          </div>
        </div>

        <div>
          {!sidebarCollapsed && (
            <div className="flex items-center justify-between px-2 pb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Collections
              </span>
              <button
                onClick={() => setCreateOpen(true)}
                className="rounded p-0.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          )}
          <div className="space-y-0.5">
            {collections?.length ? (
              collections.map((c) => (
                <NavRow
                  key={c.id}
                  active={selectedCollectionId === c.id}
                  icon={<FolderClosed className="size-4" />}
                  label={c.name}
                  count={c.item_count}
                  collapsed={sidebarCollapsed}
                  onClick={() => setSelectedCollectionId(c.id)}
                />
              ))
            ) : (
              !sidebarCollapsed && (
                <p className="px-2 py-1 text-xs text-muted-foreground">
                  No collections yet
                </p>
              )
            )}
            {sidebarCollapsed && (
              <NavRow
                active={false}
                icon={<Plus className="size-4" />}
                label="New collection"
                collapsed
                onClick={() => setCreateOpen(true)}
              />
            )}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center border-t border-sidebar-border px-4 py-2.5",
          sidebarCollapsed ? "flex-col gap-2 px-0" : "justify-between"
        )}
      >
        {!sidebarCollapsed && (
          <span className="text-xs text-muted-foreground">Theme</span>
        )}
        <ThemeToggle compact={sidebarCollapsed} />
      </div>

      {sidebarCollapsed ? (
        <div className="flex flex-col items-center gap-1 border-t border-sidebar-border py-2.5">
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  onClick={() => setShortcutsOpen(true)}
                  aria-label="Keyboard shortcuts"
                  className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                />
              }
            >
              <Keyboard className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent side="right">Keyboard shortcuts</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  onClick={() => setSettingsOpen(true)}
                  aria-label="Settings"
                  className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                />
              }
            >
              <Settings className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  onClick={() => setAboutOpen(true)}
                  aria-label="About CopyBrain"
                  className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                />
              }
            >
              <Info className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent side="right">About CopyBrain</TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <div className="grid grid-cols-3 border-t border-sidebar-border text-xs text-muted-foreground">
          <button
            onClick={() => setShortcutsOpen(true)}
            className="flex flex-col items-center gap-1 px-2 py-2.5 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          >
            <Keyboard className="size-3.5" />
            Keys
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex flex-col items-center gap-1 px-2 py-2.5 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          >
            <Settings className="size-3.5" />
            Settings
          </button>
          <button
            onClick={() => setAboutOpen(true)}
            className="flex flex-col items-center gap-1 px-2 py-2.5 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          >
            <Info className="size-3.5" />
            About
          </button>
        </div>
      )}

      <CreateCollectionDialog open={createOpen} onOpenChange={setCreateOpen} />
      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
      <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </aside>
  );
}
