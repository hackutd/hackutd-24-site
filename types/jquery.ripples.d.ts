import * as jquery from 'jquery';

// types/jquery.ripples.d.ts
declare global {
  interface JQuery {
    ripples(options?: any): JQuery;
  }
}

export {};
