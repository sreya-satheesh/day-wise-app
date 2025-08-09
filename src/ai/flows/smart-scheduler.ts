// src/ai/flows/smart-scheduler.ts
'use server';
/**
 * @fileOverview A smart scheduler AI agent.
 *
 * - smartScheduler - A function that handles the smart scheduling process.
 * - SmartSchedulerInput - The input type for the smartScheduler function.
 * - SmartSchedulerOutput - The return type for the smartScheduler function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartSchedulerInputSchema = z.object({
  tasks: z.array(
    z.object({
      taskName: z.string().describe('The name of the task.'),
      deadline: z.string().describe('The deadline for the task (e.g., YYYY-MM-DD HH:MM).'),
      priority: z.enum(['high', 'medium', 'low']).describe('The priority of the task.'),
      estimatedTime: z.string().describe('The estimated time to complete the task (e.g., 1 hour, 30 minutes).'),
    })
  ).describe('A list of tasks to schedule.'),
  currentTime: z.string().describe('The current time (e.g., YYYY-MM-DD HH:MM).'),
});

export type SmartSchedulerInput = z.infer<typeof SmartSchedulerInputSchema>;

const SmartSchedulerOutputSchema = z.object({
  schedule: z.array(
    z.object({
      taskName: z.string().describe('The name of the scheduled task.'),
      startTime: z.string().describe('The start time of the task (e.g., YYYY-MM-DD HH:MM).'),
      endTime: z.string().describe('The end time of the task (e.g., YYYY-MM-DD HH:MM).'),
    })
  ).describe('The generated schedule.'),
});

export type SmartSchedulerOutput = z.infer<typeof SmartSchedulerOutputSchema>;

export async function smartScheduler(input: SmartSchedulerInput): Promise<SmartSchedulerOutput> {
  return smartSchedulerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSchedulerPrompt',
  input: {schema: SmartSchedulerInputSchema},
  output: {schema: SmartSchedulerOutputSchema},
  prompt: `You are a smart scheduler AI that generates an optimized daily schedule based on inputted tasks, deadlines, and priorities.

Current Time: {{{currentTime}}}

Tasks:
{{#each tasks}}
- Task Name: {{taskName}}, Deadline: {{deadline}}, Priority: {{priority}}, Estimated Time: {{estimatedTime}}
{{/each}}

Generate a schedule that maximizes productivity, respects deadlines and task priorities. Return the schedule as a JSON object. Consider current time when generating the schedule.

Output Format: JSON

{
  "schedule": [
    {
      "taskName": "Task Name",
      "startTime": "YYYY-MM-DD HH:MM",
      "endTime": "YYYY-MM-DD HH:MM"
    }
  ]
}
`,
});

const smartSchedulerFlow = ai.defineFlow(
  {
    name: 'smartSchedulerFlow',
    inputSchema: SmartSchedulerInputSchema,
    outputSchema: SmartSchedulerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
