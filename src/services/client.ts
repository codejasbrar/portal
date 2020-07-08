import axios from "axios";
import config from "../config";

const baseConfig = {
  baseURL: config.apiHostName,
  headers: {
    common: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept': "*/*",
    }
  }
};

const createAxios = () => axios.create(baseConfig);

const client = createAxios();

export default client;