interface Config {
  hostName: string,
  apiHostName: string,
  isWebpackDevServer: boolean
}

const config: Config = {
  hostName: process.env.REACT_APP_HOST,
  apiHostName: process.env.REACT_APP_API_HOST,
  isWebpackDevServer: process.env.REACT_APP_IS_WDS === 'true'
} as Config;

export default config
