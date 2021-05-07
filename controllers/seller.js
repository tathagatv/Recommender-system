const pool= require('../utils/database');
const Prod = require('../models/prod');

class example_base_prod {
    constructor(){
        this.id = 1;
        this.name = "BG";
        this.image = "https://www.cse.iitb.ac.in/~bhaskargupta/def.jpeg";
        this.seller = "Tathagat";
        this.cost = 150;
        this.rating = 5;
        this.categories = ["Elec", "CS", "Meta", "Chem"];
    }
}

class example_prod_long {
    constructor(p){
        this.id = 1;
        this.name = "BG";
        this.image = "https://www.cse.iitb.ac.in/~bhaskargupta/def.jpeg";
        this.seller = "Tathagat";
        this.cost = 150;
        this.status = "Shipped"
        this.delagent = "ABCD";
        this.delcontact = "9876543210";
        this.rating = 5;
        this.categories = ["Elec", "CS", "Meta", "Chem"];
        this.quantity = 10;
        this.brand = "Apple";
        this.description = "Alienware! Best Gaming Laptop in the Market today! 16 GB GPU, 32GB RAM, liquid display.";
        this.also_viewed = [p,p,p,p,p,p] // top 6
        this.also_bought = [p,p,p,p] // top 6
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
    p = new example_prod_long();
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

exports.post_openup = (req,res,next) => {
    // get the product_id;
    // compute the corresponding "example_prod_long" object by quering using the prod id.
    p = new example_base_prod();
    p = new example_prod_long(p);
    res.render('seller/productdetails', {
        pageTitle: 'Product Details',
        path: '/seller/productdetails',
        editing: false,
        // prods: result.rows
        product: p
    });
};