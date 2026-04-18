"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { GraduationCap, TrendingUp, TrendingDown } from "lucide-react"
import { subjects, getAttendancePercentage, getOverallAttendance } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function AttendanceWidget() {
  const overall = getOverallAttendance()
  const isHealthy = overall >= 75

  // Get top 3 college subjects by attendance concern (exclude personal)
  const sortedSubjects = [...subjects]
    .filter(s => s.type === "college")
    .map(s => ({ ...s, percentage: getAttendancePercentage(s) }))
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3)

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Attendance</CardTitle>
        <GraduationCap className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className={cn(
            "text-3xl font-bold",
            isHealthy ? "text-success" : "text-destructive"
          )}>
            {overall}%
          </span>
          <span className="flex items-center text-xs text-muted-foreground">
            {isHealthy ? (
              <>
                <TrendingUp className="h-3 w-3 mr-1 text-success" />
                Above 75%
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3 mr-1 text-destructive" />
                Below 75%
              </>
            )}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {sortedSubjects.map(subject => {
            const pct = subject.percentage
            const isLow = pct < 75
            return (
              <div key={subject.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{subject.code}</span>
                  <span className={cn(
                    "font-medium",
                    isLow ? "text-destructive" : "text-foreground"
                  )}>
                    {pct}%
                  </span>
                </div>
                <Progress 
                  value={pct} 
                  className={cn(
                    "h-1.5",
                    isLow && "[&>div]:bg-destructive"
                  )}
                />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
