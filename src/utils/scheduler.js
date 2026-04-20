import { addMinutes, parse, format, isAfter } from 'date-fns';
import { calculateTaskScore } from './scoring';

/**
 * Sequential scheduling logic with break insertion
 * @param {Array} tasks - Array of task objects
 * @param {Object} workWindow - { start: 'HH:mm', end: 'HH:mm' }
 * @returns {Object} { blocks: Array, overflow: boolean }
 */
export function generateSchedule(tasks, workWindow) {
  if (!tasks || tasks.length === 0) return { blocks: [], overflow: false };

  // Parse against an arbitrary date (today) for baseline calculation
  const today = new Date();
  const startTime = parse(workWindow.start, 'HH:mm', today);
  const endTime = parse(workWindow.end, 'HH:mm', today);

  // Pre-process: Splinter long tasks into chunks (max 60 minutes)
  const chunkedTasks = [];
  for (const task of tasks) {
    if (task.completed) continue;
    
    if (task.durationMinutes > 60) {
      const numChunks = Math.ceil(task.durationMinutes / 60);
      let remainingDuration = task.durationMinutes;
      
      for (let i = 1; i <= numChunks; i++) {
        const chunkDuration = Math.min(60, remainingDuration);
        chunkedTasks.push({
          ...task,
          id: `${task.id}_chunk_${i}`, // Unique ID for React map
          originalId: task.id,
          durationMinutes: chunkDuration,
          chunkId: i,
          totalChunks: numChunks,
          scorePenalty: (i - 1) * 2 // Increase penalty (-2, -4) for later chunks
        });
        remainingDuration -= chunkDuration;
      }
    } else {
      chunkedTasks.push(task);
    }
  }

  // Filter out completed tasks and sort by dynamic intelligence score descending
  const orderedTasks = chunkedTasks
    .sort((a, b) => calculateTaskScore(b) - calculateTaskScore(a));

  const blocks = [];
  let currentTime = startTime;
  let continuousWork = 0;
  let hasOverflow = false;

  for (const task of orderedTasks) {
    // Break rule: 10 mins break after >= 90 mins continuous work
    if (continuousWork >= 90) {
      const breakEndTime = addMinutes(currentTime, 10);
      blocks.push({
        id: `break_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        type: 'break',
        title: 'Take a breather',
        startTime: format(currentTime, 'HH:mm'),
        endTime: format(breakEndTime, 'HH:mm'),
        duration: 10
      });
      currentTime = breakEndTime;
      continuousWork = 0;
    }

    const taskEndTime = addMinutes(currentTime, task.durationMinutes);
    
    // Check overflow
    if (isAfter(taskEndTime, endTime)) {
      hasOverflow = true;
    }

    blocks.push({
      id: `block_${task.id}`,
      type: 'task',
      taskId: task.id,
      title: task.title,
      priority: task.priority,
      deadline: task.deadline,
      chunkId: task.chunkId,
      totalChunks: task.totalChunks,
      startTime: format(currentTime, 'HH:mm'),
      endTime: format(taskEndTime, 'HH:mm'),
      duration: task.durationMinutes,
      warning: isAfter(taskEndTime, endTime) // Highlight if this block overflows
    });

    currentTime = taskEndTime;
    continuousWork += task.durationMinutes;
  }

  return { blocks, overflow: hasOverflow };
}
