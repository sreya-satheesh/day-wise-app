"use client";

import type { Task, TaskPriority } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Trash2,
  Signal,
  SignalLow,
  SignalMedium,
  Calendar,
  Clock,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskListProps {
  tasks: Task[];
  deleteTask: (id: string) => void;
}

const priorityIcons: Record<TaskPriority, React.ReactNode> = {
  high: <Signal className="h-4 w-4 text-destructive/80" />,
  medium: <SignalMedium className="h-4 w-4 text-primary/80" />,
  low: <SignalLow className="h-4 w-4 text-muted-foreground/80" />,
};

const priorityTooltips: Record<TaskPriority, string> = {
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

export function TaskList({ tasks, deleteTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground py-10">
        <p>Your entered tasks will appear here.</p>
        <p>Start by adding a task above!</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Tooltip>
                <TooltipTrigger>
                  {priorityIcons[task.priority]}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{priorityTooltips[task.priority]}</p>
                </TooltipContent>
              </Tooltip>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate" title={task.taskName}>{task.taskName}</p>
                <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                   <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(task.deadline, "MMM d, HH:mm")}</span>
                   </div>
                   <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{task.estimatedTime}</span>
                   </div>
                </div>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Task</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
