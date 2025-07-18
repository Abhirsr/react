import supabase from '../supabaseClient';

export const  uploadInternshipOfferLetter= async (file) => {
  const fileName = `${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from("offerletter") // ✅ New bucket
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload Error:', error);
    return { error };
  }

  // Optional: get public URL (only works if bucket is public)
  const { data: publicData, error: publicError } = supabase
    .storage
    .from("LeaveForm")
    .getPublicUrl(fileName);

  if (publicError) {
    console.error('Public URL Error:', publicError);
    return { error: publicError };
  }

  return { publicUrl: publicData.publicUrl };
};