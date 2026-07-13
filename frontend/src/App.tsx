import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/Home/HomePage';
import AboutPage from './pages/About/AboutPage';
import ExplorePage from './pages/Category/ExplorePage';
import BookDetailPage from './pages/BookDetails/BookDetailPage';
import RecommendationsPage from './pages/Recommendations/RecommendationsPage';
import LibraryPage from './pages/Library/LibraryPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import ProfilePage from './pages/Profile/ProfilePage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { ToastProvider } from './context/ToastContext';
import { LibraryProvider } from './context/LibraryContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminBooksPage from './pages/Admin/AdminBooksPage';
import AdminUsersPage from './pages/Admin/AdminUsersPage';
import AdminSettingsPage from './pages/Admin/AdminSettingsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ToastProvider>
        <ThemeProvider>
          <AuthProvider>
            <LibraryProvider>
              <MainLayout />
            </LibraryProvider>
          </AuthProvider>
        </ThemeProvider>
      </ToastProvider>
    ),
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/explore',
        element: <ExplorePage />,
      },
      {
        path: '/book/:isbn',
        element: <BookDetailPage />,
      },
      {
        path: '/recommendations',
        element: <RecommendationsPage />,
      },
      {
        path: '/library',
        element: <LibraryPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '',
        element: <ProtectedRoute />,
        children: [
          {
            path: 'profile',
            element: <ProfilePage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ToastProvider>
        <ThemeProvider>
          <AuthProvider>
            <LibraryProvider>
              <ProtectedRoute />
            </LibraryProvider>
          </AuthProvider>
        </ThemeProvider>
      </ToastProvider>
    ),
    children: [
      {
        path: '',
        element: <AdminRoute />,
        children: [
          {
            path: '',
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboardPage /> },
              { path: 'books', element: <AdminBooksPage /> },
              { path: 'users', element: <AdminUsersPage /> },
              { path: 'settings', element: <AdminSettingsPage /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
