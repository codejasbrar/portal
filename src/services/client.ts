import axios from "axios";
import config from "../config";
import Token from "../helpers/localToken";

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

client.interceptors.request.use((request) => {
  request.headers["Authorization"] = `Bearer ${Token.get().token}`;
  return request;
});

export default client;
