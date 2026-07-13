import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollIndicator from '../components/ScrollIndicator';
import KineticCursor from '../components/KineticCursor';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: '#FDF8F0' }}>
      <ScrollIndicator />
      <KineticCursor />
      <Navbar />
      <main className="flex flex-grow flex-col pt-18">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
