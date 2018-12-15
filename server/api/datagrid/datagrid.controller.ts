import express from "express";

const getData = function getData(req: express.Request, res: express.Response, next: express.NextFunction) {
  return res.json([
    {
      category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"
    },
    {
      category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"
    },
    {
      category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"
    },
    {
      category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"
    }
  ]);
};
export { getData };
