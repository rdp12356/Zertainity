import { useState } from "react";
import { PageSEO } from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Circle, Clock, MoreHorizontal, Plus, GripVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Standard Kanban Types
type TaskStatus = "todo" | "in-progress" | "done";

interface Task {
    id: string;
    content: string;
    status: TaskStatus;
}

// Initial Mock Data representing a generated Career Roadmap
const INITIAL_TASKS: Task[] = [
    { id: "t1", content: "Enroll in a Basic Python Crash Course", status: "todo" },
    { id: "t2", content: "Complete 10 LeetCode Easy Logic Puzzles", status: "todo" },
    { id: "t3", content: "Build a Text-Based Adventure Game", status: "todo" },
    { id: "t4", content: "Research B.Tech CS Curriculums", status: "in-progress" },
    { id: "t5", content: "Setup VS Code Environment", status: "done" },
    { id: "t6", content: "Create GitHub Account", status: "done" },
];

const CareerKanban = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    
    // Simple Drag and Drop State
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

    // --- Drag and Drop Handlers ---
    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedTaskId(id);
        // Necessary for Firefox
        e.dataTransfer.setData("text/plain", id);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        // Prevent default to allow drop
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
        e.preventDefault();
        
        if (!draggedTaskId) return;

        // Update the task's status
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task.id === draggedTaskId ? { ...task, status: targetStatus } : task
            )
        );
        
        setDraggedTaskId(null);
    };

    // --- Helpers ---
    const getTasksByStatus = (status: TaskStatus) => {
        return tasks.filter(t => t.status === status);
    };

    const addTask = (status: TaskStatus) => {
        const newTask: Task = {
            id: `t${Date.now()}`,
            content: "New Roadmap Goal...",
            status: status
        };
        setTasks(prev => [...prev, newTask]);
    };

    // Render a single lane
    const renderCol = (title: string, status: TaskStatus) => {
        const columnTasks = getTasksByStatus(status);
        
        let headerIcon;
        let headerColor;
        let bgColor;

        if (status === "todo") {
            headerIcon = <Circle className="h-4 w-4" />;
            headerColor = "text-foreground";
            bgColor = "bg-background";
        } else if (status === "in-progress") {
            headerIcon = <Clock className="h-4 w-4" />;
            headerColor = "text-primary tracking-wide";
            bgColor = "bg-card";
        } else {
            headerIcon = <CheckCircle2 className="h-4 w-4" />;
            headerColor = "text-emerald-700 dark:text-emerald-400";
            bgColor = "bg-muted/10";
        }

        return (
            <div 
                className={`flex-1 min-w-[320px] flex flex-col border border-border ${bgColor} p-6`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
            >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                    <div className={`flex items-center gap-3 font-serif font-bold text-lg ${headerColor}`}>
                        {headerIcon}
                        <span>{title}</span>
                        <span className="ml-2 bg-foreground text-background font-sans font-medium text-xs px-2 py-0.5">
                            {columnTasks.length}
                        </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-none">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>

                {/* Task List */}
                <div className="flex-1 flex flex-col gap-4 min-h-[150px]">
                    {columnTasks.map(task => (
                        <div 
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onDragEnd={() => setDraggedTaskId(null)}
                            className={`
                                group bg-background border border-border p-5 cursor-grab active:cursor-grabbing hover:border-foreground transition-colors
                                ${draggedTaskId === task.id ? 'opacity-50 ring-2 ring-primary ring-offset-2' : 'opacity-100'}
                            `}
                        >
                            <div className="flex gap-3 items-start">
                                <GripVertical className="h-5 w-5 mt-0.5 text-muted-foreground/30 group-hover:text-foreground shrink-0 cursor-grab transition-colors" />
                                <p className="text-sm font-sans font-medium leading-relaxed">{task.content}</p>
                            </div>
                        </div>
                    ))}
                    
                    {/* Add Button */}
                    <button 
                        onClick={() => addTask(status)}
                        className="mt-2 flex items-center justify-center gap-2 py-4 border border-dashed border-border text-sm font-sans font-medium text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-muted/10 transition-colors w-full"
                    >
                        <Plus className="h-4 w-4" /> Add Goal
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <PageSEO
                title="Interactive Career Roadmap"
                description="Manage and track your personalized career roadmap steps."
                canonical="/career-kanban"
            />

            <header className="border-b border-border bg-background sticky top-0 z-10">
                <div className="container mx-auto px-4 py-8 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-none hover:bg-muted">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
                                Software Engineer Roadmap
                            </h1>
                            <p className="text-xs font-sans tracking-widest uppercase text-muted-foreground mt-2">Drag and drop nodes to track your progress</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Kanban Board Area */}
            <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                <div className="flex h-full gap-6 items-stretch w-max pb-8">
                    {renderCol("To Do", "todo")}
                    {renderCol("In Progress", "in-progress")}
                    {renderCol("Completed", "done")}
                </div>
            </main>
        </div>
    );
};

export default CareerKanban;
