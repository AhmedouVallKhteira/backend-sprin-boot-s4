import Navbar from "../components/Navbar";

function LayoutUser({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

export default LayoutUser;