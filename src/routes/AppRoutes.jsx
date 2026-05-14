import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ClassesPage from "../pages/ClassesPage";
import DashBoard from "../pages/DashBoard";
import StudentsPage from "../pages/StudentsPage";
import TeachersPage from "../pages/TeachersPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashBoard />} />
        <Route path="/ogrenciler" element={<StudentsPage />} />
        <Route path="/ogretmenler" element={<TeachersPage />} />
        <Route path="/siniflar" element={<ClassesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
