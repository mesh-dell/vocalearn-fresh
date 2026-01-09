import axios from "axios";
import { toast } from "react-toastify";

export const handleError = (error: any) => {
  if (axios.isAxiosError(error)) {
    var err = error.response;
    if (window.location.href.includes("register")) {
      if (err?.status == 404) {
        toast.warning("Ask admin to register you");
      } else if (err?.status == 400) {
        toast.warning("User already exists. Please login");
        window.history.pushState({}, "LoginPage", "/login");
      }
    }
    if (Array.isArray(err?.data.errors)) {
      for (let val of err?.data.errors) {
        toast.warning(val.description);
      }
    } else if (typeof err?.data.errors === "object") {
      for (let e in err?.data.errors) {
        toast.warning(err.data.errors[e][0]);
      }
    } else if (err?.data) {
      toast.warning(err.data);
    } else if (err?.status == 401) {
      if (window.location.href.includes("login")) {
        toast.warning("Invalid Credentials");
      }
    } else if (err) {
      toast.warning(err?.data);
    }
  }
};
