import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SHORTCUTS: { keys: string; label: string }[] = [
  { keys: "↑ / ↓ or J / K", label: "Move selection" },
  { keys: "Enter", label: "Copy selected item" },
  { keys: "F", label: "Toggle favorite on selected item" },
  { keys: "Ctrl/Cmd + F", label: "Focus search" },
  { keys: "Esc", label: "Clear search / selection" },
  { keys: "Ctrl/Cmd + B", label: "Toggle sidebar" },
  { keys: "Ctrl/Cmd + Shift + V", label: "Show / hide window (global)" },
  { keys: "?", label: "Show this shortcuts list" },
];

export function ShortcutsDialog({ open, onOpenChange }: ShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-1.5">
          {SHORTCUTS.map((s) => (
            <div
              key={s.keys}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="text-muted-foreground">{s.label}</span>
              <kbd className="shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                {s.keys}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
