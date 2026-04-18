// Mock data for Lumina prototype

export interface Subject {
  id: string
  name: string
  code: string
  attended: number
  total: number
  schedule: { day: number; time: string }[]
  type: "college" | "personal"
}

export interface Task {
  id: string
  title: string
  status: "todo" | "doing" | "done"
  dueDate?: string
  priority: "low" | "medium" | "high"
  subjectId?: string
}

export interface Expense {
  id: string
  amount: number
  category: string
  type: "good" | "bad"
  description: string
  date: string
}

export interface FocusSession {
  id: string
  date: string
  score: number
  duration: number // in minutes
  distractions: number
}

export interface CalendarEvent {
  id: string
  title: string
  type: "class" | "deadline" | "personal" | "cooling"
  date: string
  time?: string
  subjectId?: string
}

export interface GroupMember {
  id: string
  name: string
  avatar: string // emoji character
  currentScore: number
  weeklyProgress: { date: string; score: number }[]
  rank: number
  streak: number
}

export interface Alert {
  id: string
  source: "gmail" | "moodle"
  title: string
  message: string
  timestamp: string
  type: "assignment" | "announcement" | "grade" | "message" | "reminder"
  read: boolean
  urgent: boolean
}

export interface Document {
  id: string
  name: string
  type: "pdf" | "image"
  uploadedAt: string
  subject?: string
  notes?: string[]
}

// Sample subjects with attendance data
export const subjects: Subject[] = [
  {
    id: "1",
    name: "Data Structures",
    code: "CS201",
    attended: 28,
    total: 35,
    schedule: [
      { day: 1, time: "09:00" },
      { day: 3, time: "09:00" },
      { day: 5, time: "09:00" },
    ],
    type: "college",
  },
  {
    id: "2",
    name: "Database Systems",
    code: "CS301",
    attended: 22,
    total: 28,
    schedule: [
      { day: 2, time: "11:00" },
      { day: 4, time: "11:00" },
    ],
    type: "college",
  },
  {
    id: "3",
    name: "Operating Systems",
    code: "CS302",
    attended: 18,
    total: 24,
    schedule: [
      { day: 1, time: "14:00" },
      { day: 3, time: "14:00" },
    ],
    type: "college",
  },
  {
    id: "4",
    name: "Computer Networks",
    code: "CS401",
    attended: 15,
    total: 22,
    schedule: [
      { day: 2, time: "09:00" },
      { day: 4, time: "09:00" },
    ],
    type: "college",
  },
  {
    id: "5",
    name: "Software Engineering",
    code: "CS402",
    attended: 12,
    total: 15,
    schedule: [
      { day: 5, time: "11:00" },
    ],
    type: "college",
  },
  {
    id: "6",
    name: "Guitar Lessons",
    code: "PERS01",
    attended: 8,
    total: 10,
    schedule: [
      { day: 6, time: "16:00" },
    ],
    type: "personal",
  },
  {
    id: "7",
    name: "Gym Training",
    code: "PERS02",
    attended: 15,
    total: 20,
    schedule: [
      { day: 1, time: "06:00" },
      { day: 3, time: "06:00" },
      { day: 5, time: "06:00" },
    ],
    type: "personal",
  },
]

// Calculate attendance percentage
export function getAttendancePercentage(subject: Subject): number {
  return Math.round((subject.attended / subject.total) * 100)
}

// Calculate safe bunks remaining (to stay above 75%)
export function getSafeBunks(subject: Subject): number {
  const required = Math.ceil(subject.total * 0.75)
  const canMiss = subject.attended - required
  return Math.max(0, canMiss)
}

// Calculate classes needed to reach 75%
export function getClassesNeeded(subject: Subject): number {
  const currentPercentage = getAttendancePercentage(subject)
  if (currentPercentage >= 75) return 0
  
  let needed = 0
  let attended = subject.attended
  let total = subject.total
  
  while ((attended / total) * 100 < 75) {
    attended++
    total++
    needed++
  }
  
  return needed
}

