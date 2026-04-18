"use client"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Mail, GraduationCap, AlertTriangle, Clock } from "lucide-react"
import { alerts } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// Display simple relative time labels from mock data timestamps
function getTimeLabel(timestamp: string): string {
  // Use static labels to avoid hydration mismatch
  const hour = new Date(timestamp).getHours()
  if (hour >= 14) return "Today"
  if (hour >= 8) return "This morning"
  return "Earlier"
}

export function AlertsWidget() {
  const unreadAlerts = alerts.filter(a => !a.read).slice(0, 4)
  const urgentCount = alerts.filter(a => a.urgent && !a.read).length

  return (
    <Card className="col-span-full md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Alerts
        </CardTitle>
        {urgentCount > 0 && (
          <Badge variant="destructive" className="text-xs">
            {urgentCount} urgent
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {unreadAlerts.map(alert => (
            <div 
              key={alert.id}
              className={cn(
                "flex items-start gap-3 p-2 rounded-lg transition-colors",
                alert.urgent 
                  ? "bg-destructive/10 border border-destructive/20" 
                  : "bg-secondary/50"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                alert.source === "gmail" 
                  ? "bg-red-500/20 text-red-400" 
                  : "bg-orange-500/20 text-orange-400"
              )}>
                {alert.source === "gmail" ? (
                  <Mail className="h-4 w-4" />
                ) : (
                  <GraduationCap className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{alert.title}</p>
                  {alert.urgent && (
                    <AlertTriangle className="h-3 w-3 text-destructive shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{alert.message}</p>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                <Clock className="h-3 w-3" />
                {getTimeLabel(alert.timestamp)}
              </div>
            </div>
          ))}
          {unreadAlerts.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <Bell className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No new alerts</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
