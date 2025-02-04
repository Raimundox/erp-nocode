import { useState } from "react";
import { Search, ChevronUp, ChevronDown, Filter, Plus, MoreVertical, Edit, Trash } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";

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

interface Column {
  key: string;
  label: string;
  isCustom?: boolean;
}

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: null, direction: null });
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: "John Doe", email: "john@example.com", phone: "(11) 99999-9999", category: "VIP", orders: 5 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "(11) 88888-8888", category: "Regular", orders: 3 },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "(11) 77777-7777", category: "Premium", orders: 8 },
  ]);

  const [columns, setColumns] = useState<Column[]>([
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'category', label: 'Category' },
    { key: 'orders', label: 'Orders' },
  ]);

  const handleAddColumn = () => {
    const columnName = prompt("Digite o nome da nova coluna:");
    if (columnName) {
      const newColumnKey = columnName.toLowerCase().replace(/\s+/g, '_');
      setColumns([...columns, { key: newColumnKey, label: columnName, isCustom: true }]);
      toast({
        title: "Coluna adicionada",
        description: `A coluna "${columnName}" foi adicionada com sucesso.`,
      });
    }
  };

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

  const handleColumnFilter = (column: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value,
    }));
  };

  const handleDeleteCustomer = (id: number) => {
    setCustomers(customers.filter(customer => customer.id !== id));
    toast({
      title: "Cliente excluído",
      description: "O cliente foi excluído com sucesso.",
    });
  };

  const handleEditCustomer = (id: number) => {
    toast({
      title: "Editar cliente",
      description: "Funcionalidade de edição será implementada em breve.",
    });
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    
    const matchesCategory = categoryFilter === "all" || customer.category === categoryFilter;
    const matchesOrders = orderFilter === "all" || 
      (orderFilter === "high" ? customer.orders > 5 : customer.orders <= 5);

    const matchesColumnFilters = Object.entries(columnFilters).every(([column, filterValue]) => {
      if (!filterValue) return true;
      const value = column in customer ? customer[column as keyof Customer] : customer.customFields?.[column];
      return value?.toString().toLowerCase().includes(filterValue.toLowerCase());
    });

    return matchesSearch && matchesCategory && matchesOrders && matchesColumnFilters;
  }).sort((a, b) => {
    if (!sortConfig.column || !sortConfig.direction) return 0;
    
    const aValue = sortConfig.column in a ? a[sortConfig.column] : a.customFields?.[sortConfig.column];
    const bValue = sortConfig.column in b ? b[sortConfig.column] : b.customFields?.[sortConfig.column];
    
    if (sortConfig.direction === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
    }
  });

  const uniqueCategories = Array.from(new Set(customers.map(c => c.category)));

  const renderColumnHeader = (column: Column) => (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 data-[state=open]:bg-accent">
            <span>{column.label}</span>
            {sortConfig.column === column.key && (
              sortConfig.direction === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
            )}
            <Filter className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleSort(column.key as keyof Customer)}>
            Ordenar Crescente
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort(column.key as keyof Customer)}>
            Ordenar Decrescente
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="p-2">
            {column.key === 'category' ? (
              <Select
                value={columnFilters[column.key] || 'all'}
                onValueChange={(value) => handleColumnFilter(column.key, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todas Categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                placeholder={`Filtrar ${column.label}...`}
                value={columnFilters[column.key] || ''}
                onChange={(e) => handleColumnFilter(column.key, e.target.value)}
                className="h-8"
              />
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <AddCustomerDialog onAddCustomer={handleAddCustomer} />
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={orderFilter} onValueChange={setOrderFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por Pedidos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Pedidos</SelectItem>
                <SelectItem value="high">Alto Volume ({'>'}5)</SelectItem>
                <SelectItem value="low">Baixo Volume (≤5)</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddColumn} variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{renderColumnHeader(column)}</TableHead>
              ))}
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                {columns.map((column) => (
                  <TableCell key={`${customer.id}-${column.key}`}>
                    {column.isCustom 
                      ? (customer.customFields?.[column.key] || '-')
                      : String(customer[column.key as keyof Customer])}
                  </TableCell>
                ))}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditCustomer(customer.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteCustomer(customer.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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