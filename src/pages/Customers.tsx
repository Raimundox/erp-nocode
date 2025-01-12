import { useState } from "react";
import { Search } from "lucide-react";
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
import { AddCustomerDialog } from "@/components/customers/AddCustomerDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  category: string;
  orders: number;
}

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [orderFilter, setOrderFilter] = useState<string>("");

  const customers: Customer[] = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "(11) 99999-9999", category: "VIP", orders: 5 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "(11) 88888-8888", category: "Regular", orders: 3 },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "(11) 77777-7777", category: "Premium", orders: 8 },
  ];

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    
    const matchesCategory = !categoryFilter || customer.category === categoryFilter;
    const matchesOrders = !orderFilter || 
      (orderFilter === "high" ? customer.orders > 5 : customer.orders <= 5);

    return matchesSearch && matchesCategory && matchesOrders;
  });

  const uniqueCategories = Array.from(new Set(customers.map(c => c.category)));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <AddCustomerDialog />
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={orderFilter} onValueChange={setOrderFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Orders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Orders</SelectItem>
                <SelectItem value="high">High Volume ({'>'}5)</SelectItem>
                <SelectItem value="low">Low Volume (≤5)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Orders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.category}</TableCell>
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