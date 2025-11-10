import { environment } from "src/environment/environment";

const HOST = environment.host;
const PORT = environment.port;

export const SECURE = true;

export const getEndpoint = (isHttps: boolean) => {
  return `${isHttps ? 'https' : 'http'}://${HOST}${PORT}`;
};

