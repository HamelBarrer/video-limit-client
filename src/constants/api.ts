export const API_BASE = {
  TYPE: 'http',
  HOST: '192.168.1.87',
  PORT: '8000',
  VERSION: 'v1',
};

export const API = {
  RECORD_API: `${API_BASE.TYPE}://${API_BASE.HOST}:${API_BASE.PORT}/api/${API_BASE.VERSION}/record`,
};
