import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { Customer } from "@/pages/Customers";
import { useToast } from "@/components/ui/use-toast";

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
  const [customFields, setCustomFields] = useState<string[]>([]);
  const { toast } = useToast();

  const onSubmit = (data: CustomerFormData) => {
    onAddCustomer({
      name: data.name,
      email: data.email,
      phone: data.phone,
      category: data.category,
      customFields: data.customFields,
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
    setCustomFields([...customFields, ""]);
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
            
            {customFields.map((_, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`customFields.field${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Field {index + 1}</FormLabel>
                    <FormControl>
                      <Input placeholder="Custom field value" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
            
            <Button type="button" variant="outline" onClick={addCustomField} className="w-full">
              Add Custom Field
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