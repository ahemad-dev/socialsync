// import axios from "axios";

// const API = axios.create({
//   baseURL: "https://fc0ac6fa8d54.ngrok-free.app", // ✅ ngrok backend URL
// });

// export default API;










import axios from "axios";

const API = axios.create({
  baseURL: "https://socialsync-backend-fwwc.onrender.com/api",
  withCredentials: true
});

export default API;



// frontend/src/api.js
// import axios from "axios";

// const API = axios.create({
//   baseURL: import.meta.env.MODE === "development"
//     ? "http://localhost:5000"   // jab tu apne laptop me run karega
//     : import.meta.env.VITE_API_URL,  // jab tu ngrok / hosting pe run karega
//   withCredentials: true,  // 👈 isse token (cookies) bhi bheje jayenge
// });

// export default API;
