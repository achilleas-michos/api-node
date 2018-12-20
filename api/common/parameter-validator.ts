import Ajv from "ajv";
import express from "express";

const ajv = Ajv({ allErrors: true, removeAdditional: "all" });

/**
 * Add schema definition to AjV
 * @param (object) schema - object describing the schema
 * @param {string} schemaName - key under which the schema will be saved
 */
function addSchema(schema: object, schemaName: string) {
    ajv.addSchema(schema, schemaName);
}

/**
 * Format error responses
 * @param  {Object} schemaErrors - array of json-schema errors, describing each validation failure
 * @return {String} formatted api response
 */
function errorResponse(schemaErrors: any) {
    const errors = schemaErrors.map((error: any) => {
        return {
            message: error.message,
            path: error.dataPath
        };
    });
    return {
        errors,
        status: "failed",
    };
}

/**
 * Validates incoming request bodies against the given schema,
 * providing an error response when validation fails
 * @param  {String} schemaName - name of the schema to validate
 * @return {Object} response
 */
const validateSchema = (schemaName: string) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const valid = ajv.validate(schemaName, req.body);
        if (!valid) {
            return res.send(errorResponse(ajv.errors));
        }
        next();
    };
};

export {addSchema, validateSchema};
