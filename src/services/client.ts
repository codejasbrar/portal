import axios from "axios";
import config from "../config";

const createAxios = () => axios.create({
  baseURL: config.apiHostName,
  headers: {
    common: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept': "*/*",
    }
  }
});

const client = createAxios();

const authorized = createAxios();

authorized.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

export {authorized};
export default client;