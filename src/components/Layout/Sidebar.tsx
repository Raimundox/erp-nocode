import { Home, Package, Users, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: Users, label: "Customers", path: "/customers" },
    { icon: ShoppingBag, label: "Catalog", path: "/catalog" },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-erp-blue">ERP System</h1>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-erp-lightGray transition-colors ${
                isActive ? "bg-erp-lightGray text-erp-blue" : ""
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;