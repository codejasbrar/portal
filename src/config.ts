interface Config {
  hostName: string,
  apiHostName: string,
}

const config: Config = {
  hostName: process.env.REACT_APP_HOST,
  apiHostName: 'https://test-api-physician.insidetracker.com',
} as Config;
export default config

//process.env.REACT_APP_API_HOST