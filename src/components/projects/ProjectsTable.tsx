import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { type Project, type Column } from "@/pages/Projects";

interface ProjectsTableProps {
  projects: Project[];
  columns: Column[];
  onProjectUpdate: () => void;
}

const ProjectsTable = ({ projects, columns }: ProjectsTableProps) => {
  const getStatusColor = (status: Project['status']) => {
    const colors = {
      backlog: "bg-gray-500",
      in_progress: "bg-blue-500",
      paused: "bg-purple-500",
      canceled: "bg-red-500",
      completed: "bg-green-500"
    };
    return colors[status] || "bg-gray-500";
  };

  const getPriorityColor = (priority: Project['priority']) => {
    const colors = {
      low: "bg-green-500",
      medium: "bg-yellow-500",
      high: "bg-red-500"
    };
    return colors[priority] || "bg-gray-500";
  };

  const renderCellContent = (project: Project, column: Column) => {
    switch (column.type) {
      case 'progress':
        return <Progress value={project[column.name as keyof Project] as number} className="w-[100px]" />;
      case 'date':
        const date = project[column.name as keyof Project] as string;
        return date ? format(new Date(date), 'PP') : '-';
      case 'select':
        const value = project[column.name as keyof Project] as string;
        return (
          <Badge 
            className={`${column.name === 'status' ? getStatusColor(value as Project['status']) : 
                        column.name === 'priority' ? getPriorityColor(value as Project['priority']) : 
                        'bg-gray-500'}`}
          >
            {value}
          </Badge>
        );
      default:
        return project[column.name as keyof Project];
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.id}>{column.name}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            {columns.map((column) => (
              <TableCell key={`${project.id}-${column.id}`}>
                {renderCellContent(project, column)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProjectsTable;