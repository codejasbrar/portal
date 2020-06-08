interface Config {
  hostName: string,
  apiHostName: string,
}

const config: Config = {
  hostName: process.env.REACT_APP_HOST,
  apiHostName: process.env.REACT_APP_API_HOST,
} as Config;

console.log(process.env.REACT_APP_API_HOST);

export default config