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
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        "Unnamed";

      const regNumber = email.split("@")[0];
      const userId = user.id;

      console.log("OAuth user:", user);

      // Don't decide role here — let your DB (and AuthContext) handle it

      // Insert or update into 'profiles' table (optional)
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
        console.log("✅ Profile inserted/updated.");
      }

      // ✅ Now redirect to `/`, where RoleBasedRedirect takes over
      window.location.replace("/");
    };

    validateAndRedirect();
  }, []);

  return <p>Verifying Google account...</p>;
};

export default OAuthCallback;