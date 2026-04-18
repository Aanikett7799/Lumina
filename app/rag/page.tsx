"use client"

import { useState, useRef } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen,
  Upload,
  FileText,
  MessageSquare,
  Send,
  Sparkles,
  ChevronRight,
  FileUp,
  Trash2,
  Download,
  Brain,
  GitBranch,
  List,
  Loader2,
  Bot,
  User
} from "lucide-react"
import { documents, type Document } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface GeneratedNote {
  id: string
  title: string
  type: "summary" | "flowchart" | "keypoints"
  content: string[]
  documentId: string
}

// Sample generated notes
const sampleNotes: GeneratedNote[] = [
  {
    id: "1",
    title: "Database Normalization Summary",
    type: "summary",
    content: [
      "Normalization is a process to organize data in a database to reduce redundancy and improve data integrity.",
      "The process involves dividing large tables into smaller tables and defining relationships between them.",
      "Key benefits include: eliminating redundant data, ensuring data dependencies make sense, and reducing storage requirements."
    ],
    documentId: "1"
  },
  {
    id: "2",
    title: "Normalization Forms Flowchart",
    type: "flowchart",
    content: [
      "START: Unnormalized Data",
      " -> 1NF: Eliminate repeating groups, create separate tables for related data",
      " -> 2NF: Remove partial dependencies (must be in 1NF first)",
      " -> 3NF: Remove transitive dependencies (must be in 2NF first)",
      " -> BCNF: Every determinant is a candidate key",
      "END: Fully Normalized Database"
    ],
    documentId: "1"
  },
  {
    id: "3",
    title: "CPU Scheduling Key Points",
    type: "keypoints",
    content: [
      "FCFS (First Come First Serve): Simple but can cause convoy effect",
      "SJF (Shortest Job First): Optimal but requires knowing burst time",
      "Round Robin: Fair time-sharing with configurable time quantum",
      "Priority Scheduling: Processes assigned priorities, risk of starvation"
    ],
    documentId: "2"
  }
]

