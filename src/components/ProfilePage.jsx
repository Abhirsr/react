import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "./ProfilePage.css";
import { FiCamera } from "react-icons/fi";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState("");
  const [showActions, setShowActions] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        alert("Not logged in.");
        setLoading(false);
        return;
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Fetch error:", profileError);
      } else {
        const updatedData = { ...data };

        const branchCode = updatedData.reg_number?.charAt(5);
        if (branchCode === "A") {
          updatedData.department = "Computer Science Engineering";
          updatedData.course = "B.E";
        } else if (branchCode === "C") {
          updatedData.department = "Electronics and Communication Engineering";
          updatedData.course = "B.E";
        } else {
          updatedData.department = updatedData.department || "Unknown";
          updatedData.course = updatedData.course || "Unknown";
        }

        const yearPrefix = updatedData.reg_number?.substring(2, 4);
        if (yearPrefix) {
          const admissionYear = parseInt("20" + yearPrefix);
          const currentYear = new Date().getFullYear();
          let academicYear = currentYear - admissionYear + 1;

          if (academicYear < 1) academicYear = 1;
          if (academicYear > 4) academicYear = 4;

          updatedData.year = `${academicYear} Year`;
        } else {
          updatedData.year = "Not specified";
        }

        setUserData(updatedData);
        setProfileImage(updatedData.profile_url);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${userData.id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    await supabase.storage.from("profile-photos").remove([filePath]);

    const { error: uploadError } = await supabase.storage
      .from("profile-photos")
      .upload(filePath, file);

    if (uploadError) {
      alert("Upload failed.");
      console.error(uploadError);
      return;
    }

    const { data: publicUrlData, error: urlError } = supabase.storage
      .from("profile-photos")
      .getPublicUrl(filePath);

    if (urlError) {
      alert("URL fetch failed.");
      console.error(urlError);
      return;
    }

    const publicUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ profile_url: publicUrl })
      .eq("id", userData.id);

    if (updateError) {
      alert("DB update failed.");
      console.error(updateError);
      return;
    }

    setProfileImage(publicUrl);
    setUserData({ ...userData, profile_url: publicUrl });
    alert("Profile picture updated.");
  };

  const handleDeletePicture = async () => {
    await supabase.storage.from("profile-photos").remove([
      `avatars/${userData.id}.jpg`,
      `avatars/${userData.id}.png`,
      `avatars/${userData.id}.jpeg`,
    ]);

    await supabase
      .from("profiles")
      .update({ profile_url: null })
      .eq("id", userData.id);

    setProfileImage("");
    setUserData({ ...userData, profile_url: null });
    alert("Profile picture removed.");
  };

  const handleEditProfile = () => {
    setShowEditForm(true);
    setShowActions(false);
  };

  const handleSaveProfile = async () => {
    if (!userData) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        name: userData.name,
        email: userData.email,
        semester: userData.semester,
        course: userData.course,
        department: userData.department,
        profile_url: userData.profile_url,
      })
      .eq("id", userData.id);

    if (error) {
      alert("Update failed.");
      console.error(error);
      return;
    }

    setShowEditForm(false);
    alert("Profile updated.");
  };

  if (loading) return <p>Loading profile...</p>;
  if (!userData) return <p>Profile not found.</p>;

  return (
    <div className="profile-container" onClick={() => setShowActions(false)}>
      <div className="profile-header">
        <div className="avatar-wrapper" onClick={(e) => e.stopPropagation()}>
          <img
            src={
              profileImage ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`
            }
            alt="Profile"
            className="profile-avatar"
          />
          <button
            className="camera-button"
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
          >
            <FiCamera />
          </button>

          {showActions && (
            <div className="profile-actions" onClick={(e) => e.stopPropagation()}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                id="upload-input"
              />
              <label htmlFor="upload-input" className="action-option">
                Upload Picture
              </label>

              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                id="camera-input"
              />
              <label htmlFor="camera-input" className="action-option">
                Take Photo
              </label>

              <button onClick={handleDeletePicture} className="action-option">
                Delete Picture
              </button>
            </div>
          )}
        </div>

        <div className="profile-info">
          <h2>{userData.name}</h2>
          <p>{userData.email}</p>
          <button className="edit-btn" onClick={handleEditProfile}>
            Edit Profile
          </button>
        </div>
      </div>

      <div className="profile-details">
        <div className="profile-field">
          <label>Registration Number:</label>
          <p>{userData.reg_number || "Not assigned"}</p>
        </div>
        <div className="profile-field">
          <label>Year:</label>
          <p>{userData.year || "Not specified"}</p>
        </div>
        <div className="profile-field">
          <label>Semester:</label>
          <p>{userData.semester || "Not specified"}</p>
        </div>
        <div className="profile-field">
          <label>Course:</label>
          <p>{userData.course || "Not specified"}</p>
        </div>
        <div className="profile-field">
          <label>Department:</label>
          <p>{userData.department || "Not specified"}</p>
        </div>
      </div>

      {showEditForm && (
        <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
          <div className="edit-form">
            <h3>Edit Profile</h3>

            <label>Name:</label>
            <input
              type="text"
              value={userData.name || ""}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />

            <label>Email:</label>
            <input
              type="email"
              value={userData.email || ""}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />

            <label>Semester:</label>
            <input
              type="text"
              value={userData.semester || ""}
              onChange={(e) =>
                setUserData({ ...userData, semester: e.target.value })
              }
            />

            <label>Course:</label>
            <input
              type="text"
              value={userData.course || ""}
              onChange={(e) =>
                setUserData({ ...userData, course: e.target.value })
              }
            />

            <label>Department:</label>
            <input
              type="text"
              value={userData.department || ""}
              onChange={(e) =>
                setUserData({ ...userData, department: e.target.value })
              }
            />

            <button onClick={handleSaveProfile} className="save-btn">
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;