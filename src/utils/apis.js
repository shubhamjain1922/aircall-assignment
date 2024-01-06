import axios from "axios";
import Toaster from "./toaster";

const baseURL = "https://cerulean-marlin-wig.cyclic.app/";

const axiosInstance = axios.create({
  baseURL,
});

const getActivities = () => {
  return axiosInstance
    .get("/activities")
    .then((res) => {
      const data = res.data || {};
      return data;
    })
    .catch((err) => {
      handleError(err);
    });
};

const getActivityDetails = (callId) => {
  return axiosInstance
    .get(`/activities/${callId}`)
    .then((res) => {
      const data = res.data || {};
      return data;
    })
    .catch((err) => {
      handleError(err);
    });
};

const updateCall = (callId, data) => {
  return axiosInstance
    .patch(`/activities/${callId}`, data)
    .then((res) => {
      const data = res.data || {};
      return data;
    })
    .catch((err) => {
      handleError(err);
    });
};

const resetCalls = () => {
  return axiosInstance
    .patch("/reset")
    .then((res) => {
      const data = res.data || {};
      return data;
    })
    .catch((err) => {
      handleError(err);
    });
};

const handleError = (error) => {
    console.log("error", error.response.data)
    throw error;
};

export { getActivities, getActivityDetails, updateCall, resetCalls };
