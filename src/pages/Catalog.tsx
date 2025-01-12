import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "Product 1",
    price: "R$ 99,99",
    image: "https://via.placeholder.com/200",
    description: "A great product description goes here.",
  },
  {
    id: 2,
    name: "Product 2",
    price: "R$ 149,99",
    image: "https://via.placeholder.com/200",
    description: "Another amazing product description.",
  },
  {
    id: 3,
    name: "Product 3",
    price: "R$ 199,99",
    image: "https://via.placeholder.com/200",
    description: "Yet another fantastic product description.",
  },
];

const Catalog = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-erp-blue">{product.price}</span>
                <Button variant="outline">View Details</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Catalog;