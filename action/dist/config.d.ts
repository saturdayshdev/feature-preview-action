declare const config: {
    type: string;
    feature: string;
    cloudflare: {
        email: string;
        apiKey: string;
        domain: string;
        target: string;
    };
    portainer: {
        baseUrl: string;
        username: string;
        password: string;
        endpointId: string;
    };
    env: {
        name: string;
        value: string;
    }[];
    stack: {
        name: string;
        stack: string;
        pullImage: boolean;
        prune: boolean;
    };
};
export default config;
