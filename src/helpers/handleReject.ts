import config from '../config';

// Default promise rejection handler.
// Alert can be replaced to a proper popup later.
const handleReject = (msg?: string) => {
  const fullMsg = msg ? `Error: ${msg}`
    : 'Network error. Please, try again later';
  if (config.isWebpackDevServer) {
    // eslint-disable-next-line no-console
    console.error(fullMsg);
  } else {
    alert(fullMsg);
  }
};

export default handleReject;
