import React from "react";

const ShowImage = ({ item, url, className }) => {
  return (
    <>
      <img
        className={className}
        src={`${import.meta.env.VITE_BACKEND_BASE_URL}/${url}/${item._id}`}
        alt={`${item.name}`}
      />
    </>
  );
};

export default ShowImage;
