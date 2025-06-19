import supabase from "../supabaseClient";

export const uploadProofFile = async (file) => {
  const fileName = `${Date.now()}_${file.name}`; // ✅ Template literal fixed

  const { data, error } = await supabase.storage
    .from("uploadodproofletter") // ✅ Correct bucket name
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error(
      "Upload Error:",
      error.message || error.error_description || error
    );
    return { error };
  }

  const { data: publicData, error: publicError } = supabase.storage
    .from("uploadodproofletter")
    .getPublicUrl(fileName);

  if (publicError) {
    console.error("Public URL Error:", publicError);
    return { error: publicError };
  }

  return { publicUrl: publicData.publicUrl };
};
