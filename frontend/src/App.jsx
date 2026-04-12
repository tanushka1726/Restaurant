import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RestaurantList from './pages/RestaurantList';
import RestaurantDetail from './pages/RestaurantDetail';
import RestaurantForm from './components/RestaurantForm';
import SessionList from './pages/SessionList';
import SessionForm from './components/SessionForm';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<RestaurantList />} />
            <Route path="/restaurants/new" element={<RestaurantForm />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/restaurants/:id/edit" element={<RestaurantForm />} />
            <Route path="/sessions" element={<SessionList />} />
            <Route path="/sessions/new" element={<SessionForm />} />
            <Route path="/sessions/:id/edit" element={<SessionForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
