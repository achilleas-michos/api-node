import express from "express";

const getData = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  return res.json([
    {
      category: "Sporting Goods", name: "Football", price: "$49.99", stocked: true
    },
    {
      category: "Sporting Goods", name: "Baseball", price: "$9.99", stocked: true
    },
    {
      category: "Sporting Goods", name: "Basketball", price: "$29.99", stocked: false
    },
    {
      category: "Electronics", name: "iPod Touch", price: "$99.99", stocked: true
    }
  ]);
};
export { getData };
