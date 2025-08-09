export type TaskPriority = "high" | "medium" | "low";

export interface Task {
  id: string;
  taskName: string;
  deadline: Date;
  priority: TaskPriority;
  estimatedTime: string;
}

export interface ScheduledTask {
  taskName: string;
  startTime: string;
  endTime: string;
}
