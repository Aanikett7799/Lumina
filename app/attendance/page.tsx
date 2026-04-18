"use client"

import { useState, useRef } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  GraduationCap, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Snowflake,
  Plus,
  Minus,
  Calendar,
  Upload,
  Camera,
  FileText,
  Scan,
  User,
  Building2
} from "lucide-react"
import { 
  subjects, 
  getAttendancePercentage, 
  getSafeBunks, 
  getClassesNeeded,
  getCoolingDaySuggestion,
  type Subject
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function SubjectCard({ subject, onUpdate }: { subject: Subject; onUpdate: (id: string, attended: number, total: number) => void }) {
  const percentage = getAttendancePercentage(subject)
  const safeBunks = getSafeBunks(subject)
  const classesNeeded = getClassesNeeded(subject)
  const isHealthy = percentage >= 75
  const isCritical = percentage < 65
  const isPersonal = subject.type === "personal"

  const handleAttend = () => {
    onUpdate(subject.id, subject.attended + 1, subject.total + 1)
  }

  const handleMiss = () => {
    onUpdate(subject.id, subject.attended, subject.total + 1)
  }

  return (
    <Card className={cn(
      "transition-colors",
      isCritical && !isPersonal && "border-destructive/50 bg-destructive/5"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              {subject.name}
              {isPersonal && (
                <Badge variant="outline" className="text-xs">
                  <User className="h-3 w-3 mr-1" />
                  Personal
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{subject.code}</CardDescription>
          </div>
          <Badge 
            variant={isHealthy ? "default" : isCritical ? "destructive" : "secondary"}
            className={cn(
              isHealthy && "bg-success text-success-foreground"
            )}
          >
            {percentage}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{subject.attended} / {subject.total} classes</span>
            <span>Target: 75%</span>
          </div>
          <Progress 
            value={percentage} 
            className={cn(
              "h-2",
              isCritical && "[&>div]:bg-destructive",
              isHealthy && "[&>div]:bg-success"
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {isHealthy ? (
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-4 w-4" />
              <span>{safeBunks} safe bunk{safeBunks !== 1 ? 's' : ''}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span>Need {classesNeeded} more</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{subject.schedule.length}x/week</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleMiss}
          >
            <Minus className="h-4 w-4 mr-1" />
            Missed
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
            onClick={handleAttend}
          >
            <Plus className="h-4 w-4 mr-1" />
            Attended
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function TimetableUploadDialog({ onUpload }: { onUpload: (type: "college" | "personal") => void }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadType, setUploadType] = useState<"college" | "personal">("college")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = () => {
    setIsProcessing(true)
    // Simulate OCR processing
    setTimeout(() => {
      setIsProcessing(false)
      onUpload(uploadType)
    }, 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Timetable
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Upload Timetable via OCR
          </DialogTitle>
          <DialogDescription>
            Upload a photo or PDF of your timetable and we&apos;ll automatically extract the schedule.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Timetable Type Selection */}
          <div className="flex gap-2">
            <Button 
              variant={uploadType === "college" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setUploadType("college")}
            >
              <Building2 className="h-4 w-4 mr-2" />
              College
            </Button>
            <Button 
              variant={uploadType === "personal" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setUploadType("personal")}
            >
              <User className="h-4 w-4 mr-2" />
              Personal
            </Button>
          </div>

          {/* Upload Options */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
            />
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              <FileText className="h-6 w-6" />
              <span className="text-xs">Upload File</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              <Camera className="h-6 w-6" />
              <span className="text-xs">Take Photo</span>
            </Button>
          </div>

          {isProcessing && (
            <div className="text-center py-4">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Processing timetable with OCR...</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Supports images (JPG, PNG) and PDF files. Make sure the text is clearly visible.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function AttendancePage() {
  const [subjectData, setSubjectData] = useState(subjects)
  const [activeTab, setActiveTab] = useState<"all" | "college" | "personal">("all")
  
  const collegeSubjects = subjectData.filter(s => s.type === "college")
  const personalSubjects = subjectData.filter(s => s.type === "personal")
  
  const overall = collegeSubjects.length > 0 
    ? Math.round(
        collegeSubjects.reduce((sum, s) => sum + s.attended, 0) / 
        collegeSubjects.reduce((sum, s) => sum + s.total, 0) * 100
      )
    : 0
  const isOverallHealthy = overall >= 75
  const cooling = getCoolingDaySuggestion()

  const handleUpdate = (id: string, attended: number, total: number) => {
    setSubjectData(prev => 
      prev.map(s => 
        s.id === id ? { ...s, attended, total } : s
      )
    )
  }

  const handleTimetableUpload = (type: "college" | "personal") => {
    // In a real app, this would add the extracted subjects
    console.log(`Uploaded ${type} timetable`)
  }

  const filteredSubjects = activeTab === "all" 
    ? subjectData 
    : subjectData.filter(s => s.type === activeTab)

  const criticalSubjects = filteredSubjects.filter(s => 
    s.type === "college" && getAttendancePercentage(s) < 75
  )
  const healthySubjects = filteredSubjects.filter(s => 
    s.type === "personal" || getAttendancePercentage(s) >= 75
  )

  return (
    <AppShell>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Attendance Tracker</h1>
            <p className="text-muted-foreground mt-1">
              Track your attendance and calculate safe bunks.
            </p>
          </div>
          <TimetableUploadDialog onUpload={handleTimetableUpload} />
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Overall Attendance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">College Attendance</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className={cn(
                  "text-4xl font-bold",
                  isOverallHealthy ? "text-success" : "text-destructive"
                )}>
                  {overall}%
                </span>
                {isOverallHealthy ? (
                  <TrendingUp className="h-5 w-5 text-success" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-destructive" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {collegeSubjects.reduce((sum, s) => sum + s.attended, 0)} / {collegeSubjects.reduce((sum, s) => sum + s.total, 0)} total classes
              </p>
            </CardContent>
          </Card>

          {/* Subjects Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Subjects Status</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-4">
                <div>
                  <span className="text-4xl font-bold text-success">
                    {collegeSubjects.filter(s => getAttendancePercentage(s) >= 75).length}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">safe</span>
                </div>
                <div>
                  <span className="text-4xl font-bold text-destructive">
                    {collegeSubjects.filter(s => getAttendancePercentage(s) < 75).length}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">critical</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                + {personalSubjects.length} personal schedule{personalSubjects.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          {/* Cooling Day */}
          <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cooling Day</CardTitle>
              <Snowflake className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              {cooling ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-info">{cooling.day}</span>
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {cooling.reason}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-lg font-medium text-warning">Not Available</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Improve attendance to unlock cooling days.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs for filtering */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="mb-6">
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              All
              <Badge variant="secondary" className="ml-1">{subjectData.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="college" className="gap-2">
              <Building2 className="h-4 w-4" />
              College
              <Badge variant="secondary" className="ml-1">{collegeSubjects.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="personal" className="gap-2">
              <User className="h-4 w-4" />
              Personal
              <Badge variant="secondary" className="ml-1">{personalSubjects.length}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Subject Cards */}
        <div className="space-y-4">
          {criticalSubjects.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-destructive mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Needs Attention
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {criticalSubjects.map(subject => (
                  <SubjectCard 
                    key={subject.id} 
                    subject={subject} 
                    onUpdate={handleUpdate}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-sm font-medium text-success mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              On Track
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthySubjects.map(subject => (
                <SubjectCard 
                  key={subject.id} 
                  subject={subject} 
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
