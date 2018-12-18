import { expect } from "chai";
import fs from "fs";
import path from "path";
import { config } from "./configuration";
import { interpolateSwaggerToJson, mergeSwaggerJson } from "./swagger";
import {logger} from "./wiston-logger";

describe("Interpolate Swagger file with environment variables", () => {
    const swaggerContent = "schemes:\n" +
        "  - http\n" +
        "host: ${HOST_NAME}:${PORT}\n" +
        "basePath: ${API_BASE}";

    it("Run on empty string",  () => {
        expect(() => interpolateSwaggerToJson("", config)).to.throw(TypeError);
    });

    it("Normal operation",  () => {
        const result = interpolateSwaggerToJson(swaggerContent, config);
        expect(result).property("basePath", "/api");
        expect(result).property("host", "localhost:8080");
    });
});

describe("Merge swagger configuration json", () => {
   it("Json merge", async () => {
       const swaggerFile = fs.readFileSync(path.join(config.root, "swagger.json"), "utf-8");
       const result = await mergeSwaggerJson(swaggerFile);
       expect(result).have.property("basePath");
   });
});

describe("Interpolate and then merge", () => {
    it("Json interpolate and merge", async () => {
        let swaggerFile = fs.readFileSync(path.join(config.root, "swagger.json"), "utf-8");
        swaggerFile = interpolateSwaggerToJson(swaggerFile, config);
        const result = await mergeSwaggerJson(JSON.stringify(swaggerFile));
        expect(result).have.property("basePath");
    });
});
