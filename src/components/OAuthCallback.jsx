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

      const allowedDomain = "@kanchiuniv.ac.in";
      if (!email.endsWith(allowedDomain)) {
        alert(`Only ${allowedDomain} accounts are allowed.`);
        await supabase.auth.signOut();
        navigate("/signin", { replace: true });
        return;
      }

      // ✅ Successfully authenticated & domain is allowed
      navigate("/dashboard", { replace: true });
    };

    validateAndRedirect();
  }, [navigate]);

  return <p>Verifying Google account...</p>;
};

export default OAuthCallback;