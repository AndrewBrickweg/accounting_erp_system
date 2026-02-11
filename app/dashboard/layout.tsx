import Navbar from "./components/navbar";
// import Sidebar from "./components/Sidebar";
import Footer from "./components/footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-grey-50">
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
