import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = ({ setAccessToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");

    if (token) {
      setAccessToken(token);
      localStorage.setItem("accessToken", token); // Store for persistence
    }

    // Redirect to home page after login
    navigate("/");
  }, [setAccessToken, navigate]);

  return <div>Logging in...</div>;
};

export default Callback;