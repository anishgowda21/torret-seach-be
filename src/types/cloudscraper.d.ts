declare module 'cloudscraper' {
    import { RequestCallback } from 'request';
    
    interface CloudscraperRequest {
      (options: any, callback?: RequestCallback): Promise<any>;
      get(uri: string | object, options?: any, callback?: RequestCallback): Promise<string>;
      post(uri: string | object, options?: any, callback?: RequestCallback): Promise<string>;
      put(uri: string | object, options?: any, callback?: RequestCallback): Promise<string>;
      patch(uri: string | object, options?: any, callback?: RequestCallback): Promise<string>;
      delete(uri: string | object, options?: any, callback?: RequestCallback): Promise<string>;
      head(uri: string | object, options?: any, callback?: RequestCallback): Promise<string>;
      jar(): any;
      defaults(options: any): CloudscraperRequest;
      cookie(name: string): any;
    }
    
    const cloudscraper: CloudscraperRequest;
    export = cloudscraper;
  }