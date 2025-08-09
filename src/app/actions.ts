'use server';

import { smartScheduler, type SmartSchedulerInput, type SmartSchedulerOutput } from '@/ai/flows/smart-scheduler';

export async function generateScheduleAction(
  input: SmartSchedulerInput
): Promise<{ success: true; data: SmartSchedulerOutput } | { success: false; error: string }> {
  try {
    const output = await smartScheduler(input);
    if (!output.schedule || output.schedule.length === 0) {
        return { success: false, error: "The AI couldn't generate a schedule. Try adding more tasks or adjusting their properties." };
    }
    return { success: true, data: output };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'An unexpected error occurred while generating the schedule. Please try again.' };
  }
}
