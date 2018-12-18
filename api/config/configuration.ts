import * as path from "path";

interface IConfigType {
    apiBase: string;
    host: string;
    env: string;
    root: string;
    ip: string;
    port: number;
    secrets: string;
}

const config: IConfigType = {
    apiBase: process.env.API_BASE  || "/api",

    host: process.env.HOST_NAME || "localhost",

    // Current run environment
    env: process.env.NODE_ENV || "development",

    // Root path of server
    root: path.join(__dirname, "../"),

    // Server IP
    ip: process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "",

    // Server port
    port: Number(process.env.OPENSHIFT_NODEJS_PORT) || Number(process.env.PORT) || 8080,

    // Secret for session, you will want to change this and make it an environment variable
    secrets: process.env.SESSION_SECRET || "demo-secret"
};

export { IConfigType, config };