// Get overall attendance
export function getOverallAttendance(): number {
  const collegeSubjects = subjects.filter(s => s.type === "college")
  const totalAttended = collegeSubjects.reduce((sum, s) => sum + s.attended, 0)
  const totalClasses = collegeSubjects.reduce((sum, s) => sum + s.total, 0)
  return Math.round((totalAttended / totalClasses) * 100)
}

// Sample tasks with deadlines
export const tasks: Task[] = [
  { id: "1", title: "Complete DBMS assignment", status: "doing", dueDate: "2026-04-20", priority: "high", subjectId: "2" },
  { id: "2", title: "Read Chapter 5 - OS", status: "todo", dueDate: "2026-04-22", priority: "medium", subjectId: "3" },
  { id: "3", title: "Submit lab report", status: "done", dueDate: "2026-04-18", priority: "high", subjectId: "1" },
  { id: "4", title: "Group project meeting", status: "todo", dueDate: "2026-04-19", priority: "medium" },
  { id: "5", title: "Review lecture notes", status: "todo", priority: "low" },
  { id: "6", title: "CN Assignment Submission", status: "todo", dueDate: "2026-04-21", priority: "high", subjectId: "4" },
  { id: "7", title: "SE Project Phase 2", status: "doing", dueDate: "2026-04-25", priority: "high", subjectId: "5" },
]

// Sample expenses
export const expenses: Expense[] = [
  { id: "1", amount: 250, category: "Food", type: "good", description: "Canteen lunch", date: "2026-04-18" },
  { id: "2", amount: 500, category: "Books", type: "good", description: "DBMS textbook", date: "2026-04-17" },
  { id: "3", amount: 150, category: "Entertainment", type: "bad", description: "Movie tickets", date: "2026-04-16" },
  { id: "4", amount: 80, category: "Snacks", type: "bad", description: "Chips and drinks", date: "2026-04-16" },
  { id: "5", amount: 1200, category: "Transport", type: "good", description: "Monthly bus pass", date: "2026-04-15" },
  { id: "6", amount: 350, category: "Entertainment", type: "bad", description: "Online shopping", date: "2026-04-14" },
  { id: "7", amount: 200, category: "Food", type: "good", description: "Grocery", date: "2026-04-14" },
  { id: "8", amount: 100, category: "Coffee", type: "bad", description: "Starbucks", date: "2026-04-13" },
]

// Sample focus sessions
export const focusSessions: FocusSession[] = [
  { id: "1", date: "2026-04-18", score: 85, duration: 120, distractions: 3 },
  { id: "2", date: "2026-04-17", score: 72, duration: 90, distractions: 8 },
  { id: "3", date: "2026-04-16", score: 90, duration: 150, distractions: 2 },
  { id: "4", date: "2026-04-15", score: 65, duration: 60, distractions: 12 },
  { id: "5", date: "2026-04-14", score: 78, duration: 100, distractions: 5 },
  { id: "6", date: "2026-04-13", score: 82, duration: 110, distractions: 4 },
  { id: "7", date: "2026-04-12", score: 70, duration: 80, distractions: 9 },
]

// Get current focus score (average of last 7 days)
export function getCurrentFocusScore(): number {
  const recent = focusSessions.slice(0, 7)
  const total = recent.reduce((sum, s) => sum + s.score, 0)
  return Math.round(total / recent.length)
}

// Get highest focus score
export function getHighestFocusScore(): { score: number; date: string } {
  const best = focusSessions.reduce((best, s) => s.score > best.score ? s : best)
  return { score: best.score, date: best.date }
}

// Get expense totals
export function getExpenseTotals() {
  const good = expenses.filter(e => e.type === "good").reduce((sum, e) => sum + e.amount, 0)
  const bad = expenses.filter(e => e.type === "bad").reduce((sum, e) => sum + e.amount, 0)
  return { good, bad, total: good + bad }
}

