"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react"
import { tasks } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function TasksWidget() {
  const pendingTasks = tasks.filter(t => t.status !== "done").slice(0, 4)
  const completedCount = tasks.filter(t => t.status === "done").length
  const totalCount = tasks.length

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Tasks</CardTitle>
        <Badge variant="secondary" className="text-xs">
          {completedCount}/{totalCount} done
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingTasks.map(task => {
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()
            const isDoing = task.status === "doing"

            return (
              <div 
                key={task.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg p-2 -mx-2",
                  isDoing && "bg-secondary/50"
                )}
              >
                <div className="mt-0.5">
                  {isDoing ? (
                    <Clock className="h-4 w-4 text-warning" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  {task.dueDate && (
                    <p className={cn(
                      "text-xs mt-0.5",
                      isOverdue ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {isOverdue && <AlertCircle className="h-3 w-3 inline mr-1" />}
                      Due: {new Date(task.dueDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  )}
                </div>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs shrink-0",
                    task.priority === "high" && "border-destructive/50 text-destructive",
                    task.priority === "medium" && "border-warning/50 text-warning",
                    task.priority === "low" && "border-muted-foreground/50 text-muted-foreground"
                  )}
                >
                  {task.priority}
                </Badge>
              </div>
            )
          })}
        </div>

        {pendingTasks.length === 0 && (
          <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <span className="text-sm">All tasks completed!</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
