export {};

declare global {
  interface Window {
    freighterApi?: {
      getPublicKey: () => Promise<string>;
      signTransaction?: (xdr: string, opts?: any) => Promise<string>;
    };
  }
}
