import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      const authUser = session?.user;
      console.log("🟢 Fetched session:", session);

      if (!authUser) {
        console.warn("⚠️ No user session found.");
        return;
      }

      setUser(authUser);
      console.log("✅ Authenticated user:", authUser.email);

      try {
        const { data: userData, error: userError } = await supabase
          .from("users") // ✅ Your custom user table
          .select("role")
          .eq("email", authUser.email)
          .maybeSingle();

        if (userError) {
          console.error("❌ Failed to fetch user role from DB:", userError.message);
          setRole("student"); // Default fallback role
        } else {
          console.log("📌 User role from DB:", userData?.role);
          setRole(userData.role || "student");
        }
      } catch (err) {
        console.error("❌ Unexpected error fetching user role:", err);
        setRole("student");
      }
    };

    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);