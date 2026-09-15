import { BrowserRouter, Routes, Route, Navigate, replace } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CaseListPage from './pages/CaseListPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import CaseDetailPage from './pages/CaseDetailPage';
import CaseCreatePage from './pages/CaseCreatePage';
import CaseUpdatePage from './pages/CaseUpdatePage';
import AdminUserCreatePage from './pages/AdminUserCreatePage';
import AdminUserListPage from './pages/AdminUserListPage';
import { useAuth } from './context/AuthContext';
function App() {
  const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/cases"
            element={
              <ProtectedRoute>
                <CaseListPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to={ isAuthenticated ? '/cases': 'login'} replace/>} />
          <Route
            path="/cases/:caseNum"
            element={
              <ProtectedRoute>
                <CaseDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cases/new"
            element={
              <ProtectedRoute>
                <CaseCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cases/:caseNum/edit"
            element={
              <ProtectedRoute>
                <CaseUpdatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminUserListPage />
              </ProtectedRoute>
            }
          />
          <Route path = "/admin/users/create" 
           element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminUserCreatePage />
              </ProtectedRoute>}
         />
        </Routes>
      </div>
      
    </BrowserRouter>
  );
}

export default App;