// Get cooling day suggestion
export function getCoolingDaySuggestion(): { day: string; safe: boolean; reason: string } | null {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const dayCounts: Record<number, number> = {}
  
  const collegeSubjects = subjects.filter(s => s.type === "college")
  collegeSubjects.forEach(subject => {
    const safeBunks = getSafeBunks(subject)
    if (safeBunks > 0) {
      subject.schedule.forEach(({ day }) => {
        dayCounts[day] = (dayCounts[day] || 0) + safeBunks
      })
    }
  })
  
  const bestDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]
  
  if (bestDay && Number(bestDay[1]) > 0) {
    return {
      day: dayNames[Number(bestDay[0])],
      safe: true,
      reason: `You can safely skip ${bestDay[1]} class(es) and maintain 75% attendance.`
    }
  }
  
  return null
}

// Calendar events with more deadlines
export const calendarEvents: CalendarEvent[] = [
  { id: "1", title: "Data Structures", type: "class", date: "2026-04-18", time: "09:00", subjectId: "1" },
  { id: "2", title: "Operating Systems", type: "class", date: "2026-04-18", time: "14:00", subjectId: "3" },
  { id: "3", title: "DBMS Assignment Due", type: "deadline", date: "2026-04-20", subjectId: "2" },
  { id: "4", title: "Database Systems", type: "class", date: "2026-04-19", time: "11:00", subjectId: "2" },
  { id: "5", title: "Computer Networks", type: "class", date: "2026-04-19", time: "09:00", subjectId: "4" },
  { id: "6", title: "Cooling Day Available", type: "cooling", date: "2026-04-21" },
  { id: "7", title: "CN Assignment Due", type: "deadline", date: "2026-04-21", subjectId: "4" },
  { id: "8", title: "OS Chapter 5 Quiz", type: "deadline", date: "2026-04-22", subjectId: "3" },
  { id: "9", title: "SE Project Phase 2", type: "deadline", date: "2026-04-25", subjectId: "5" },
  { id: "10", title: "DS Lab Exam", type: "deadline", date: "2026-04-28", subjectId: "1" },
  { id: "11", title: "Mid-sem Break", type: "cooling", date: "2026-04-26" },
  { id: "12", title: "Mid-sem Break", type: "cooling", date: "2026-04-27" },
]

// Group members for competition with timeline progress
export const groupMembers: GroupMember[] = [
  {
    id: "1",
    name: "You",
    avatar: "🦊",
    currentScore: getCurrentFocusScore(),
    rank: 2,
    streak: 5,
    weeklyProgress: [
      { date: "2026-04-12", score: 70 },
      { date: "2026-04-13", score: 82 },
      { date: "2026-04-14", score: 78 },
      { date: "2026-04-15", score: 65 },
      { date: "2026-04-16", score: 90 },
      { date: "2026-04-17", score: 72 },
      { date: "2026-04-18", score: 85 },
    ],
  },
  {
    id: "2",
    name: "Priya",
    avatar: "🐼",
    currentScore: 92,
    rank: 1,
    streak: 12,
    weeklyProgress: [
      { date: "2026-04-12", score: 88 },
      { date: "2026-04-13", score: 90 },
      { date: "2026-04-14", score: 85 },
      { date: "2026-04-15", score: 92 },
      { date: "2026-04-16", score: 95 },
      { date: "2026-04-17", score: 88 },
      { date: "2026-04-18", score: 92 },
    ],
  },
  {
    id: "3",
    name: "Rahul",
    avatar: "🐸",
    currentScore: 74,
    rank: 3,
    streak: 3,
    weeklyProgress: [
      { date: "2026-04-12", score: 60 },
      { date: "2026-04-13", score: 65 },
      { date: "2026-04-14", score: 72 },
      { date: "2026-04-15", score: 70 },
      { date: "2026-04-16", score: 75 },
      { date: "2026-04-17", score: 78 },
      { date: "2026-04-18", score: 74 },
    ],
  },
  {
    id: "4",
    name: "Sneha",
    avatar: "🦋",
    currentScore: 68,
    rank: 4,
    streak: 1,
    weeklyProgress: [
      { date: "2026-04-12", score: 75 },
      { date: "2026-04-13", score: 70 },
      { date: "2026-04-14", score: 62 },
      { date: "2026-04-15", score: 58 },
      { date: "2026-04-16", score: 65 },
      { date: "2026-04-17", score: 70 },
      { date: "2026-04-18", score: 68 },
    ],
  },
  {
    id: "5",
    name: "Arjun",
    avatar: "🦁",
    currentScore: 55,
    rank: 5,
    streak: 0,
    weeklyProgress: [
      { date: "2026-04-12", score: 50 },
      { date: "2026-04-13", score: 45 },
      { date: "2026-04-14", score: 55 },
      { date: "2026-04-15", score: 48 },
      { date: "2026-04-16", score: 52 },
      { date: "2026-04-17", score: 58 },
      { date: "2026-04-18", score: 55 },
    ],
  },
]

