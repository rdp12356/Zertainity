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
            headerColor = "text-slate-500";
            bgColor = "bg-slate-100/50 dark:bg-slate-900/50";
        } else if (status === "in-progress") {
            headerIcon = <Clock className="h-4 w-4" />;
            headerColor = "text-amber-500";
            bgColor = "bg-amber-100/30 dark:bg-amber-900/10";
        } else {
            headerIcon = <CheckCircle2 className="h-4 w-4" />;
            headerColor = "text-emerald-500";
            bgColor = "bg-emerald-100/30 dark:bg-emerald-900/10";
        }

        return (
            <div 
                className={`flex-1 min-w-[300px] flex flex-col rounded-2xl border border-border/50 ${bgColor} p-4 transition-colors`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
            >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 px-2">
                    <div className={`flex items-center gap-2 font-bold ${headerColor}`}>
                        {headerIcon}
                        <span>{title}</span>
                        <span className="ml-2 bg-background text-foreground text-xs px-2 py-0.5 rounded-full shadow-sm border border-border/50">
                            {columnTasks.length}
                        </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>

                {/* Task List */}
                <div className="flex-1 flex flex-col gap-3 min-h-[150px]">
                    {columnTasks.map(task => (
                        <div 
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onDragEnd={() => setDraggedTaskId(null)}
                            className={`
                                group bg-card border border-border/60 shadow-sm rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-primary/40 hover:shadow-md transition-all
                                ${draggedTaskId === task.id ? 'opacity-50 scale-95' : 'opacity-100'}
                            `}
                        >
                            <div className="flex gap-3">
                                <GripVertical className="h-5 w-5 text-muted-foreground/30 group-hover:text-muted-foreground/70 shrink-0 cursor-grab" />
                                <p className="text-sm font-medium leading-tight">{task.content}</p>
                            </div>
                        </div>
                    ))}
                    
                    {/* Add Button */}
                    <button 
                        onClick={() => addTask(status)}
                        className="mt-2 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border/60 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors w-full"
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

            <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm flex-shrink-0">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold leading-none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                Software Engineer Roadmap
                            </h1>
                            <p className="text-xs text-muted-foreground mt-1">Drag and drop nodes to track your progress.</p>
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
