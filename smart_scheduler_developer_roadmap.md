# Smart Scheduler — Developer Roadmap

## 1. Product Goal
Build a task manager that does more than store tasks. The app should take task duration, priority, deadlines, and user availability, then generate a recommended schedule for the day. Over time, it should learn from actual usage and improve its planning.

## 2. Core Problem Statement
Most task managers:
- collect tasks but do not plan them
- ignore task difficulty and energy levels
- do not adapt when the day changes
- do not learn from the user’s actual behavior

This project solves that by becoming a scheduling engine, not just a checklist.

## 3. MVP Scope
The first version should be small and focused.

### MVP Features
- Add tasks with:
  - title
  - duration
  - priority
  - deadline (optional)
- Select a work window for the day
- Generate an ordered schedule automatically
- Show time blocks in a clean timeline UI
- Save tasks locally

### Out of Scope for MVP
- team collaboration
- calendar sync
- notifications
- AI chat input
- long-term analytics

## 4. Recommended Tech Stack
### Frontend
- React
- Tailwind CSS
- Zustand or React Context for state
- Optional: Framer Motion for smooth UI transitions

### Backend
- Start with none for MVP
- Later use Firebase or Supabase for auth and cloud sync

### Intelligence Layer
- Start with pure JavaScript rules
- Later add AI for task parsing and scheduling suggestions

## 5. System Architecture
### Main Modules
1. **Task Input Module**
   - creates and edits tasks
   - validates duration, deadline, and priority

2. **Scheduler Engine**
   - sorts tasks by importance and urgency
   - splits long tasks into chunks when needed
   - inserts breaks
   - fits tasks into available time slots

3. **Daily Plan Viewer**
   - displays the generated plan as a timeline
   - highlights current task and upcoming blocks

4. **Learning Layer**
   - compares estimated vs actual time
   - improves future task estimates

## 6. Data Model
### Task Object
```json
{
  "id": "task_001",
  "title": "Finish math assignment",
  "durationMinutes": 90,
  "priority": 4,
  "deadline": "2026-04-22T18:00:00",
  "completed": false,
  "createdAt": "2026-04-21T09:00:00"
}
```

### Schedule Block Object
```json
{
  "id": "block_001",
  "taskId": "task_001",
  "title": "Finish math assignment",
  "startTime": "2026-04-21T10:00:00",
  "endTime": "2026-04-21T11:30:00",
  "type": "task"
}
```

## 7. Scheduling Logic v1
### Basic Rules
- Higher priority tasks should come first
- Earlier deadlines should increase urgency
- Long tasks can be split into smaller chunks
- Add breaks after fixed work intervals
- Do not exceed available work hours

### Suggested Scoring Formula
```js
score = (priority * 2) + urgency - estimatedFatigueCost
```

Where:
- `priority` = user selected importance
- `urgency` = how close the deadline is
- `estimatedFatigueCost` = penalty for long or difficult tasks

### Simple Sorting Strategy
1. filter valid tasks
2. compute score for each task
3. sort descending by score
4. place tasks into available slots
5. insert breaks after a chosen interval

## 8. Development Phases

## Phase 1 — UI Foundation
### Goal
Create the visual shell and task input experience.

### Build
- top bar
- task form
- task list
- schedule preview panel
- mobile-friendly layout

### Output
A user can add tasks and see them listed.

## Phase 2 — Scheduler Engine v1
### Goal
Generate a basic daily schedule.

### Build
- start time input
- end time input
- sequential scheduling
- duration handling
- break insertion

### Output
The app generates a usable day plan.

## Phase 3 — Priority and Deadline Optimization
### Goal
Make the schedule feel intelligent.

### Build
- priority field
- deadline field
- urgency scoring
- automatic task ranking

### Output
Important and urgent tasks are scheduled first.

## Phase 4 — Task Chunking
### Goal
Handle large tasks more realistically.

### Build
- split long tasks into 30–60 minute blocks
- place chunks across the day
- keep chunk labels connected to the same task

### Output
The schedule becomes more flexible and less exhausting.

## Phase 5 — Adaptive Rescheduling
### Goal
Rebuild the schedule when the user falls behind.

### Build
- mark tasks as done or delayed
- recompute remaining blocks
- shift low-priority items later

### Output
The schedule reacts to reality instead of staying static.

## Phase 6 — Learning Layer
### Goal
Improve estimates over time.

### Build
- store estimated duration
- store actual duration
- calculate error between them
- adjust future recommendations

### Output
The app gets smarter with usage.

## Phase 7 — AI Layer
### Goal
Allow natural language input and planning suggestions.

### Build
- parse text like:
  - “study math for 2 hours and finish assignment”
- turn it into structured tasks
- suggest realistic durations
- suggest better ordering

### Output
The app feels like a planning assistant.

## 9. Suggested Folder Structure
```bash
src/
  components/
    TaskForm.jsx
    TaskList.jsx
    ScheduleView.jsx
    TimelineBlock.jsx
    Header.jsx
  pages/
    Home.jsx
  utils/
    scheduler.js
    scoring.js
    date.js
  store/
    useTaskStore.js
  data/
    sampleTasks.js
  styles/
    globals.css
```

## 10. Key Functions to Build
### Scheduler Engine
- `generateSchedule(tasks, workWindow)`
- `rankTasks(tasks)`
- `splitLongTask(task)`
- `insertBreaks(schedule, policy)`
- `rebuildScheduleAfterDelay(schedule, changes)`

### Learning System
- `recordTaskOutcome(taskId, estimated, actual)`
- `updateEstimate(taskId)`
- `getUserAccuracyStats()`

## 11. UI Components
### Must-Have
- Task input form
- Task card
- Schedule timeline
- “Generate Schedule” button
- “Reschedule” button
- Break indicator

### Nice-to-Have Later
- drag and drop ordering
- progress bar for current task
- productivity stats panel
- dark mode

## 12. Testing Plan
### Logic Tests
- schedules tasks in correct order
- handles overflow correctly
- inserts breaks at the right time
- splits long tasks properly
- reschedules when tasks are delayed

### UI Tests
- form validation
- empty state handling
- responsive layout
- timeline rendering

## 13. Milestone Plan
### Week 1
- build UI shell
- task creation
- local storage

### Week 2
- scheduler engine
- timeline output
- break logic

### Week 3
- priority and deadline support
- task splitting
- rescheduling

### Week 4
- learning layer
- polish
- deploy

## 14. Deployment Plan
### Early Demo
- static hosting on Vercel or Netlify
- no backend required

### Production Version
- auth
- cloud save
- analytics
- user-specific schedule history

## 15. Future Upgrades
- calendar integration
- notifications
- recurring tasks
- focus mode
- productivity insights
- AI-powered daily planning
- voice input

## 16. Success Criteria
The project is successful if:
- the app can take tasks and generate a valid schedule
- the plan feels better than a simple to-do list
- the user can adjust the day when plans change
- the app becomes smarter over time

## 17. Final Product Vision
This should evolve into a personal planning engine that helps the user decide:
- what to do first
- how long each task should take
- when to rest
- how to recover when the day goes off track

The product is not just about managing tasks. It is about managing time intelligently.

