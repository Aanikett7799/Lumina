"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Users, TrendingUp, Trophy, Crown } from "lucide-react"
import { getCurrentFocusScore, getHighestFocusScore, groupMembers } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function FocusWidget() {
  const score = getCurrentFocusScore()
  const highest = getHighestFocusScore()
  const topScorer = groupMembers.reduce((top, m) => m.currentScore > top.currentScore ? m : top)
  const isYouTop = topScorer.id === "1"
  const diff = Math.abs(score - topScorer.currentScore)

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Focus Score</CardTitle>
        <Target className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <span className={cn(
              "text-3xl font-bold",
              score >= 80 ? "text-success" : score >= 60 ? "text-warning" : "text-destructive"
            )}>
              {score}
            </span>
            <span className="text-lg text-muted-foreground">/100</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5">
              <Crown className="h-3 w-3 text-amber-400" />
              <span className="text-xs text-amber-400">{topScorer.currentScore}</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5">
              <Trophy className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{highest.score}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          {isYouTop ? (
            <>
              <Crown className="h-4 w-4 text-amber-400" />
              <span className="text-sm text-amber-400">You&apos;re leading the group!</span>
            </>
          ) : (
            <>
              <TrendingUp className={cn(
                "h-4 w-4",
                diff <= 5 ? "text-success" : "text-warning"
              )} />
              <span className={cn(
                "text-sm",
                diff <= 5 ? "text-success" : "text-warning"
              )}>
                {diff} pts behind {topScorer.name}
              </span>
            </>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>Best: {highest.score} on {new Date(highest.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </CardContent>
    </Card>
  )
}