// Group average focus score (for competition)
export const groupAverageFocusScore = Math.round(
  groupMembers.reduce((sum, m) => sum + m.currentScore, 0) / groupMembers.length
)

// Alerts from Gmail and Moodle
export const alerts: Alert[] = [
  {
    id: "1",
    source: "moodle",
    title: "New Assignment Posted",
    message: "DBMS: ER Diagram Practice Assignment due Apr 20",
    timestamp: "2026-04-18T10:30:00",
    type: "assignment",
    read: false,
    urgent: true,
  },
  {
    id: "2",
    source: "gmail",
    title: "Prof. Sharma",
    message: "Class cancelled tomorrow due to faculty meeting",
    timestamp: "2026-04-18T09:15:00",
    type: "announcement",
    read: false,
    urgent: false,
  },
  {
    id: "3",
    source: "moodle",
    title: "Grade Published",
    message: "DS Quiz 3 grade is now available: 18/20",
    timestamp: "2026-04-17T16:45:00",
    type: "grade",
    read: true,
    urgent: false,
  },
  {
    id: "4",
    source: "moodle",
    title: "Submission Reminder",
    message: "CN Assignment submission closes in 3 days",
    timestamp: "2026-04-18T08:00:00",
    type: "reminder",
    read: false,
    urgent: true,
  },
  {
    id: "5",
    source: "gmail",
    title: "Study Group",
    message: "Meeting at 5 PM in library for SE project discussion",
    timestamp: "2026-04-18T14:20:00",
    type: "message",
    read: false,
    urgent: false,
  },
]

// Sample uploaded documents for RAG
export const documents: Document[] = [
  {
    id: "1",
    name: "DBMS_Textbook_Ch5.pdf",
    type: "pdf",
    uploadedAt: "2026-04-15T10:00:00",
    subject: "Database Systems",
    notes: [
      "Normalization: Process of organizing data to reduce redundancy",
      "1NF: Eliminate repeating groups",
      "2NF: Remove partial dependencies",
      "3NF: Remove transitive dependencies",
      "BCNF: Every determinant is a candidate key",
    ],
  },
  {
    id: "2",
    name: "OS_Process_Scheduling.pdf",
    type: "pdf",
    uploadedAt: "2026-04-14T14:30:00",
    subject: "Operating Systems",
    notes: [
      "CPU Scheduling algorithms: FCFS, SJF, Priority, Round Robin",
      "Context switching involves saving and loading process state",
      "Preemptive vs Non-preemptive scheduling",
      "Turnaround time = Completion time - Arrival time",
    ],
  },
]

// Get upcoming deadlines
export function getUpcomingDeadlines(days: number = 7): CalendarEvent[] {
  const today = new Date()
  const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
  
  return calendarEvents
    .filter(e => e.type === "deadline")
    .filter(e => {
      const eventDate = new Date(e.date)
      return eventDate >= today && eventDate <= futureDate
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

// Get deadline subject info
export function getDeadlineWithSubject(event: CalendarEvent): { event: CalendarEvent; subject?: Subject } {
  const subject = event.subjectId ? subjects.find(s => s.id === event.subjectId) : undefined
  return { event, subject }
}
