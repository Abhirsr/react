import supabase from "../supabaseClient";

// Sign Up
export const signup = async ({ email, password, name, regNumber }) => {
  console.log("Signing up:", email, password, name, regNumber);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        regNumber
      }
    }
  });

  if (error) {
    alert(error.message);
    return { error };
  }

  return { data };
};

// Sign In
export const signin = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return { error };
  }

  return { data };
};