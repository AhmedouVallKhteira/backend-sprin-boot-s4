import { Routes, Route } from "react-router-dom";
import LayoutUser from "../layouts/LayoutUser";
import LayoutAdmin from "../layouts/LayoutAdmin";
import Home from "../pages/Home";
import Dashboard from "../pages/dashbord/page";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ActivateAccountPage from "../pages/ActivationPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ProtectedRoute from "../components/ProtectedRoute";
import PageLivres from "../pages/PageLivres";
import AjouterLivrePage from "../pages/AjouterLivrePage";
import AuteursPage from "../pages/AuteursPage";
import AuteurDetailPage from "../pages/AuteurDetailPage";
import AjouterAuteur from "../pages/AjouterAuteur";
import EditAuteur from "../pages/EditAuteur";
import LivreDetailPage from "../pages/LivreDetailPage";
import EditLivrePage from "../pages/EditLivrePage";
import MesAchatsPage from "../pages/MesAchatsPage";
import UtilisateursPage from "../pages/UtilisateursPage";
import UserDetailPage from "../pages/UserDetailPage";
import FaireAchatPage from "../pages/FaireAchatPage";


function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <LayoutUser>
            <Home />
          </LayoutUser>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <LayoutAdmin>
              <Dashboard />
            </LayoutAdmin>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/livres"
        element={
          <ProtectedRoute>
            <LayoutAdmin>
              <PageLivres />
            </LayoutAdmin>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/livres/add"
        element={
          <ProtectedRoute>
            <LayoutAdmin>
              <AjouterLivrePage />
            </LayoutAdmin>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/auteurs"
        element={
          <ProtectedRoute>
            <LayoutAdmin>
              <AuteursPage />
            </LayoutAdmin>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/auteurs/:id"
        element={
          <ProtectedRoute>
            <LayoutAdmin>
              <AuteurDetailPage />
            </LayoutAdmin>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/auteurs/add"
        element={
          <ProtectedRoute>
            <LayoutAdmin>
              <AjouterAuteur />
            </LayoutAdmin>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/auteurs/edit/:id"
        element={
          <ProtectedRoute>
            <LayoutAdmin>
              <EditAuteur />
            </LayoutAdmin>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/livres/:id"
        element={
          <ProtectedRoute>
            <LayoutAdmin>
              <LivreDetailPage />
            </LayoutAdmin>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/livres/edit/:id"
        element={
          <ProtectedRoute>
            <LayoutAdmin>
              <EditLivrePage />
            </LayoutAdmin>
          </ProtectedRoute>
        }
      />
      <Route
        path="/livres"
        element={
            <LayoutUser>
              <PageLivres />
            </LayoutUser>
        }
      />
      <Route
        path="/livres/:id"
        element={
            <LayoutUser>
              <LivreDetailPage />
            </LayoutUser>
        }
      />
      <Route
        path="/auteurs"
        element={
            <LayoutUser>
              <AuteursPage />
            </LayoutUser>
        }
      />
      <Route
        path="/auteurs/:id"
        element={
            <LayoutUser>
              <AuteurDetailPage />
            </LayoutUser>
        }
      />
      <Route
        path="/mes-achats"
        element={
          <ProtectedRoute>
            <LayoutUser>
              <MesAchatsPage />
            </LayoutUser>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/users"
        element={
          <ProtectedRoute>
            <LayoutAdmin>
              <UtilisateursPage />
            </LayoutAdmin>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/users/:userID"
        element={
          <ProtectedRoute>
            <LayoutAdmin>
              <UserDetailPage />
            </LayoutAdmin>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/achats"
        element={
          <ProtectedRoute>
            <LayoutAdmin>
              <MesAchatsPage />
            </LayoutAdmin>
          </ProtectedRoute>
        }
      />
      <Route
        path="/buy/:id"
        element={
          <ProtectedRoute>
            <LayoutUser>
              <FaireAchatPage />
            </LayoutUser>
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/activate-account" element={<ActivateAccountPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
