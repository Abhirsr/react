import React, { useEffect } from "react";
import supabase from "../supabaseClient";

// ✅ Domain restriction
const ALLOWED_DOMAIN = "@kanchiuniv.ac.in";
const isAllowedDomain = (email) => email.endsWith(ALLOWED_DOMAIN);

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

      // ✅ Block if not @kanchiuniv.ac.in
      if (!isAllowedDomain(email)) {
        alert(`Only ${ALLOWED_DOMAIN} emails are allowed.`);
        await supabase.auth.signOut(); // Logout
        window.location.replace("/signin");
        return;
      }

      const name =
        user.user_metadata?.full_name || user.user_metadata?.name || "Unnamed";
      const regNumber = email.split("@")[0];
      const userId = user.id;

      console.log("OAuth user:", user);

      const { error: insertError } = await supabase.from("profiles").upsert(
        {
          id: userId,
          email,
          name,
          reg_number: regNumber,
        },
        { onConflict: ["id"] }
      );

      if (insertError) {
        console.error("❌ Failed to insert profile:", insertError);
      } else {
        console.log("✅ Profile inserted or updated");
      }

      const isStaff = localStorage.getItem("login_role") === "staff";
      localStorage.removeItem("login_role");

      window.location.replace(isStaff ? "/staff-dashboard" : "/dashboard");
    };

    validateAndRedirect();
  }, []);

  return <p>Verifying Google account...</p>;
};

export default OAuthCallback;