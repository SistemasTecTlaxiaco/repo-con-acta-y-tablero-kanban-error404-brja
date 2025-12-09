// types/stellar.d.ts
declare module '@stellar/stellar-sdk' {
  export class Keypair {
    static random(): Keypair;
    static fromSecret(secret: string): Keypair;
    publicKey(): string;
    secret(): string;
  }

  export class TransactionBuilder {
    constructor(account: any, options: any);
    addOperation(operation: any): TransactionBuilder;
    setTimeout(timeout: number): TransactionBuilder;
    build(): any;
  }

  export class Horizon {
    static Server: typeof Server;
  }

  export class Server {
    constructor(serverURL: string);
    loadAccount(accountId: string): Promise<any>;
    submitTransaction(transaction: any): Promise<any>;
    fetchBaseFee(): Promise<string>;
  }

  export namespace Operation {
    function manageData(options: { name: string; value: string }): any;
  }

  export namespace Networks {
    const TESTNET: string;
    const PUBLIC: string;
  }
}