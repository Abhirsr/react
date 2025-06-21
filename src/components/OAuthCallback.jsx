import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const validateAndRedirect = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        alert("Authentication failed.");
        navigate("/signin", { replace: true });
        return;
      }

      const user = session.user;
      const email = user.email;
      const name =
        user.user_metadata.full_name || user.user_metadata.name || "Unnamed";

      const allowedDomain = "@kanchiuniv.ac.in";
      if (!email.endsWith(allowedDomain)) {
        alert(`Only ${allowedDomain} accounts are allowed.`);
        await supabase.auth.signOut();
        navigate("/signin", { replace: true });
        return;
      }

      // Auto-extract registration number from email prefix
      const regNumber = email.split("@")[0];

      // Upsert user info into the students table
      const { error: insertError } = await supabase.from("profiles").upsert(
        [
          {
            id: user.id, // must match auth.users.id due to FK
            email,
            name,
            reg_number: regNumber,
          },
        ],
        { onConflict: ["id"] }
      );

      if (insertError) {
        console.error("Failed to insert student:", insertError);
      }

      // ✅ Authenticated and data synced
      navigate("/dashboard", { replace: true });
    };

    validateAndRedirect();
  }, [navigate]);

  return <p>Verifying Google account...</p>;
};

export default OAuthCallback;
