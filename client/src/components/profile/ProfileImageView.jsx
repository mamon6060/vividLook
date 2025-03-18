import React from "react";
import { IoCloseSharp } from "react-icons/io5";

const ProfileImageView = ({ handleOverlayClick, handleCloseImageModal, image }) => {

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-overlay"
    >
      <div className="relative bg-white rounded shadow-lg transition-transform transform scale-100">
        <img
          className="w-[500px] h-auto rounded z-20"
          src={image || "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"}
          alt="User"
        />
        <button
          onClick={handleCloseImageModal}
          className="text-[28px] text-red-600 font-semibold absolute right-3 top-3"
        >
          <IoCloseSharp />
        </button>
      </div>
    </div>
  );
};

export default ProfileImageView;
