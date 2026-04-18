"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Target, 
  Play, 
  Pause,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Users,
  Zap,
  AlertTriangle,
  Trophy,
  Crown,
  Flame
} from "lucide-react"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { 
  focusSessions, 
  getCurrentFocusScore, 
  groupMembers,
  type GroupMember
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// Prepare chart data
const chartData = [...focusSessions]
  .reverse()
  .map(session => ({
    date: new Date(session.date).toLocaleDateString('en-US', { weekday: 'short' }),
    score: session.score,
    distractions: session.distractions,
    duration: session.duration,
  }))

// Member timeline component with cartoon avatars
function MemberTimeline({ member, isYou }: { member: GroupMember; isYou: boolean }) {
  const weekDays = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  
  return (
    <div className={cn(
      "p-4 rounded-xl transition-all",
      isYou ? "bg-primary/10 border-2 border-primary/30" : "bg-secondary/30",
      member.rank === 1 && "ring-2 ring-amber-400/50"
    )}>
      {/* Header with avatar and stats */}
      <div className="flex items-center gap-3 mb-4">
        {/* Cartoon Avatar */}
        <div className={cn(
          "relative w-14 h-14 rounded-full flex items-center justify-center text-3xl",
          member.rank === 1 && "ring-2 ring-amber-400 ring-offset-2 ring-offset-background"
        )}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20" />
          <span className="relative z-10">{member.avatar}</span>
          {member.rank === 1 && (
            <Crown className="absolute -top-2 -right-1 h-5 w-5 text-amber-400 fill-amber-400" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-semibold",
              isYou && "text-primary"
            )}>
              {member.name}
            </span>
            {isYou && (
              <Badge variant="outline" className="text-xs">You</Badge>
            )}
            <Badge 
              variant="secondary" 
              className={cn(
                "ml-auto",
                member.rank === 1 && "bg-amber-500/20 text-amber-400",
                member.rank === 2 && "bg-slate-400/20 text-slate-400",
                member.rank === 3 && "bg-orange-500/20 text-orange-400"
              )}
            >
              #{member.rank}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className={cn(
              "text-2xl font-bold",
              member.currentScore >= 80 ? "text-success" : 
              member.currentScore >= 60 ? "text-warning" : "text-destructive"
            )}>
              {member.currentScore}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Flame className={cn(
                "h-3 w-3",
                member.streak >= 5 ? "text-orange-400" : "text-muted-foreground"
              )} />
              {member.streak} day streak
            </div>
          </div>
        </div>
      </div>
      
      {/* Weekly Progress Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
        
        {/* Progress nodes */}
        <div className="relative flex justify-between">
          {member.weeklyProgress.map((day, idx) => {
            const scoreColor = day.score >= 80 
              ? "bg-success border-success" 
              : day.score >= 60 
                ? "bg-warning border-warning" 
                : "bg-destructive border-destructive"
            
            const prevScore = idx > 0 ? member.weeklyProgress[idx - 1].score : day.score
            const trend = day.score - prevScore
            
            return (
              <div key={day.date} className="flex flex-col items-center gap-1">
                {/* Node */}
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-transform hover:scale-110",
                    scoreColor,
                    "text-white"
                  )}
                >
                  {day.score}
                </div>
                {/* Trend indicator */}
                <div className={cn(
                  "text-[10px]",
                  trend > 0 ? "text-success" : trend < 0 ? "text-destructive" : "text-muted-foreground"
                )}>
                  {trend > 0 ? `+${trend}` : trend < 0 ? trend : "="}
                </div>
                {/* Day label */}
                <span className="text-[10px] text-muted-foreground mt-1">
                  {weekDays[idx]}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function FocusPage() {
  const currentScore = getCurrentFocusScore()
  const topScorer = groupMembers.reduce((top, m) => m.currentScore > top.currentScore ? m : top)
  const isYouTop = topScorer.id === "1"
  
  // Focus timer state
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(25 * 60)
  const [sessionScore, setSessionScore] = useState(100)
  const [distractions, setDistractions] = useState(0)
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(t => t - 1)
      }, 1000)
    } else if (time === 0) {
      setIsRunning(false)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, time])
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  const resetTimer = () => {
    setIsRunning(false)
    setTime(25 * 60)
    setSessionScore(100)
    setDistractions(0)
  }
  
  const simulateDistraction = () => {
    if (isRunning) {
      setDistractions(d => d + 1)
      setSessionScore(s => Math.max(0, s - 5))
    }
  }
  
  const progress = ((25 * 60 - time) / (25 * 60)) * 100
  
  // Best and worst days
  const bestSession = focusSessions.reduce((best, s) => s.score > best.score ? s : best)
  const worstSession = focusSessions.reduce((worst, s) => s.score < worst.score ? s : worst)
  
  const totalFocusTime = focusSessions.reduce((sum, s) => sum + s.duration, 0)
  const avgDistractions = Math.round(focusSessions.reduce((sum, s) => sum + s.distractions, 0) / focusSessions.length)

  // Sort members by rank
  const sortedMembers = [...groupMembers].sort((a, b) => a.rank - b.rank)

  return (
    <AppShell>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Focus Score</h1>
          <p className="text-muted-foreground mt-1">
            Track your focus, minimize distractions, and compete with peers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Timer & Current Session */}
          <div className="space-y-4">
            {/* Focus Timer */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Focus Timer
                </CardTitle>
                <CardDescription>25-minute Pomodoro session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Timer Display */}
                <div className="text-center">
                  <div className={cn(
                    "text-6xl font-bold font-mono",
                    isRunning ? "text-primary" : "text-foreground"
                  )}>
                    {formatTime(time)}
                  </div>
                  <Progress 
                    value={progress} 
                    className="mt-4 h-2"
                  />
                </div>
                
                {/* Session Score */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="text-xs text-muted-foreground">Session Score</p>
                    <p className={cn(
                      "text-2xl font-bold",
                      sessionScore >= 80 ? "text-success" : 
                      sessionScore >= 60 ? "text-warning" : "text-destructive"
                    )}>
                      {sessionScore}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Distractions</p>
                    <p className="text-2xl font-bold text-destructive">{distractions}</p>
                  </div>
                </div>
                
                {/* Controls */}
                <div className="flex gap-2">
                  <Button 
                    variant={isRunning ? "secondary" : "default"}
                    className="flex-1"
                    onClick={() => setIsRunning(!isRunning)}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="icon" onClick={resetTimer}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Simulate distraction for demo */}
                {isRunning && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-muted-foreground"
                    onClick={simulateDistraction}
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Simulate Distraction (Demo)
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-success" />
                    <span className="text-xs text-muted-foreground">Best Day</span>
                  </div>
                  <p className="text-2xl font-bold text-success mt-1">{bestSession.score}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Total Focus</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{Math.round(totalFocusTime / 60)}h</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Middle & Right - Charts & Competition */}
          <div className="lg:col-span-2 space-y-4">
            {/* Competition Leaderboard with Timelines */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-400" />
                      Group Competition
                    </CardTitle>
                    <CardDescription>Weekly progress timeline for each member</CardDescription>
                  </div>
                  <Badge 
                    variant={isYouTop ? "default" : "secondary"}
                    className={cn(isYouTop && "bg-amber-500 text-black")}
                  >
                    {isYouTop ? "You're #1!" : `Rank #${groupMembers.find(m => m.id === "1")?.rank}`}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedMembers.map(member => (
                    <MemberTimeline 
                      key={member.id} 
                      member={member} 
                      isYou={member.id === "1"}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Score Trend Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Your Weekly Focus Trend</CardTitle>
                <CardDescription>Your focus score over the past 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    score: {
                      label: 'Focus Score',
                      color: 'hsl(var(--chart-1))',
                    },
                  }}
                  className="h-[180px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                      />
                      <YAxis 
                        domain={[0, 100]}
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="var(--color-score)"
                        strokeWidth={2}
                        dot={{ fill: 'var(--color-score)', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Distractions Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Daily Distractions</CardTitle>
                <CardDescription>Keep this low to improve your score</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    distractions: {
                      label: 'Distractions',
                      color: 'hsl(var(--chart-4))',
                    },
                  }}
                  className="h-[120px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="distractions"
                        fill="var(--color-distractions)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
