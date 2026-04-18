"use client"

import { useState, useMemo } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, 
  ChevronRight,
  AlertTriangle,
  Snowflake,
  Clock,
  Flame
} from "lucide-react"
import { 
  subjects,
  calendarEvents,
  getCoolingDaySuggestion,
  getUpcomingDeadlines,
  focusSessions,
  type CalendarEvent
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function generateCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDay = firstDay.getDay()
  
  const days: (number | null)[] = []
  
  for (let i = 0; i < startingDay; i++) {
    days.push(null)
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }
  
  return days
}

function getEventsForDate(date: string): CalendarEvent[] {
  return calendarEvents.filter(e => e.date === date)
}

function getClassesForDay(dayOfWeek: number) {
  return subjects.filter(s => s.type === "college" && s.schedule.some(sch => sch.day === dayOfWeek))
}

// Get activity intensity for heatmap (based on focus sessions and classes)
function getActivityIntensity(dateStr: string, dayOfWeek: number): number {
  const session = focusSessions.find(s => s.date === dateStr)
  if (session) {
    if (session.score >= 85) return 5
    if (session.score >= 70) return 4
    if (session.score >= 55) return 3
    if (session.score >= 40) return 2
    return 1
  }
  
  // Check for deadlines - high intensity
  const hasDeadline = calendarEvents.some(e => e.date === dateStr && e.type === 'deadline')
  if (hasDeadline) return 4
  
  // Base on number of classes
  const classes = getClassesForDay(dayOfWeek)
  if (classes.length >= 3) return 3
  if (classes.length >= 2) return 2
  if (classes.length >= 1) return 1
  
  return 0
}

