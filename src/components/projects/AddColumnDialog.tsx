import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { type Column } from "@/pages/Projects";

interface AddColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddColumn: (column: Omit<Column, 'id'>) => void;
}

const AddColumnDialog = ({ open, onOpenChange, onAddColumn }: AddColumnDialogProps) => {
  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState<Column['type']>("text");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddColumn({
      name: columnName,
      type: columnType,
    });
    setColumnName("");
    setColumnType("text");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Column Name</Label>
            <Input
              id="name"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              placeholder="Enter column name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Column Type</Label>
            <Select value={columnType} onValueChange={(value) => setColumnType(value as Column['type'])}>
              <SelectTrigger>
                <SelectValue placeholder="Select column type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="select">Select</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Add Column</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddColumnDialog;