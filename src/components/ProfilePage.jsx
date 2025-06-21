import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setUserData(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;

  if (!userData) return <p>Profile not found.</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`}
          alt="Profile"
          className="profile-avatar"
        />
        <div className="profile-info">
          <h2>{userData.name}</h2>
          <p>{userData.email}</p>
        </div>
      </div>

      <div className="profile-details">
        <div className="profile-field">
          <label>Registration Number:</label>
          <p>{userData.reg_number || "Not assigned"}</p>
        </div>

        <div className="profile-field">
          <label>User ID:</label>
          <p>{userData.user_id || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
