import express from "express";

const getUsers = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  return res.json([
    {
      email: "john.doe@gmail.com", firstName: "John",  lastName: "Doe"
    },
    {
      email: "jane.doe@gmail.com", firstName: "Jane",  lastName: "Doe"
    }
  ]);
};
export { getUsers };
