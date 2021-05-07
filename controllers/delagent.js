const pool= require('../utils/database');
const Prod = require('../models/prod');

class example_order {
    constructor(name, address, contact, mail){
        this.orderid = 1;
        this.customer_name = "Dolly";
        this.customer_address = "Shaitan Gali, Khatra Mahal, Shamshaan ke Samne";
        this.customer_contact = "999998888222";
        this.cost = "432";
    }
}

exports.get_ongoing = (req,res,next) => {
    p = new example_order();
    arr = [p,p,p,p];
    res.render('delagent/ongoing', {
        pageTitle: 'Ongoing Orders',
        path: '/delagent/ongoing',
        editing: false,
        // prods: result.rows
        orders: arr
    });
};

exports.get_delivered = (req,res,next) => {
    p = new example_order();
    arr = [p,p,p,p];
    res.render('delagent/delivered', {
        pageTitle: 'Cart',
        path: '/delagent/delivered',
        editing: false,
        // prods: result.rows
        orders: arr
    });
};

exports.get_about = (req,res,next) => {
    res.render('delagent/about', {
        pageTitle: 'About',
        path: '/delagent/about',
        editing: false,
        // prods: result.rows
    });
};

exports.post_sort = (req,res,next) => {
    return;
};

exports.post_setasdelivered = (req,res,next) => {
    return;
};