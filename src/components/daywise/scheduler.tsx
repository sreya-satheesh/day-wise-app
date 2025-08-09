"use client";

import React, { useState, useTransition } from "react";
import { format } from "date-fns";
import type { Task, ScheduledTask } from "@/lib/types";
import { TaskForm } from "@/components/daywise/task-form";
import { TaskList } from "@/components/daywise/task-list";
import { Timeline } from "@/components/daywise/timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateScheduleAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Bot, Loader2 } from "lucide-react";

export default function Scheduler() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedule, setSchedule] = useState<ScheduledTask[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const addTask = (task: Omit<Task, "id">) => {
    setTasks((prev) => [...prev, { ...task, id: crypto.randomUUID() }]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleGenerateSchedule = () => {
    if (tasks.length === 0) {
      toast({
        variant: "destructive",
        title: "No Tasks",
        description: "Please add at least one task to generate a schedule.",
      });
      return;
    }

    startTransition(async () => {
      const formattedTasks = tasks.map((task) => ({
        ...task,
        deadline: format(task.deadline, "yyyy-MM-dd HH:mm"),
      }));

      const input = {
        tasks: formattedTasks,
        currentTime: format(new Date(), "yyyy-MM-dd HH:mm"),
      };

      const result = await generateScheduleAction(input);

      if (result.success) {
        setSchedule(result.data.schedule);
        toast({
          title: "Schedule Generated!",
          description: "Your AI-powered schedule is ready.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      }
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="space-y-6">
            <TaskForm addTask={addTask} />
            <Card>
              <CardHeader>
                <CardTitle>Your Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskList tasks={tasks} deleteTask={deleteTask} />
                <Button
                  onClick={handleGenerateSchedule}
                  disabled={isPending || tasks.length === 0}
                  className="w-full mt-4"
                  size="lg"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                     <Bot className="mr-2 h-5 w-5" />
                      Generate My Day
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="lg:col-span-7 xl:col-span-8">
          <Timeline schedule={schedule} tasks={tasks} />
        </div>
      </div>
    </div>
  );
}
