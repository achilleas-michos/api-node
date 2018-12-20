import express from "express";

let usersList = [
    {
        email: "john.doe@gmail.com", firstName: "John",  id: 1, lastName: "Doe"
    },
    {
        email: "jane.doe@gmail.com", firstName: "Jane",  id: 2, lastName: "Doe"
    }
];

const get = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.params.id) {
        return res.json(usersList.filter((item) => item.id === req.params.id));
    } else {
        return res.json(usersList);
    }
};

const count = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return res.json({count: usersList.length});
};

const addOne = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const newId = usersList.length > 0 ? usersList.map((item) => item.id)
        .reduce((item, max) => item > max ? item : max) + 1 : 1 ;
    usersList.concat({email: req.body.email, firstName: req.body.firstName, id: newId, lastName: req.body.lastName});
    return res.json({id: newId});
};

const deleteOne = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const length = usersList.length;
    usersList = usersList.filter((item) => item.id !== Number(req.params.id));
    if (length > usersList.length) {
        return res.json({id: Number(req.params.id)});
    } else {
        return res.json({});
    }
};

const edit = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let newEntry = {};
    usersList.forEach((item, index) => {
        if (item.id === Number(req.params.id)) {
            if("id" in req.body) delete req.body.id;
            item = {...item, ...req.body};
            newEntry = item;
        }
    });
    return res.json(newEntry);
};

export { get, count, addOne, deleteOne, edit};
