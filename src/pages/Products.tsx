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

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    { id: 1, name: "Product 1", price: "R$ 99,99", stock: 45, category: "Electronics" },
    { id: 2, name: "Product 2", price: "R$ 149,99", stock: 32, category: "Accessories" },
    { id: 3, name: "Product 3", price: "R$ 199,99", stock: 18, category: "Electronics" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
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
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Products;