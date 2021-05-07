const pool= require('../utils/database');
const Prod = require('../models/prod');

class example_base_prod {
    constructor(name, image, seller, cost, rating, category){
        this.id = 1;
        this.name = name;
        this.image = image;
        this.seller = seller;
        this.cost = cost;
        this.rating = rating;
        this.category = category;
        this.quantity = 10;
        this.brand = "Dell";
        this.description = "Alienware! Best Gaming Laptop in the Market today! 16 GB GPU, 32GB RAM, liquid display.";
    }
}

class example_past_order {
    constructor(){
        this.orderid = 1;
        this.productlist = ["laptop", "Grinder", "AK47", "nail cutter", "jello"];
        this.quantitylist = [1,2,743,1,8]
        this.costlist = [44000, 1400, 8930, 23, 65]
        this.totalcost = 88654;
        this.buyer = "Taliban";
    }
}

class example_admin_seller {
    constructor(name, address, contact, mail){
        this.name = name;
        this.address = address;
        this.contact = contact;
        this.mail = mail;
    }
}

exports.get_onsale = (req,res,next) => {
    p = new example_base_prod("BG", "https://www.cse.iitb.ac.in/~bhaskargupta/def.jpeg", "Tathagat", "150", "5", "Randi");
    arr = [p,p,p,p];
    res.render('seller/onsale', {
        pageTitle: 'On Sale',
        path: '/seller/onsale',
        editing: false,
        // prods: result.rows
        prods: arr
    });
};

exports.get_about = (req,res,next) => {
    arr = []
    res.render('seller/about', {
        pageTitle: 'About',
        path: '/seller/about',
        editing: false,
        // prods: result.rows
        prods: arr
    });
};

exports.get_addnew = (req,res,next) => {
    arr = []
    res.render('seller/addnew', {
        pageTitle: 'Add New',
        path: '/seller/addnew',
        editing: false,
        // prods: result.rows
        prods: arr
    });
};

exports.get_past = (req,res,next) => {
    o = new example_past_order()
    arr = [o,o,o,o,o,o]
    res.render('seller/past', {
        pageTitle: 'Past Orders',
        path: '/seller/past',
        editing: false,
        // prods: result.rows
        orders: arr
    });
};

exports.get_requests = (req,res,next) => {
    o = new example_past_order()
    arr = [o,o,o,o,o,o]
    res.render('seller/requests', {
        pageTitle: 'Order Requests',
        path: '/seller/requests',
        editing: false,
        // prods: result.rows
        orders: arr
    });
};

exports.get_ongoing = (req,res,next) => {
    o = new example_past_order()
    arr = [o,o,o,o,o,o]
    res.render('seller/ongoing', {
        pageTitle: 'Ongoing Orders',
        path: '/seller/ongoing',
        editing: false,
        // prods: result.rows
        orders: arr
    });
};

exports.post_sort = (req,res,next) => {
    return;
};

exports.post_addnew = (req,res,next) => {
    return;
};

exports.post_ship = (req,res,next) => {
    return;
};