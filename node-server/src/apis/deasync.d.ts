declare module 'deasync' {
    function deasync<T>(fn: Promise<T>): T;
    export = deasync;
  }