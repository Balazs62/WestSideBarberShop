import React, { useState, useEffect } from "react";
import { Menu, X, Phone, LogIn, LogOut, Settings, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const navLinks = [
  { label: "Főoldal", path: "/" },
  { label: "Szolgáltatások", path: "/services" },
  { label: "Foglalás", path: "/booking" },
  { label: "Rólunk", path: "/about" },
  { label: "Galéria", path: "/gallery" },
  { label: "Kapcsolat", path: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Mock user check - set to null (not authenticated)
    setUser(null);
    setUserLoading(false);
  }, []);

  const handleLogout = () => {
    // Mock logout
    window.location.href = "/";
  };

  const isHome = location.pathname === "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? "bg-background/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-lg sm:text-xl font-bold text-primary tracking-wide">
              WESTSIDE
            </span>
            <span className="hidden sm:inline text-xs text-muted-foreground tracking-widest uppercase">
              Barbershop
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-body tracking-wide transition-colors duration-300 relative group ${
                    active ? "text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:+36303885043"
              className="hidden md:flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline font-body">+36 30 388 5043</span>
            </a>

            {!userLoading && (
              user ? (
                <div className="hidden sm:flex items-center gap-2">
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-body font-medium text-primary border border-primary/30 rounded-sm hover:bg-primary/10 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-body font-medium text-muted-foreground border border-border rounded-sm hover:text-foreground transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Kilépés
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-body font-medium text-muted-foreground border border-border rounded-sm hover:text-primary hover:border-primary/30 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Bejelentkezés
                </Link>
              )
            )}

            <button 
              onClick={() => setOpen(!open)} 
              className="lg:hidden p-3 text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/98 backdrop-blur-md border-t border-border overflow-hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`block py-4 px-4 text-base font-body rounded-md transition-colors min-h-[48px] flex items-center ${
                      active ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <a 
                href="tel:+36303885043" 
                className="flex items-center gap-2 py-4 px-4 text-primary font-body min-h-[48px]"
              >
                <Phone className="w-5 h-5" />+36 30 388 5043
              </a>
              <div className="pt-2 border-t border-border mt-2">
                {user ? (
                  <>
                    {user.role === "admin" && (
                      <Link 
                        to="/admin" 
                        onClick={() => setOpen(false)} 
                        className="flex items-center gap-2 py-4 px-4 text-primary font-body text-sm min-h-[48px]"
                      >
                        <Settings className="w-5 h-5" />Admin felület
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center gap-2 py-4 px-4 text-muted-foreground font-body text-sm w-full text-left min-h-[48px]"
                    >
                      <LogOut className="w-5 h-5" />Kilépés
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    onClick={() => setOpen(false)} 
                    className="flex items-center gap-2 py-4 px-4 text-muted-foreground font-body text-sm min-h-[48px]"
                  >
                    <LogIn className="w-5 h-5" />Bejelentkezés
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}