"use client";

import React, { useEffect, useState, useMemo } from "react";
import type { ScheduledTask, Task, TaskPriority } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

interface TimelineProps {
  schedule: ScheduledTask[] | null;
  tasks: Task[];
}

const PIXELS_PER_HOUR = 80;
const TIMELINE_START_HOUR = 7;
const TIMELINE_END_HOUR = 23;

const priorityStyles: Record<
  TaskPriority,
  { background: string; border: string }
> = {
  high: {
    background: "bg-red-500/10 dark:bg-red-500/20",
    border: "border-red-500/80",
  },
  medium: {
    background: "bg-primary/20 dark:bg-primary/30",
    border: "border-primary/80",
  },
  low: {
    background: "bg-secondary",
    border: "border-border",
  },
};

export function Timeline({ schedule, tasks }: TimelineProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timerId = setInterval(() => setNow(new Date()), 60000); // Update every minute
    return () => clearInterval(timerId);
  }, []);

  const nowPosition = useMemo(() => {
    if (!now) return -1;
    const nowHours = now.getHours() + now.getMinutes() / 60;
    if (nowHours < TIMELINE_START_HOUR || nowHours > TIMELINE_END_HOUR) return -1;
    return (nowHours - TIMELINE_START_HOUR) * PIXELS_PER_HOUR;
  }, [now]);

  const timeSlots = Array.from(
    { length: TIMELINE_END_HOUR - TIMELINE_START_HOUR + 1 },
    (_, i) => TIMELINE_START_HOUR + i
  );

  const getTaskPositionAndHeight = (startTimeStr: string, endTimeStr: string) => {
    const startTime = new Date(startTimeStr);
    const endTime = new Date(endTimeStr);

    const startHours = startTime.getHours() + startTime.getMinutes() / 60;
    const endHours = endTime.getHours() + endTime.getMinutes() / 60;

    const top = (startHours - TIMELINE_START_HOUR) * PIXELS_PER_HOUR;
    const height = (endHours - startHours) * PIXELS_PER_HOUR;

    return { top, height };
  };

  return (
    <Card className="h-full shadow-lg">
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[calc(100vh-12rem)] min-h-[500px] overflow-y-auto pr-2 sm:pr-4">
          <div className="relative">
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="relative flex items-start"
                style={{ height: `${PIXELS_PER_HOUR}px` }}
              >
                <div className="absolute -left-10 sm:-left-12 w-10 text-right text-xs text-muted-foreground">
                  {hour % 12 === 0 ? 12 : hour % 12}{" "}
                  {hour < 12 || hour === 24 ? "AM" : "PM"}
                </div>
                <div className="h-px w-full bg-border mt-0"></div>
              </div>
            ))}

            {nowPosition >= 0 && (
              <div
                className="absolute w-full h-0.5 bg-primary z-10 flex items-center"
                style={{ top: `${nowPosition}px` }}
              >
                <div className="h-2 w-2 rounded-full bg-primary -ml-1"></div>
              </div>
            )}

            {!schedule || schedule.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <CalendarDays className="h-16 w-16 sm:h-24 sm:w-24 text-muted-foreground/20 mb-4" />
                    <p className="text-muted-foreground font-medium text-sm sm:text-base">Your schedule is empty.</p>
                    <p className="text-muted-foreground text-xs sm:text-sm">Add some tasks and generate your day!</p>
                </div>
            ) : (
                schedule.map((item, index) => {
                    const { top, height } = getTaskPositionAndHeight(item.startTime, item.endTime);
                    const originalTask = tasks.find(t => t.taskName === item.taskName);
                    const priority = originalTask?.priority || "low";
                    const styles = priorityStyles[priority];
        
                    return (
                        <div
                        key={index}
                        className={cn(
                            "absolute w-[calc(100%-0.5rem)] sm:w-[calc(100%-1rem)] right-0 p-2 sm:p-3 rounded-lg border-l-4 transition-all duration-300",
                            styles.background,
                            styles.border
                        )}
                        style={{ top: `${top}px`, height: `${Math.max(height - 4, 30)}px` }}
                        >
                        <p className="font-semibold text-xs sm:text-sm text-foreground truncate">{item.taskName}</p>
                        <p className="text-xs text-muted-foreground">
                            {format(new Date(item.startTime), "HH:mm")} -{" "}
                            {format(new Date(item.endTime), "HH:mm")}
                        </p>
                        </div>
                    );
                })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
