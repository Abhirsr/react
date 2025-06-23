import React, { useEffect } from "react";
import supabase from "../supabaseClient";

const OAuthCallback = () => {
  useEffect(() => {
    const validateAndRedirect = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        alert("Authentication failed.");
        window.location.replace("/signin");
        return;
      }

      const user = session.user;
      const email = user.email;
      const name =
        user.user_metadata.full_name || user.user_metadata.name || "Unnamed";
      const regNumber = email.split("@")[0];

      const storedRole = localStorage.getItem("login_role");
      const isStaff = storedRole === "staff";

      const { error: insertError } = await supabase.from("profiles").upsert(
        [
          {
            id: user.id,
            email,
            name,
            reg_number: regNumber,
            role: isStaff ? "staff" : "student",
          },
        ],
        { onConflict: ["id"] }
      );

      if (insertError) {
        console.error("Failed to insert profile:", insertError);
      }

      localStorage.removeItem("login_role"); // Clear stored role after redirect
      window.location.replace(isStaff ? "/staff-dashboard" : "/dashboard");
    };

    validateAndRedirect();
  }, []);

  return <p>Verifying Google account...</p>;
};

export default OAuthCallback;