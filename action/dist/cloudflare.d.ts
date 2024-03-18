type Response<T> = [T | null, string | null];
export declare class Cloudflare {
    private client;
    constructor(params: {
        email: string;
        key: string;
    });
    private getZoneId;
    private getDNSRecord;
    createDNSRecord(domain: string, name: string, target: string): Promise<Response<void>>;
    deleteDNSRecord(domain: string, name: string): Promise<Response<void>>;
}
export {};
