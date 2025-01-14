import { useState, useEffect } from "react";
import { Plus, Filter, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ProjectsTable from "@/components/projects/ProjectsTable";
import AddColumnDialog from "@/components/projects/AddColumnDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'backlog' | 'in_progress' | 'paused' | 'canceled' | 'completed';
  priority: 'low' | 'medium' | 'high';
  completion: number;
  due_date: string;
  owner: string;
}

export interface Column {
  id: string;
  name: string;
  type: 'text' | 'select' | 'date' | 'number' | 'progress';
  options?: string[];
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
    fetchColumns();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      toast({
        title: "Error fetching projects",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const fetchColumns = async () => {
    try {
      const { data, error } = await supabase
        .from('project_columns')
        .select('*');
      
      if (error) throw error;
      setColumns(data || []);
    } catch (error) {
      toast({
        title: "Error fetching columns",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleAddColumn = async (newColumn: Omit<Column, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('project_columns')
        .insert([newColumn])
        .select()
        .single();

      if (error) throw error;

      setColumns([...columns, data]);
      toast({
        title: "Column added",
        description: "The new column has been added successfully",
      });
    } catch (error) {
      toast({
        title: "Error adding column",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAddColumnOpen(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Customize
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <ProjectsTable 
          projects={projects}
          columns={columns}
          onProjectUpdate={fetchProjects}
        />
      </Card>

      <AddColumnDialog
        open={isAddColumnOpen}
        onOpenChange={setIsAddColumnOpen}
        onAddColumn={handleAddColumn}
      />
    </div>
  );
};

export default Projects;