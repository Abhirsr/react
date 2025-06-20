import supabase from "../supabaseClient";

// Allowed domain (customize this!)
const ALLOWED_DOMAIN = "@kanchiuniv.ac.in";

// Utility function to check domain
const isAllowedDomain = (email) => email.endsWith(ALLOWED_DOMAIN);

// Sign Up
export const signup = async ({ email, password, name, regNumber }) => {
  console.log("Signing up:", email, password, name, regNumber);

  if (!isAllowedDomain(email)) {
    const error = { message: `Only ${ALLOWED_DOMAIN} emails are allowed.` };
    alert(error.message);
    return { error };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/verify`, // <--- ✨ REDIRECT after confirmation
      data: {
        name,
        regNumber,
      },
    },
  });

  if (error) {
    alert(error.message);
    return { error };
  }

  alert("Confirmation email sent! Please verify your email before logging in.");
  return { data };
};

// Sign In
export const signin = async ({ email, password }) => {
  if (!isAllowedDomain(email)) {
    const error = { message: `Only ${ALLOWED_DOMAIN} emails are allowed.` };
    alert(error.message);
    return { error };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return { error };
  }

  // 🚫 BLOCK unverified email users
  if (!data.user.email_confirmed_at) {
    await supabase.auth.signOut(); // optional
    return {
      error: {
        message: "Please verify your email before logging in.",
      },
    };
  }

  return { data };
};
