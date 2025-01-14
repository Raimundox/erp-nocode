import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { Customer } from "@/pages/Customers";
import { useToast } from "@/components/ui/use-toast";

interface CustomField {
  name: string;
  value: string;
}

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  category: string;
  customFields: { [key: string]: string };
}

interface AddCustomerDialogProps {
  onAddCustomer: (customer: Omit<Customer, "id" | "orders">) => void;
}

export function AddCustomerDialog({ onAddCustomer }: AddCustomerDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<CustomerFormData>();
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const { toast } = useToast();

  const onSubmit = (data: CustomerFormData) => {
    const customFieldsObject = customFields.reduce((acc, field) => {
      const fieldValue = form.getValues(`customFields.${field.name}`);
      if (fieldValue) {
        acc[field.name] = fieldValue;
      }
      return acc;
    }, {} as { [key: string]: string });

    onAddCustomer({
      name: data.name,
      email: data.email,
      phone: data.phone,
      category: data.category,
      customFields: customFieldsObject,
    });
    
    toast({
      title: "Success",
      description: "Customer added successfully",
    });
    
    setOpen(false);
    form.reset();
    setCustomFields([]);
  };

  const addCustomField = () => {
    const fieldName = prompt("Enter the name for the new column (e.g., 'status'):");
    if (fieldName) {
      setCustomFields([...customFields, { name: fieldName, value: "" }]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Customer name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email address" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Customer category" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {customFields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={`customFields.${field.name}`}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{field.name}</FormLabel>
                    <FormControl>
                      <Input placeholder={`Enter ${field.name}`} {...formField} />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
            
            <Button type="button" variant="outline" onClick={addCustomField} className="w-full">
              Add Custom Column
            </Button>
            
            <Button type="submit" className="w-full">
              Save Customer
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}