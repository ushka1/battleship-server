declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    SOCKET_ORIGIN: string;

    DB_CONNECT_URI: string;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
  }
}
