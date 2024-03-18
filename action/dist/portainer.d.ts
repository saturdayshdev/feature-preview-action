interface ICreateStackConfig {
    env: {
        name: string;
        value: string;
    }[];
    fromAppTemplate?: boolean;
    name: string;
    stackFileContent: string;
    webhook?: string;
}
export declare class Portainer {
    private readonly baseUrl;
    private readonly username;
    private readonly password;
    private readonly axios;
    private token;
    constructor(params: {
        baseUrl: string;
        username: string;
        password: string;
    });
    private authenticate;
    createStack(endpointId: number, stack: ICreateStackConfig): Promise<any>;
    getAllStacks(endpointId?: number): Promise<any>;
    getStackByName(name: string, endpointId: number): Promise<any>;
    deleteStack(stackId: string, endpointId: number): Promise<any>;
}
export {};
