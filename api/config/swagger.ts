import fs from "fs";
import yaml from "js-yaml";
import {JsonRefsOptions, resolveRefs} from "json-refs";
import path from "path";
import {IConfigType} from "./configuration";

const interpolateSwaggerToJson = (contents: string, config: IConfigType) => {
  if (!contents) { throw TypeError("Swagger configuration is empty"); }
  contents = contents.replace("${HOST_NAME}", config.host)
      .replace("${PORT}", config.port.toString()).replace("${API_BASE}", config.apiBase);
  return yaml.safeLoad(contents);
};

const mergeSwaggerYamls = async (contents: string, config: IConfigType) => {
    const root = yaml.safeLoad(contents);
    const options: JsonRefsOptions = {
        refPostProcessor : (object: any) => {
            const content = fs.readFileSync(path.join(config.root, object.$ref), "utf-8");
            return yaml.safeLoad(content);
        }
    };
    return resolveRefs(root, options);
};

const mergeSwaggerJson = async (contents: string) => {
    const something = await resolveRefs(JSON.parse(contents));
    return something.resolved;
};

export { interpolateSwaggerToJson, mergeSwaggerYamls, mergeSwaggerJson};
