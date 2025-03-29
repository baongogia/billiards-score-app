/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import "./index.scss";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { findUser } from "../../services/auth/authService";
import { toast } from "react-toastify";
import { uploadAvatar } from "../../services/Admin/User/avatarService";
import { User, updateUser } from "../../services/Admin/User/userService";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

export default function MemberProfile() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const userId = useParams().id;
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      if (!userId) {
        throw new Error("User ID is undefined");
      }
      const res = await findUser(userId);
      const userData = res.data.data;
      setUserData(userData);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userData?._id) return;

    try {
      const updatedUser = await uploadAvatar(userData._id, file);
      setUserData(updatedUser);
      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to update avatar");
    }
  };

  const handleGoBack = () => navigate(-1);

  const handleSaveUser = async (userData: Partial<User>) => {
    if (userData) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, avatar, role,email,password, deletedAt, createdAt, updatedAt, __v, ...filteredData } = userData;
        const updatedUser = await updateUser(userData._id!, filteredData);
        setUserData(updatedUser);
        setIsEditModalOpen(false);
        toast.success("Profile updated successfully", {
          position: "top-right",
        });
      } catch (error) {
        console.error("Error updating user:", error);
        toast.error("Failed to update profile", {
          position: "top-right",
        });
      }
    }
  };

  if (!userData) {
    return (
      <div className="wrapper">
        <div className="profile-card">
          <div className="profile-card__cnt">
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }
  const handleOpenChangePassword = () => {
    setIsChangePasswordOpen(true);
  };
  const handleCloseChangePassword = () => {
    setIsChangePasswordOpen(false);
  };

  return (
    <div className="wrapper">
      <div className="profile-card">
        <div className="profile-card__img">
          <img
            src={userData?.avatar || "/placeholder.svg"}
            alt="Profile"
            onClick={() => fileInputRef.current?.click()}
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <div onClick={handleGoBack} className="absolute top-4 left-4 cursor-pointer">
          <IoMdArrowRoundBack size={30} color="black" />
        </div>

        <div className="profile-card__cnt">
          <div className="profile-card__name">{userData.name}</div>
          <div className="profile-card__txt">
            <strong>{userData.role?.toUpperCase()}</strong>
          </div>

          <div className="profile-card-inf">
            <div className="profile-card-inf__item">
              <div className="profile-card-inf__txt">Status</div>
              <div className="profile-card-inf__title">{userData.status}</div>
            </div>

            <div className="profile-card-inf__item">
              <div className="profile-card-inf__txt">Phone</div>
              <div className="profile-card-inf__title">{userData.phone || "N/A"}</div>
            </div>

            <div className="profile-card-inf__item">
              <div className="profile-card-inf__txt">Email</div>
              <div className="profile-card-inf__title">{userData.email}</div>
            </div>
          </div>

          <div className="profile-card-ctr">
            <button
              className="profile-card__button button--blue"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Profile
            </button>
            <button
              className="profile-card__button button--orange"
              onClick={handleOpenChangePassword} // Use the new handler
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveUser}
        user={userData}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={handleCloseChangePassword} // Use the new handler
        userId={userData?._id || ""}
      />
    </div>
  );
}
