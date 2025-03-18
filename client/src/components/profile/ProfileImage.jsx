import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useDropzone } from "react-dropzone";
import api from "../axios/Axios";
import ProfileImageView from "./ProfileImageView";
import { toast, ToastContainer } from "react-toastify";
import { clearUser } from "../../redux/slices/auth/authSlices";
import Cropper from 'react-easy-crop'
import { cropImage } from "./cropImage";

const ProfileImage = () => {
  const [userData, setUserData] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }

  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    toast.success("Log Out Successful!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
    dispatch(clearUser());
    navigate("/");
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      const fetchUserData = async () => {
        try {
          const response = await api.get("/users/getMe", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data && response.data.data && response.data.data.doc) {
            setUserData(response.data.data.doc);
          } else {
            console.error("Unexpected response structure:", response);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [navigate, token]);

  const handleOpenImageEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPreviewImage("");
    setSelectedFile(null);
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSaveImage = async () => {
    if (!selectedFile) {
      toast.error("Please select an image before saving.");
      return;
    }
    const croppedImage = await cropImage(previewImage, croppedAreaPixels);
    const formData = new FormData();
    formData.append("photo", croppedImage);

    try {
      setUploading(true);
      const response = await api.patch("/users/updateMe", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success") {
        toast.success("Profile image updated successfully!");

        // Refetch user data to get the updated profile image
        const updatedUserResponse = await api.get("/users/getMe", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (
          updatedUserResponse.data &&
          updatedUserResponse.data.data &&
          updatedUserResponse.data.data.doc
        ) {
          // Add a timestamp to the photo URL to avoid caching issues
          setUserData({
            ...updatedUserResponse.data.data.doc,
            photo: `${updatedUserResponse.data.data.doc.photo}?${new Date().getTime()}`,
          });
        } else {
          console.error("Unexpected response structure:", updatedUserResponse);
        }

        setIsEditing(false);
        setSelectedFile(null);
        setPreviewImage("");
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to update profile image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxFiles: 1,
  });

  const handleOverlayClick = () => {
    setIsImageModalOpen(false);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
  };

  return (
    <div className="sticky top-10">

      <div className="bg-white ">
        <div className="w-full flex justify-center items-center pt-12 pb-8 relative">
          {!isEditing && (
            <button
              className="absolute right-5 top-5 text-[24px] text-[#8f8f8f]"
              onClick={handleOpenImageEdit}
            >
              <FaEdit />
            </button>
          )}

          <div className=" kk w-[200px] h-[200px] flex justify-center items-center">
            {!isEditing ? (
              <>
                <img
                  className="w-full h-full rounded-full cursor-pointer"
                  src={
                    userData?.photo ||
                    "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"
                  }
                  alt="User"
                  onClick={() => setIsImageModalOpen(true)}
                />
              </>
            ) : (
              <div
                {...getRootProps()}
                className=" border-dashed border-2 w-[200px] h-[200px] border-gray-300 p-4 rounded-lg cursor-pointer"
              >
                <input {...getInputProps()} />
                {previewImage ? (
                  <>
                  <div className="nasim w"> 
                  <Cropper
                      image={previewImage}
                      crop={crop}
                      zoom={zoom}
                      aspect={1 / 1}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                    </div>
                  </>
                ) : (
                  <p>Drag & drop your profile image here, or click to select</p>
                )}
              </div>
            )}
          </div>
          
        </div>
        {isEditing && (
          <div className="flex justify-center gap-4 mb-10 mt-10">
            <button
              onClick={handleSaveImage}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {uploading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="pb-16 flex flex-col items-center">
          <h2 className="text-[30px] text-center font-medium">
            {userData?.name}
          </h2>
          <p className="text-center mt-2 text-gray-600">
            {userData?.upazilla}, {userData?.district}
          </p>
          <div>
            <button
              onClick={handleLogOut}
              className="flex items-center gap-1 py-2 px-4 bg-red-600 hover:bg-red-800 transition-all ease-linear duration-150 rounded-md font-semibold text-white mt-10"
            >
              <MdLogout /> Logout
            </button>
          </div>
        </div>
      </div>

      {isImageModalOpen && (
        <ProfileImageView
          handleOverlayClick={handleOverlayClick}
          image={userData?.photo}
          handleCloseImageModal={handleCloseImageModal}
        />
      )}
    </div>
  );
};

export default ProfileImage;
