import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
};

export default MainLayout;