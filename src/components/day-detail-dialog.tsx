import { format, parseISO } from "date-fns";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ClipboardCard } from "@/components/clipboard-card";
import { EmptyState } from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCopyToClipboard,
  useDayItems,
  useDeleteItem,
  useToggleFavorite,
} from "@/hooks/use-clipboard-data";

interface DayDetailDialogProps {
  date: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DayDetailDialog({ date, open, onOpenChange }: DayDetailDialogProps) {
  const { data: items, isLoading } = useDayItems(open ? date : null);
  const copyToClipboard = useCopyToClipboard();
  const toggleFavorite = useToggleFavorite();
  const deleteItem = useDeleteItem();
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!items) return items;
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.content.toLowerCase().includes(q) ||
        item.app_name?.toLowerCase().includes(q),
    );
  }, [items, query]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setQuery("");
    onOpenChange(nextOpen);
  };

  if (!date) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-5xl flex-col gap-4">
        <DialogHeader className="shrink-0">
          <DialogTitle className="font-heading text-xl font-semibold">
            {format(parseISO(date), "EEEE, MMMM d, yyyy")}
          </DialogTitle>
          <DialogDescription>
            {items?.length
              ? `${items.length} item${items.length === 1 ? "" : "s"} copied that day`
              : "Nothing copied that day"}
          </DialogDescription>
        </DialogHeader>

        {!isLoading && items && items.length > 0 && (
          <div className="relative shrink-0">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.currentTarget.blur();
                  setQuery("");
                }
              }}
              placeholder="Search this day's items..."
              className="pl-8 pr-8"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="p-6 text-center text-xs text-muted-foreground">
            Loading…
          </div>
        ) : !items || items.length === 0 ? (
          <EmptyState
            title="No activity"
            description="Nothing was copied on this day."
          />
        ) : !filteredItems || filteredItems.length === 0 ? (
          <EmptyState
            title="No matches"
            description="No items on this day match your search."
          />
        ) : (
          <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1">
            <div className="space-y-0.5 pb-1">
              {filteredItems.map((item) => (
                <ClipboardCard
                  key={item.id}
                  item={item}
                  onCopy={(text) => copyToClipboard.mutate(text)}
                  onToggleFavorite={(id) => toggleFavorite.mutate(id)}
                  onDelete={(id) => deleteItem.mutate(id)}
                />
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
