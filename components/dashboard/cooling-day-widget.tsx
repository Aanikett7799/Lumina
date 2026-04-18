"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Snowflake, CheckCircle2, AlertCircle } from "lucide-react"
import { getCoolingDaySuggestion } from "@/lib/mock-data"

export function CoolingDayWidget() {
  const suggestion = getCoolingDaySuggestion()

  return (
    <Card className="col-span-full md:col-span-1 bg-gradient-to-br from-info/10 to-info/5 border-info/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Cooling Day</CardTitle>
        <Snowflake className="h-4 w-4 text-info" />
      </CardHeader>
      <CardContent>
        {suggestion ? (
          <>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="text-2xl font-bold text-info">{suggestion.day}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {suggestion.reason}
            </p>
            <div className="mt-3 text-xs text-info/80">
              Take a break without worry!
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              <span className="text-lg font-medium text-warning">No cooling day available</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Your attendance is too low. Attend more classes to unlock a cooling day.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
