import axios from "axios";
import axiosRetry from "axios-retry";

const configureAxiosRetry = () => {
  axiosRetry(axios, {
    retries: 3,
    retryDelay: (retryCount) => retryCount * 1000,
  });
};

export default configureAxiosRetry;
