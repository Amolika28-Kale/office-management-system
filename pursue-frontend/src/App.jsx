import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import ProtectedRoute from "./admin/routes/ProtectedRoute";

/* ADMIN */
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/Dashboard";
import Users from "./admin/pages/Users";
import AddUser from "./admin/pages/AddUser";
import EditUser from "./admin/pages/EditUser";
import Spaces from "./admin/pages/Spaces";
import AddSpace from "./admin/pages/AddSpace";
import EditSpace from "./admin/pages/EditSpace";
import Bookings from "./admin/pages/Bookings";
import CreateBooking from "./admin/pages/CreateBooking";
import BookingDetails from "./admin/pages/BookingDetails";
import Leads from "./admin/pages/Lead";
import InventoryList from "./admin/pages/InventoryList";
import AddInventory from "./admin/pages/AddInventory";
import EditInventory from "./admin/pages/UpdateInventory";

/* USER */
import UserDashboard from "./user/pages/UserDashboard";
import UserLayout from "./user/components/UserLayout";
import MyBookings from "./user/pages/MyBooking";
import Payments from "./user/pages/Payments";
import Invoices from "./user/pages/Invoices";
import UserSettings from "./user/pages/UserSettings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* AUTH */}
        <Route path="/login" element={<Auth />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Users */}
          <Route path="users" element={<Users />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/edit/:id" element={<EditUser />} />

          {/* Spaces */}
          <Route path="spaces" element={<Spaces />} />
          <Route path="spaces/add" element={<AddSpace />} />
          <Route path="spaces/edit/:id" element={<EditSpace />} />

          {/* Bookings */}
          <Route path="bookings" element={<Bookings />} />
          <Route path="bookings/add" element={<CreateBooking />} />
          <Route path="bookings/:id" element={<BookingDetails />} />

          {/* CRM */}
          <Route path="crm" element={<Leads />} />

          {/* Inventory */}
          <Route path="inventory" element={<InventoryList />} />
          <Route path="inventory/add" element={<AddInventory />} />
          <Route path="inventory/edit/:id" element={<EditInventory />} />
        </Route>

        {/* ================= USER ================= */}
       <Route
  path="/user"
  element={
    <ProtectedRoute role="user">
      <UserLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<UserDashboard />} />
  <Route path="/user/bookings" element={<MyBookings />} />
<Route path="/user/payments" element={<Payments />} />
<Route path="/user/invoices" element={<Invoices />} />
<Route path="/user/settings" element={<UserSettings />} />

</Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
