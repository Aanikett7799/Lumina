"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { getExpenseTotals } from "@/lib/mock-data"

export function ExpenseWidget() {
  const { good, bad, total } = getExpenseTotals()
  const badPercentage = Math.round((bad / total) * 100)

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">This Week</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          <span className="text-muted-foreground text-lg">Rs.</span> {total.toLocaleString()}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-success" />
              Essential
            </div>
            <div className="text-sm font-medium text-success">
              Rs. {good.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowDownRight className="h-3 w-3 text-destructive" />
              Impulsive
            </div>
            <div className="text-sm font-medium text-destructive">
              Rs. {bad.toLocaleString()}
            </div>
          </div>
        </div>

        {badPercentage > 30 && (
          <p className="mt-3 text-xs text-warning">
            {badPercentage}% of spending is impulsive. Try to reduce unnecessary expenses.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
