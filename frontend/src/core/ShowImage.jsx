import { API_URL } from "@/config";
import React from "react";

const ShowImage = ({ item, url, className }) => {
  return (
    <>
      <img
        className={className}
        src={`${API_URL}/${url}/${item._id}`}
        alt={`${item.name}`}
      />
    </>
  );
};

export default ShowImage;
