// custom.d.ts
declare namespace Express {
  export interface Request {
    io: import('socket.io').Server;
  }
}
