import { AppShell } from "@/components/app-shell"
import { AttendanceWidget } from "@/components/dashboard/attendance-widget"
import { CoolingDayWidget } from "@/components/dashboard/cooling-day-widget"
import { FocusWidget } from "@/components/dashboard/focus-widget"
import { ExpenseWidget } from "@/components/dashboard/expense-widget"
import { TasksWidget } from "@/components/dashboard/tasks-widget"
import { ScheduleWidget } from "@/components/dashboard/schedule-widget"
import { AlertsWidget } from "@/components/dashboard/alerts-widget"

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-balance">Good morning, John</h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s your productivity overview for today.
          </p>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Row 1: Key metrics */}
          <AttendanceWidget />
          <CoolingDayWidget />
          <FocusWidget />
          <ExpenseWidget />

          {/* Row 2: Alerts from Gmail/Moodle */}
          <AlertsWidget />

          {/* Row 3: Tasks and Schedule */}
          <TasksWidget />
          <ScheduleWidget />
        </div>
      </div>
    </AppShell>
  )
}
