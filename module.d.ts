declare namespace NodeJS {
  export interface ProcessEnv {
    DB_CONNECT: string;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    SOCKET_ORIGIN: string;
  }
}
