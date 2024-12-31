export const isAuthenticated = () => {
  try {
    const jwt = localStorage.getItem("jwt_info");
    return jwt ? JSON.parse(jwt) : false;
  } catch (err) {
    console.error("Error accessing localStorage", err);
    return false;
  }
};
