import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { DayDetailDialog } from "@/components/day-detail-dialog";
import { Button } from "@/components/ui/button";
import { useActivityCounts } from "@/hooks/use-clipboard-data";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function CalendarView() {
  const [displayMonth, setDisplayMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayDialogOpen, setDayDialogOpen] = useState(false);

  const yearMonth = format(displayMonth, "yyyy-MM");
  const { data: activityCounts } = useActivityCounts(yearMonth);

  const countByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const dc of activityCounts ?? []) map.set(dc.day, dc.count);
    return map;
  }, [activityCounts]);

  const days = useMemo(() => {
    const monthStart = startOfMonth(displayMonth);
    const monthEnd = endOfMonth(displayMonth);
    const gridStart = startOfWeek(monthStart);
    const gridEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [displayMonth]);

  function openDay(dateKey: string) {
    setSelectedDate(dateKey);
    setDayDialogOpen(true);
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-xl p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">
            {format(displayMonth, "MMMM yyyy")}
          </h2>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDisplayMonth(new Date())}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setDisplayMonth((d) => subMonths(d, 1))}
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setDisplayMonth((d) => addMonths(d, 1))}
              aria-label="Next month"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="py-1 text-center text-[11px] font-medium text-muted-foreground"
            >
              {label}
            </div>
          ))}
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const count = countByDay.get(key) ?? 0;
            const inMonth = isSameMonth(day, displayMonth);
            const hasActivity = count > 0;
            const today = isToday(day);

            return (
              <button
                key={key}
                onClick={() => openDay(key)}
                className={cn(
                  "group flex aspect-square flex-col items-center justify-center gap-1 rounded-lg text-sm transition-colors cursor-pointer",
                  !inMonth && "text-muted-foreground/40",
                  inMonth && "text-foreground hover:bg-accent",
                  today && "ring-1 ring-primary/60"
                )}
              >
                <span className={cn(hasActivity && "font-semibold")}>
                  {format(day, "d")}
                </span>
                {hasActivity && (
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "size-1 rounded-full",
                          today ? "bg-primary" : "bg-emerald-500"
                        )}
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Click a day to see everything you copied.
        </p>
      </div>

      <DayDetailDialog
        date={selectedDate}
        open={dayDialogOpen}
        onOpenChange={setDayDialogOpen}
      />
    </div>
  );
}