export default function RAGPage() {
  const [docs, setDocs] = useState<Document[]>(documents)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [notes, setNotes] = useState<GeneratedNote[]>(sampleNotes)
  const [isUploading, setIsUploading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateType, setGenerateType] = useState<"summary" | "flowchart" | "keypoints">("summary")
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your Study AI assistant. Upload your textbooks and I can help you understand concepts, generate notes, or answer any questions. What would you like to learn today?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    
    setIsUploading(true)
    
    // Simulate upload processing
    setTimeout(() => {
      const newDocs: Document[] = Array.from(files).map((file, idx) => ({
        id: `new-${Date.now()}-${idx}`,
        name: file.name,
        type: file.name.endsWith('.pdf') ? 'pdf' : 'image',
        uploadedAt: new Date().toISOString(),
        subject: "Uncategorized"
      }))
      
      setDocs(prev => [...prev, ...newDocs])
      setIsUploading(false)
    }, 2000)
  }

  const handleDeleteDoc = (docId: string) => {
    setDocs(prev => prev.filter(d => d.id !== docId))
    if (selectedDoc?.id === docId) {
      setSelectedDoc(null)
    }
  }

  const handleGenerateNotes = () => {
    if (!selectedDoc) return
    
    setIsGenerating(true)
    
    // Simulate note generation
    setTimeout(() => {
      const newNote: GeneratedNote = {
        id: `note-${Date.now()}`,
        title: `${selectedDoc.name} - ${generateType.charAt(0).toUpperCase() + generateType.slice(1)}`,
        type: generateType,
        content: generateType === "summary" 
          ? ["This is an AI-generated summary of the document.", "Key concepts have been extracted and organized.", "Review these points for quick revision."]
          : generateType === "flowchart"
            ? ["START: Main Concept", " -> Step 1: Introduction", " -> Step 2: Core Ideas", " -> Step 3: Applications", "END: Conclusion"]
            : ["Point 1: Important concept explained", "Point 2: Key terminology defined", "Point 3: Practice problems to solve", "Point 4: Related topics to explore"],
        documentId: selectedDoc.id
      }
      
      setNotes(prev => [...prev, newNote])
      setIsGenerating(false)
    }, 3000)
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)
    
    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "normalization": "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. The main normal forms are:\n\n1. **1NF**: Eliminate repeating groups\n2. **2NF**: Remove partial dependencies\n3. **3NF**: Remove transitive dependencies\n4. **BCNF**: Every determinant must be a candidate key\n\nWould you like me to explain any of these in more detail?",
        "scheduling": "CPU Scheduling algorithms determine which process runs on the CPU. The main types are:\n\n- **FCFS**: First Come First Serve - simple but can cause convoy effect\n- **SJF**: Shortest Job First - optimal for average waiting time\n- **Round Robin**: Time-sharing with fixed time quantum\n- **Priority**: Based on process priority levels\n\nShall I explain how any of these work?",
        "default": "That's a great question! Based on your uploaded documents, I can help you understand this concept better. Let me break it down:\n\n1. First, let's understand the fundamentals\n2. Then we'll look at practical applications\n3. Finally, I'll suggest some practice problems\n\nWould you like me to elaborate on any specific aspect?"
      }
      
      const lowerInput = inputValue.toLowerCase()
      let responseContent = responses.default
      
      if (lowerInput.includes("normal")) {
        responseContent = responses.normalization
      } else if (lowerInput.includes("schedul") || lowerInput.includes("cpu")) {
        responseContent = responses.scheduling
      }
      
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: responseContent,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const docNotes = selectedDoc ? notes.filter(n => n.documentId === selectedDoc.id) : []

  return (
    <AppShell>
      <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-3.5rem)]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Study AI
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload textbooks, generate smart notes, and ask doubts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-5rem)]">
          {/* Left Column - Documents & Notes */}
          <div className="space-y-4 overflow-auto">
            {/* Upload Section */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,image/*"
                  multiple
                  onChange={handleFileUpload}
                />
                <Button 
                  variant="outline" 
                  className="w-full h-20 border-dashed"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="text-xs">Processing...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <FileUp className="h-6 w-6" />
                      <span className="text-xs">Drop PDF or images here</span>
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Documents List */}
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Your Documents
                  </span>
                  <Badge variant="secondary">{docs.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {docs.map(doc => (
                      <div 
                        key={doc.id}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                          selectedDoc?.id === doc.id 
                            ? "bg-primary/10 border border-primary/30" 
                            : "bg-secondary/50 hover:bg-secondary"
                        )}
                        onClick={() => setSelectedDoc(doc)}
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.subject}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteDoc(doc.id)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Generate Notes Section */}
            {selectedDoc && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Generate Notes
                  </CardTitle>
                  <CardDescription>
                    From: {selectedDoc.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Button 
                      variant={generateType === "summary" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setGenerateType("summary")}
                    >
                      <List className="h-3 w-3 mr-1" />
                      Summary
                    </Button>
                    <Button 
                      variant={generateType === "flowchart" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setGenerateType("flowchart")}
                    >
                      <GitBranch className="h-3 w-3 mr-1" />
                      Flowchart
                    </Button>
                    <Button 
                      variant={generateType === "keypoints" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setGenerateType("keypoints")}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Key Points
                    </Button>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={handleGenerateNotes}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate {generateType.charAt(0).toUpperCase() + generateType.slice(1)}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Middle Column - Generated Notes */}
          <div className="overflow-auto">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Generated Notes
                </CardTitle>
                <CardDescription>
                  {selectedDoc ? `Notes for ${selectedDoc.name}` : "Select a document to view notes"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-20rem)]">
                  {selectedDoc ? (
                    <div className="space-y-4">
                      {docNotes.length > 0 ? (
                        docNotes.map(note => (
                          <div 
                            key={note.id}
                            className={cn(
                              "p-4 rounded-lg border",
                              note.type === "summary" && "bg-blue-500/5 border-blue-500/20",
                              note.type === "flowchart" && "bg-purple-500/5 border-purple-500/20",
                              note.type === "keypoints" && "bg-green-500/5 border-green-500/20"
                            )}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-medium text-sm">{note.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {note.type}
                              </Badge>
                            </div>
                            <div className={cn(
                              "space-y-2",
                              note.type === "flowchart" && "font-mono text-sm"
                            )}>
                              {note.content.map((line, idx) => (
                                <div 
                                  key={idx}
                                  className={cn(
                                    "text-sm",
                                    note.type === "flowchart" && line.startsWith(" ->") && "pl-4 text-muted-foreground",
                                    note.type === "keypoints" && "flex items-start gap-2"
                                  )}
                                >
                                  {note.type === "keypoints" && (
                                    <ChevronRight className="h-4 w-4 shrink-0 mt-0.5 text-success" />
                                  )}
                                  {line}
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Download className="h-3 w-3 mr-1" />
                                Export
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No notes generated yet</p>
                          <p className="text-xs mt-1">Use the panel on the left to generate notes</p>
                        </div>
                      )}
                      
                      {/* Show all notes if no document selected */}
                      {selectedDoc && selectedDoc.notes && selectedDoc.notes.length > 0 && (
                        <div className="p-4 rounded-lg bg-secondary/50 border">
                          <h3 className="font-medium text-sm mb-3">Original Document Notes</h3>
                          <ul className="space-y-2">
                            {selectedDoc.notes.map((note, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <ChevronRight className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                                {note}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Select a document</p>
                      <p className="text-xs mt-1">Click on a document to view its notes</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Chat */}
          <Card className="flex flex-col h-full">
            <CardHeader className="pb-2 shrink-0">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Ask Doubts
              </CardTitle>
              <CardDescription>
                Chat with AI about your study materials
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
              {/* Messages */}
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map(message => (
                    <div 
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.role === "user" && "flex-row-reverse"
                      )}
                    >
                      <div className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        message.role === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-secondary"
                      )}>
                        {message.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div className={cn(
                        "flex-1 rounded-lg p-3 text-sm",
                        message.role === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-secondary"
                      )}>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-secondary rounded-lg p-3">
                        <div className="flex gap-1">
                          <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>
              
              {/* Input */}
              <div className="flex gap-2 mt-4 shrink-0">
                <Input 
                  placeholder="Ask about your study materials..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button 
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
