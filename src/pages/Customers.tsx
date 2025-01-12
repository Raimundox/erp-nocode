import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const customers = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "(11) 99999-9999", orders: 5 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "(11) 88888-8888", orders: 3 },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "(11) 77777-7777", orders: 8 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Orders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.orders}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Customers;