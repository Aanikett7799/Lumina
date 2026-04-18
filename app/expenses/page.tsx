"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Wallet, 
  Plus,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  AlertTriangle,
  CheckCircle2
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { 
  expenses as initialExpenses, 
  getExpenseTotals,
  type Expense
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const categories = [
  { value: "Food", type: "good" },
  { value: "Books", type: "good" },
  { value: "Transport", type: "good" },
  { value: "Entertainment", type: "bad" },
  { value: "Snacks", type: "bad" },
  { value: "Coffee", type: "bad" },
  { value: "Shopping", type: "bad" },
  { value: "Other", type: "good" },
]

export default function ExpensesPage() {
  const [expenseList, setExpenseList] = useState(initialExpenses)
  const [newAmount, setNewAmount] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [newDescription, setNewDescription] = useState("")
  
  // Calculate totals
  const good = expenseList.filter(e => e.type === "good").reduce((sum, e) => sum + e.amount, 0)
  const bad = expenseList.filter(e => e.type === "bad").reduce((sum, e) => sum + e.amount, 0)
  const total = good + bad
  const badPercentage = total > 0 ? Math.round((bad / total) * 100) : 0
  
  // Category breakdown for pie chart
  const categoryTotals = expenseList.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount
    return acc
  }, {} as Record<string, number>)
  
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
    type: categories.find(c => c.value === name)?.type || "good"
  }))
  
  // Daily spending for bar chart
  const dailySpending = expenseList.reduce((acc, exp) => {
    const date = new Date(exp.date).toLocaleDateString('en-US', { weekday: 'short' })
    if (!acc[date]) acc[date] = { date, good: 0, bad: 0 }
    if (exp.type === "good") {
      acc[date].good += exp.amount
    } else {
      acc[date].bad += exp.amount
    }
    return acc
  }, {} as Record<string, { date: string; good: number; bad: number }>)
  
  const barData = Object.values(dailySpending).slice(-7)
  
  const addExpense = () => {
    if (!newAmount || !newCategory) return
    
    const categoryInfo = categories.find(c => c.value === newCategory)
    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(newAmount),
      category: newCategory,
      type: (categoryInfo?.type || "good") as "good" | "bad",
      description: newDescription || newCategory,
      date: new Date().toISOString().split('T')[0],
    }
    
    setExpenseList([newExpense, ...expenseList])
    setNewAmount("")
    setNewCategory("")
    setNewDescription("")
  }
  
  // Get insights
  const topBadCategory = pieData
    .filter(d => d.type === "bad")
    .sort((a, b) => b.value - a.value)[0]
  
  const suggestions = []
  if (badPercentage > 30) {
    suggestions.push(`Reduce impulsive spending to below 30% (currently ${badPercentage}%)`)
  }
  if (topBadCategory) {
    suggestions.push(`Cut down on ${topBadCategory.name} - Rs. ${topBadCategory.value} this week`)
  }

  return (
    <AppShell>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Expense Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Track spending, identify patterns, and improve financial habits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Add Expense & Summary */}
          <div className="space-y-4">
            {/* Add Expense */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Expense
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Input
                    type="number"
                    placeholder="Amount (Rs.)"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <span className="flex items-center gap-2">
                            {cat.value}
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                cat.type === "good" 
                                  ? "border-success/50 text-success" 
                                  : "border-destructive/50 text-destructive"
                              )}
                            >
                              {cat.type}
                            </Badge>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Input
                    placeholder="Description (optional)"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={addExpense}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                  <p className="text-4xl font-bold">
                    <span className="text-lg text-muted-foreground">Rs.</span> {total.toLocaleString()}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-success/10 text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-success mb-1">
                      <ArrowUpRight className="h-3 w-3" />
                      Essential
                    </div>
                    <p className="text-lg font-bold text-success">
                      Rs. {good.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-destructive/10 text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-destructive mb-1">
                      <ArrowDownRight className="h-3 w-3" />
                      Impulsive
                    </div>
                    <p className="text-lg font-bold text-destructive">
                      Rs. {bad.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-secondary">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Impulsive Ratio</span>
                    <span className={cn(
                      "text-sm font-bold",
                      badPercentage > 30 ? "text-destructive" : "text-success"
                    )}>
                      {badPercentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all",
                        badPercentage > 30 ? "bg-destructive" : "bg-success"
                      )}
                      style={{ width: `${badPercentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card className={cn(
              badPercentage > 30 
                ? "border-warning/30 bg-warning/5" 
                : "border-success/30 bg-success/5"
            )}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <PiggyBank className="h-4 w-4" />
                  Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                {suggestions.length > 0 ? (
                  <ul className="space-y-2">
                    {suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm">Great job! Your spending is on track.</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Middle & Right - Charts & History */}
          <div className="lg:col-span-2 space-y-4">
            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Breakdown */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: 'Amount',
                      },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.type === "good" 
                                ? "hsl(var(--chart-1))" 
                                : "hsl(var(--chart-4))"
                              } 
                            />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {pieData.slice(0, 4).map((item, i) => (
                      <Badge 
                        key={i} 
                        variant="outline"
                        className={cn(
                          "text-xs",
                          item.type === "good" 
                            ? "border-success/50" 
                            : "border-destructive/50"
                        )}
                      >
                        {item.name}: Rs. {item.value}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Daily Trend */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Daily Spending</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      good: {
                        label: 'Essential',
                        color: 'hsl(var(--chart-1))',
                      },
                      bad: {
                        label: 'Impulsive',
                        color: 'hsl(var(--chart-4))',
                      },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 11 }}
                          className="text-muted-foreground"
                        />
                        <YAxis 
                          tick={{ fontSize: 11 }}
                          className="text-muted-foreground"
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar 
                          dataKey="good" 
                          stackId="a" 
                          fill="var(--color-good)" 
                          radius={[0, 0, 0, 0]}
                        />
                        <Bar 
                          dataKey="bad" 
                          stackId="a" 
                          fill="var(--color-bad)" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Expenses */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Recent Expenses</CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {expenseList.slice(0, 8).map(expense => (
                    <div 
                      key={expense.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        expense.type === "good" 
                          ? "bg-success/10 text-success" 
                          : "bg-destructive/10 text-destructive"
                      )}>
                        {expense.type === "good" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{expense.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {expense.category} • {new Date(expense.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className={cn(
                        "text-sm font-medium",
                        expense.type === "good" ? "text-foreground" : "text-destructive"
                      )}>
                        Rs. {expense.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
