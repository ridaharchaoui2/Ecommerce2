import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Signout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const signout = () => {
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/signout`).then(() => {
      localStorage.removeItem("jwt_info");
      navigate("/signin");
      //window.location.reload();
      toast({
        title: "Admin SignOut",
        className: "bg-black text-white",
      });
    });
  };
  useEffect(() => {
    signout();
  }, []);

  return <div></div>;
};

export default Signout;
