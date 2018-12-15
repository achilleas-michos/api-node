import path from "path";

interface ConfigType {
    env: string;
    root: string;
    ip: string;
    port: number;
    secrets: string;
}

const config: ConfigType = {
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

export { config };