export default function CalendarPage() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(
    today.toISOString().split('T')[0]
  )
  
  const cooling = getCoolingDaySuggestion()
  const upcomingDeadlines = getUpcomingDeadlines(14)
  
  const calendarDays = useMemo(() => 
    generateCalendarDays(currentYear, currentMonth), 
    [currentYear, currentMonth]
  )
  
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }
  
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }
  
  const selectedDateObj = selectedDate ? new Date(selectedDate) : null
  const selectedDayOfWeek = selectedDateObj ? selectedDateObj.getDay() : null
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []
  const scheduledClasses = selectedDayOfWeek !== null ? getClassesForDay(selectedDayOfWeek) : []
  
  const isToday = (day: number) => {
    return day === today.getDate() && 
           currentMonth === today.getMonth() && 
           currentYear === today.getFullYear()
  }
  
  const getDateString = (day: number) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }
  
  const hasDeadline = (day: number) => {
    const dateStr = getDateString(day)
    return calendarEvents.find(e => e.date === dateStr && e.type === 'deadline')
  }
  
  const isCoolingDay = (day: number) => {
    const dateStr = getDateString(day)
    return calendarEvents.some(e => e.date === dateStr && e.type === 'cooling')
  }

  // Vibrant heatmap colors - cyan to purple gradient
  const getHeatmapStyle = (intensity: number, isSelected: boolean, isTodayDate: boolean) => {
    if (isSelected) {
      return "bg-primary text-primary-foreground"
    }
    if (isTodayDate) {
      return "bg-gradient-to-br from-amber-500 to-orange-600 text-white"
    }
    switch (intensity) {
      case 5: return "bg-gradient-to-br from-violet-600 to-purple-700 text-white"
      case 4: return "bg-gradient-to-br from-violet-500 to-purple-600 text-white"
      case 3: return "bg-gradient-to-br from-indigo-500 to-violet-500 text-white"
      case 2: return "bg-gradient-to-br from-cyan-500 to-indigo-500 text-white"
      case 1: return "bg-gradient-to-br from-cyan-400/60 to-cyan-500/60 text-white"
      default: return "bg-secondary/40 text-muted-foreground"
    }
  }

  // Calculate days until deadline
  const getDaysUntil = (dateStr: string): number => {
    const eventDate = new Date(dateStr)
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)
    eventDate.setHours(0, 0, 0, 0)
    return Math.ceil((eventDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24))
  }

  // Get short course codes for a day
  const getCourseCodesForDay = (day: number): string[] => {
    const date = new Date(currentYear, currentMonth, day)
    const dayOfWeek = date.getDay()
    const classes = getClassesForDay(dayOfWeek)
    return classes.map(s => s.code).slice(0, 2) // Max 2 to fit in cell
  }

  // Get deadline title for a day
  const getDeadlineForDay = (day: number): CalendarEvent | undefined => {
    const dateStr = getDateString(day)
    return calendarEvents.find(e => e.date === dateStr && e.type === 'deadline')
  }

  return (
    <AppShell>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Activity heatmap with classes and deadlines
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Calendar with Heatmap - Larger */}
          <Card className="xl:col-span-3 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4 bg-gradient-to-r from-secondary/50 to-transparent">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={goToPreviousMonth} className="hover:bg-secondary">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <CardTitle className="text-xl font-bold">
                  {monthNames[currentMonth]} {currentYear}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={goToNextMonth} className="hover:bg-secondary">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setCurrentMonth(today.getMonth())
                  setCurrentYear(today.getFullYear())
                  setSelectedDate(today.toISOString().split('T')[0])
                }}
                className="font-medium"
              >
                Today
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-2 mb-3">
                {dayNames.map(day => (
                  <div 
                    key={day} 
                    className="text-center text-sm font-semibold text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar grid with heatmap */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="aspect-square md:aspect-[4/3]" />
                  }
                  
                  const dateStr = getDateString(day)
                  const date = new Date(currentYear, currentMonth, day)
                  const dayOfWeek = date.getDay()
                  const isSelected = selectedDate === dateStr
                  const isTodayDate = isToday(day)
                  const deadline = getDeadlineForDay(day)
                  const cooling = isCoolingDay(day)
                  const intensity = getActivityIntensity(dateStr, dayOfWeek)
                  const courseCodes = getCourseCodesForDay(day)
                  
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(dateStr)}
                      className={cn(
                        "aspect-square md:aspect-[4/3] flex flex-col items-center justify-start p-1 md:p-2 rounded-xl text-sm transition-all relative overflow-hidden group",
                        getHeatmapStyle(intensity, isSelected, isTodayDate),
                        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                        deadline && !isSelected && !isTodayDate && "ring-2 ring-red-500",
                        cooling && !isSelected && !isTodayDate && !deadline && "ring-2 ring-cyan-400",
                        "hover:scale-[1.02] hover:shadow-lg hover:z-10"
                      )}
                    >
                      {/* Day number */}
                      <span className={cn(
                        "font-bold text-base md:text-lg",
                        isTodayDate && "drop-shadow-md"
                      )}>
                        {day}
                      </span>
                      
                      {/* Course codes or deadline - shown inside cell */}
                      <div className="hidden md:flex flex-col items-center gap-0.5 mt-1 w-full">
                        {deadline ? (
                          <span className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.5 rounded-md truncate max-w-full",
                            isSelected ? "bg-white/20" : "bg-red-500/90 text-white"
                          )}>
                            {deadline.title.length > 10 ? deadline.title.slice(0, 10) + ".." : deadline.title}
                          </span>
                        ) : courseCodes.length > 0 ? (
                          courseCodes.map(code => (
                            <span 
                              key={code}
                              className={cn(
                                "text-[10px] font-medium px-1.5 py-0.5 rounded-md",
                                isSelected || intensity >= 2 ? "bg-white/20" : "bg-secondary"
                              )}
                            >
                              {code}
                            </span>
                          ))
                        ) : null}
                      </div>
                      
                      {/* Indicators for mobile */}
                      <div className="flex md:hidden gap-1 absolute bottom-1">
                        {deadline && (
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        )}
                        {cooling && (
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        )}
                        {courseCodes.length > 0 && !deadline && (
                          <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                        )}
                      </div>
                      
                      {/* Cooling snowflake indicator */}
                      {cooling && (
                        <Snowflake className={cn(
                          "absolute top-1 right-1 h-3 w-3",
                          isSelected ? "text-white/80" : "text-cyan-300"
                        )} />
                      )}
                    </button>
                  )
                })}
              </div>
              
              {/* Heatmap Legend */}
              <div className="flex flex-wrap items-center justify-between mt-6 pt-4 border-t border-border/50 text-xs text-muted-foreground gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-medium">Activity:</span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-4 w-4 rounded-md bg-secondary/40" />
                    <div className="h-4 w-4 rounded-md bg-gradient-to-br from-cyan-400/60 to-cyan-500/60" />
                    <div className="h-4 w-4 rounded-md bg-gradient-to-br from-cyan-500 to-indigo-500" />
                    <div className="h-4 w-4 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500" />
                    <div className="h-4 w-4 rounded-md bg-gradient-to-br from-violet-500 to-purple-600" />
                    <div className="h-4 w-4 rounded-md bg-gradient-to-br from-violet-600 to-purple-700" />
                  </div>
                  <span>High</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full ring-2 ring-red-500 bg-transparent" />
                    <span>Deadline</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Snowflake className="h-3 w-3 text-cyan-400" />
                    <span>Cooling Day</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-md bg-gradient-to-br from-amber-500 to-orange-600" />
                    <span>Today</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right sidebar - Deadlines and Selected Day */}
          <div className="space-y-4">
            {/* Upcoming Deadlines with Courses */}
            <Card className="border-red-500/20 bg-gradient-to-b from-red-500/5 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Flame className="h-5 w-5 text-red-500" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingDeadlines.slice(0, 6).map(event => {
                    const subject = event.subjectId 
                      ? subjects.find(s => s.id === event.subjectId)
                      : null
                    const daysLeft = getDaysUntil(event.date)
                    const isUrgent = daysLeft <= 2
                    const isSoon = daysLeft <= 5
                    
                    return (
                      <div 
                        key={event.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl transition-colors",
                          isUrgent 
                            ? "bg-gradient-to-r from-red-500/20 to-red-500/10 border border-red-500/30" 
                            : isSoon
                              ? "bg-gradient-to-r from-amber-500/15 to-amber-500/5 border border-amber-500/20"
                              : "bg-secondary/50 border border-transparent"
                        )}
                      >
                        <div className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                          isUrgent 
                            ? "bg-red-500 text-white" 
                            : isSoon
                              ? "bg-amber-500 text-white"
                              : "bg-secondary text-foreground"
                        )}>
                          {daysLeft}d
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm font-semibold truncate",
                            isUrgent && "text-red-400"
                          )}>
                            {event.title}
                          </p>
                          {subject && (
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-[10px] mt-1",
                                isUrgent && "border-red-500/50 text-red-400"
                              )}
                            >
                              {subject.code} - {subject.name}
                            </Badge>
                          )}
                        </div>
                        {isUrgent && (
                          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 animate-pulse" />
                        )}
                      </div>
                    )
                  })}
                  {upcomingDeadlines.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <p className="text-sm">No upcoming deadlines</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Selected Day Details */}
            {selectedDate && (
              <Card className="bg-gradient-to-b from-primary/5 to-transparent">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    {selectedDateObj?.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Classes */}
                  {scheduledClasses.map(subject => {
                    const scheduleTime = subject.schedule.find(s => s.day === selectedDayOfWeek)?.time
                    return (
                      <div 
                        key={subject.id}
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/50"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold">
                          {subject.code.slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{subject.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {scheduleTime}
                          </p>
                        </div>
                      </div>
                    )
                  })}

                  {/* Events */}
                  {selectedEvents.map(event => (
                    <div 
                      key={event.id}
                      className={cn(
                        "flex items-center gap-3 p-2.5 rounded-lg",
                        event.type === 'deadline' && "bg-red-500/10",
                        event.type === 'cooling' && "bg-cyan-500/10",
                        event.type === 'personal' && "bg-secondary/50"
                      )}
                    >
                      <div className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg text-white",
                        event.type === 'deadline' && "bg-red-500",
                        event.type === 'cooling' && "bg-cyan-500",
                        event.type === 'personal' && "bg-secondary text-foreground"
                      )}>
                        {event.type === 'deadline' && <AlertTriangle className="h-4 w-4" />}
                        {event.type === 'cooling' && <Snowflake className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{event.title}</p>
                        {event.time && (
                          <p className="text-xs text-muted-foreground">{event.time}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {scheduledClasses.length === 0 && selectedEvents.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">No activities</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Cooling Day Suggestion */}
            {cooling && (
              <Card className="bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent border-cyan-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Snowflake className="h-4 w-4 text-cyan-400" />
                    Best Day to Bunk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold text-cyan-400">{cooling.day}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {cooling.reason}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
