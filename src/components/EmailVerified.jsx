import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

const EmailVerified = () => {
  const [message, setMessage] = useState("Verifying your email...");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session && session.user?.email_confirmed_at) {
        setMessage("✅ Email verification successful! You can now sign in.");
      } else {
        setMessage("⚠️ Email verification failed or already verified.");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default EmailVerified;