import { environment } from 'src/environment/environment';

const HOST = environment.host;
const PORT = environment.port;

export const SECURE = false;

export const getEndpoint = (isHttps: boolean) => {
  return `${isHttps ? 'https' : 'http'}://${HOST}:${PORT}`;
};
