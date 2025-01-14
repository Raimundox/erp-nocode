import { useState } from "react";
import { Search, ChevronUp, ChevronDown, Filter } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  category: string;
  orders: number;
  customFields?: { [key: string]: string };
}

type SortDirection = 'asc' | 'desc' | null;
type SortConfig = {
  column: keyof Customer | null;
  direction: SortDirection;
};

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: null, direction: null });
  const [columnFilters, setColumnFilters] = useState<{ [key in keyof Partial<Customer>]: string }>({});
  
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: "John Doe", email: "john@example.com", phone: "(11) 99999-9999", category: "VIP", orders: 5 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "(11) 88888-8888", category: "Regular", orders: 3 },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "(11) 77777-7777", category: "Premium", orders: 8 },
  ]);

  const handleAddCustomer = (newCustomer: Omit<Customer, "id" | "orders">) => {
    const customerToAdd: Customer = {
      ...newCustomer,
      id: customers.length + 1,
      orders: 0,
    };
    setCustomers([...customers, customerToAdd]);
  };

  const handleSort = (column: keyof Customer) => {
    let direction: SortDirection = 'asc';
    
    if (sortConfig.column === column) {
      if (sortConfig.direction === 'asc') direction = 'desc';
      else if (sortConfig.direction === 'desc') direction = null;
    }
    
    setSortConfig({ column, direction });
  };

  const handleColumnFilter = (column: keyof Customer, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value,
    }));
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    
    const matchesCategory = categoryFilter === "all" || customer.category === categoryFilter;
    const matchesOrders = orderFilter === "all" || 
      (orderFilter === "high" ? customer.orders > 5 : customer.orders <= 5);

    // Apply column filters
    const matchesColumnFilters = Object.entries(columnFilters).every(([column, filterValue]) => {
      if (!filterValue) return true;
      const value = customer[column as keyof Customer];
      return value?.toString().toLowerCase().includes(filterValue.toLowerCase());
    });

    return matchesSearch && matchesCategory && matchesOrders && matchesColumnFilters;
  }).sort((a, b) => {
    if (!sortConfig.column || !sortConfig.direction) return 0;
    
    const aValue = a[sortConfig.column];
    const bValue = b[sortConfig.column];
    
    if (sortConfig.direction === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
    }
  });

  const uniqueCategories = Array.from(new Set(customers.map(c => c.category)));

  const renderColumnHeader = (column: keyof Customer, label: string) => (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 data-[state=open]:bg-accent">
            <span>{label}</span>
            {sortConfig.column === column && (
              sortConfig.direction === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
            )}
            <Filter className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleSort(column)}>
            Sort Ascending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort(column)}>
            Sort Descending
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="p-2">
            <Input
              placeholder={`Filter ${label}...`}
              value={columnFilters[column] || ''}
              onChange={(e) => handleColumnFilter(column, e.target.value)}
              className="h-8"
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <AddCustomerDialog onAddCustomer={handleAddCustomer} />
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
                <SelectItem value="all">All Categories</SelectItem>
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
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="high">High Volume ({'>'}5)</SelectItem>
                <SelectItem value="low">Low Volume (≤5)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{renderColumnHeader('name', 'Name')}</TableHead>
              <TableHead>{renderColumnHeader('email', 'Email')}</TableHead>
              <TableHead>{renderColumnHeader('phone', 'Phone')}</TableHead>
              <TableHead>{renderColumnHeader('category', 'Category')}</TableHead>
              <TableHead>{renderColumnHeader('orders', 'Orders')}</TableHead>
              <TableHead>Custom Fields</TableHead>
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
                <TableCell>
                  {customer.customFields && Object.entries(customer.customFields).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Customers;