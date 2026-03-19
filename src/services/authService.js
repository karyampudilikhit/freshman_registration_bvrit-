import AsyncStorage from "@react-native-async-storage/async-storage";
import { API, DEMO_MODE } from "../constants/config";
import api from "./api";

// ─── Module-level counter so both register() and logout() share scope ─────────
let _studentCounter = null;

const authService = {
  login: async (uniqueId, password) => {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!uniqueId || !password) {
        throw new Error("Please enter Unique ID and Password");
      }

      const stored = await AsyncStorage.getItem("@demo_user_data");
      const userData = stored ? JSON.parse(stored) : {
        name: "Student",
        firstName: "Student",
        lastName: "",
        parentPhone: "9876543210",
        interhallTicket: "IHT001",
        dob: "2008-01-15",
      };

      return {
        user: {
          id: "1",
          uniqueId: uniqueId.toUpperCase(),
          name: userData.name || "Student",
          firstName: userData.firstName || "Student",
          lastName: userData.lastName || "",
          parentPhone: userData.parentPhone,
          interhallTicket: userData.interhallTicket,
          dob: userData.dob,
        },
        token: "demo_token_" + Date.now(),
      };
    }

    // ── Real API ──
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uniqueId, password }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Login failed");
    }
    return response.json();
  },

  register: async (data) => {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // FIX: use let (not const) and keep counter at module scope
      const stored = await AsyncStorage.getItem("@student_counter");
      let studentCounter = stored ? parseInt(stored) + 1 : 1;
      await AsyncStorage.setItem("@student_counter", String(studentCounter));
      _studentCounter = studentCounter;

      const nameParts = (data.name || "").trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const userData = {
        name: data.name,
        firstName,
        lastName,
        parentPhone: data.parentPhone,
        interhallTicket: data.interhallTicket,
        dob: data.dob ? data.dob.toISOString().split("T")[0] : null,
      };
      await AsyncStorage.setItem("@demo_user_data", JSON.stringify(userData));

      const uniqueId = `2026-BVRITN-1a-${String(studentCounter).padStart(4, "0")}`;

      return {
        message: "Registration successful (Demo Mode)",
        uniqueId,
        userId: "user_" + Date.now(),
        name: data.name,
        firstName,
        lastName,
      };
    }

    // ── Real API ──
    const payload = {
      name: data.name.trim(),
      parentPhone: data.parentPhone.trim(),
      interhallTicket: data.interhallTicket.trim().toUpperCase(),
      dob: data.dob ? data.dob.toISOString() : null,
      password: data.password,
    };

    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.REGISTER}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Registration failed");
    }
    return response.json();
  },

  logout: async () => {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // FIX: reset the module-level counter, not a non-existent local var
      _studentCounter = null;
      await AsyncStorage.removeItem("@demo_user_data");
      return { message: "Logged out (Demo Mode)" };
    }

    // ── Real API ──
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.LOGOUT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Logout failed");
    }
    return response.json();
  },

  refreshToken: async (refreshToken) => {
    if (DEMO_MODE) {
      return { token: "demo_token_" + Date.now(), refreshToken };
    }

    // FIX: added response.ok check
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.REFRESH_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Token refresh failed");
    }
    return response.json();
  },

  sendOTP: async (phone) => {
    if (DEMO_MODE) {
      return { message: "OTP sent (Demo Mode)", expiresIn: 300 };
    }

    // FIX: added response.ok check
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.SEND_OTP}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Failed to send OTP");
    }
    return response.json();
  },

  verifyOTP: async (phone, otp) => {
    if (DEMO_MODE) {
      if (otp === "123456" || otp === "000000") {
        return { verified: true, token: "demo_otp_token_" + Date.now() };
      }
      throw new Error("Invalid OTP");
    }

    // FIX: added response.ok check
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.VERIFY_OTP}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Invalid OTP");
    }
    return response.json();
  },

  // FIX: use api helper so the Authorization header is included automatically
  changePassword: async (oldPassword, newPassword) => {
    if (DEMO_MODE) {
      return { message: "Password changed (Demo Mode)" };
    }
    return api.post("/auth/change-password", { oldPassword, newPassword });
  },

  forgotPassword: async (uniqueId) => {
    if (DEMO_MODE) {
      return { message: "Password reset link sent (Demo Mode)" };
    }
    // FIX: forgotPassword is unauthenticated by nature — raw fetch is correct,
    // but still add response.ok check
    const response = await fetch(`${API.BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uniqueId }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Failed to send reset link");
    }
    return response.json();
  },

  resetPassword: async (token, newPassword) => {
    if (DEMO_MODE) {
      return { message: "Password reset (Demo Mode)" };
    }
    // FIX: added response.ok check
    const response = await fetch(`${API.BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Password reset failed");
    }
    return response.json();
  },
};

export default authService;