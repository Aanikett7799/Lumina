"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, BookOpen, AlertTriangle, Snowflake } from "lucide-react"
import { calendarEvents } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function ScheduleWidget() {
  // Get today's date string
  const today = new Date().toISOString().split('T')[0]
  
  // Get events for today and upcoming
  const todayEvents = calendarEvents.filter(e => e.date === today)
  const upcomingEvents = calendarEvents
    .filter(e => e.date > today)
    .slice(0, 3)

  const allEvents = [...todayEvents, ...upcomingEvents].slice(0, 5)

  const getEventIcon = (type: string) => {
    switch (type) {
      case "class":
        return <BookOpen className="h-4 w-4" />
      case "deadline":
        return <AlertTriangle className="h-4 w-4" />
      case "cooling":
        return <Snowflake className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "class":
        return "text-foreground bg-secondary"
      case "deadline":
        return "text-destructive bg-destructive/10"
      case "cooling":
        return "text-info bg-info/10"
      default:
        return "text-muted-foreground bg-muted"
    }
  }

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Schedule</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {allEvents.length > 0 ? (
          <div className="space-y-3">
            {allEvents.map(event => {
              const eventDate = new Date(event.date)
              const isToday = event.date === today

              return (
                <div 
                  key={event.id}
                  className="flex items-start gap-3"
                >
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    getEventColor(event.type)
                  )}>
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {isToday ? (
                        <span className="text-primary font-medium">Today</span>
                      ) : (
                        <span>
                          {eventDate.toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      )}
                      {event.time && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <span className="text-sm">No upcoming events</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
