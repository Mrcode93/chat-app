export const baseUrl = "https://chat-app-speh.onrender.com";

import axios from "axios";

export const postRequest = async (url, body) => {
  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    let message;

    if (error.response && error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.message;
    }

    return {
      error: true,
      message,
    };
  }
};

export const getRequest = async (url) => {
  try {
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    let message;

    if (error.response && error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.message;
    }

    return {
      error: true,
      message,
    };
  }
};
