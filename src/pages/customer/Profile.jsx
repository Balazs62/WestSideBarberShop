import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, LogOut, Calendar, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { authService } from "@/services/AuthService";
import { getDatabase } from "@/data/mockDatabase";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    setFormData({
      name: currentUser.name,
      phone: currentUser.phone || "",
    });

    // Load user's bookings
    const db = getDatabase();
    const userBookings = (db.bookings || []).filter(
      b => b.customerEmail === currentUser.email
    );
    setBookings(userBookings);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage(null);
    const result = await authService.updateProfile(formData);
    if (result.success) {
      setUser(result.user);
      setEditing(false);
      setMessage({ type: "success", text: "Profil sikeresen frissítve!" });
    } else {
      setMessage({ type: "error", text: result.error });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "A jelszavak nem egyeznek meg" });
      return;
    }

    const result = await authService.changePassword(
      passwordData.currentPassword,
      passwordData.newPassword
    );

    if (result.success) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setChangingPassword(false);
      setMessage({ type: "success", text: "Jelszó sikeresen megváltoztatva!" });
    } else {
      setMessage({ type: "error", text: result.error });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-bold text-foreground">Profil</h1>
              <p className="text-sm text-muted-foreground">WestSide Barbershop</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Kijelentkezés</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success" 
                ? "bg-green-50 border border-green-200 text-green-700" 
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          {/* Profile Information */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Személyes adatok</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Szerkesztés
                </button>
              )}
            </div>
            <div className="p-6">
              {editing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Teljes név
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Telefonszám
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                    >
                      Mentés
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({ name: user.name, phone: user.phone || "" });
                      }}
                      className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition"
                    >
                      Mégse
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Név</p>
                      <p className="text-foreground">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">E-mail</p>
                      <p className="text-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Telefonszám</p>
                      <p className="text-foreground">{user.phone || "Nincs megadva"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Jelszó módosítása</h2>
            </div>
            <div className="p-6">
              {changingPassword ? (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Jelenlegi jelszó
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Új jelszó
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Új jelszó megerősítése
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                    >
                      Jelszó módosítása
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setChangingPassword(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition"
                    >
                      Mégse
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setChangingPassword(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition"
                >
                  <Lock className="w-4 h-4" />
                  <span className="text-sm">Jelszó módosítása</span>
                </button>
              )}
            </div>
          </div>

          {/* Booking History */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Foglalásaim</h2>
            </div>
            {bookings.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">
                Még nincsenek foglalásaid.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {bookings.sort((a, b) => b.date?.localeCompare(a.date) || b.time?.localeCompare(a.time)).map((b) => (
                  <div key={b.id} className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors">
                    <div className="w-20 text-center">
                      <p className="text-sm font-bold text-primary">{b.date}</p>
                      <p className="text-xs text-muted-foreground">{b.time}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{b.serviceName}</p>
                      <p className="text-xs text-muted-foreground">{b.employeeName}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      b.status === "confirmed" 
                        ? "bg-green-500/10 text-green-500" 
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {b.status === "confirmed" ? "Visszaigazolva" : "Függőben"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
