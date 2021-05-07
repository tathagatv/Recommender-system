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
        this.category = "Randi";
    }
}

class example_prod_long {
    constructor(p){
        this.id = 1;
        this.name = "BG";
        this.image = "https://www.cse.iitb.ac.in/~bhaskargupta/def.jpeg";
        this.seller = "Tathagat";
        this.cost = 150;
        this.rating = 5;
        this.category = "Randi";
        this.quantity = 10;
        this.brand = "Apple";
        this.description = "Alienware! Best Gaming Laptop in the Market today! 16 GB GPU, 32GB RAM, liquid display.";
        this.also_viewed = [p,p,p,p,p,p] // top 6
        this.also_bought = [p,p,p,p] // top 6
    }
}

class example_cart_item {
    constructor(){
        this.id = 1;
        this.name = "BG";
        this.image = "https://www.cse.iitb.ac.in/~bhaskargupta/def.jpeg";
        this.seller = "Tathagat";
        this.cost = 150;
        this.quantity = 10;
    }
}

class example_cart {
    constructor(p){
        this.uid = 1; // user id
        this.prods = [p,p,p,p,p,p,p]
    }
}

class example_order_short {
    constructor(){
        this.orderid = 1;
        this.totalcost = 88654;
        this.delagent = "ABCD";
        this.delcontact = "9876543210";
        this.status = "Shipped";
        this.seller = "ISIS"
    }
}

class example_order_long {
    constructor(){
        this.orderid = 1;
        this.totalcost = 88654;
        this.product_id_list = [1,2,3,4,5];
        this.product_name_list = ["P1", "P2", "P3", "P4", "P5"];
        this.product_quantity_list = [44,21,11,555,67];
        this.product_cost_list = [44,21,11,555,67];
        this.product_rating_list = [5,2,4,3,5];
        this.status = "Shipped";
        this.seller = "ISIS"
    }
}

class example_buyer {
    constructor(name, address, contact, mail){
        this.id = 1;
        this.name = "Dolly";
        this.address = address;
        this.contact = contact;
        this.mail = mail;
        this.balance = 210983;
    }
}

exports.get_browse = (req,res,next) => {
    p = new example_base_prod();
    arr = [p,p,p,p];
    res.render('buyer/browse', {
        pageTitle: 'Browse',
        path: '/buyer/browse',
        editing: false,
        // prods: result.rows
        prods: arr
    });
};

exports.get_cart = (req,res,next) => {
    p = new example_cart_item();
    p = new example_cart(p)
    res.render('buyer/cart', {
        pageTitle: 'Cart',
        path: '/buyer/cart',
        editing: false,
        // prods: result.rows
        cart: p
    });
};

exports.get_about = (req,res,next) => {
    arr = []
    res.render('buyer/about', {
        pageTitle: 'About',
        path: '/buyer/about',
        editing: false,
        // prods: result.rows
        prods: arr
    });
};

exports.get_recharge = (req,res,next) => {
    u = new example_buyer()
    res.render('buyer/recharge', {
        pageTitle: 'Recharge',
        path: '/buyer/recharge',
        editing: false,
        // prods: result.rows
        user: u
    });
};

exports.get_history = (req,res,next) => {
    o = new example_order_short()
    arr = [o,o,o,o,o,o]
    res.render('buyer/history', {
        pageTitle: 'Past Orders',
        path: '/buyer/history',
        editing: false,
        // prods: result.rows
        orders: arr
    });
};

exports.post_sort = (req,res,next) => {
    return;
};

exports.post_recharge = (req,res,next) => {
    return;
};

exports.post_placeorder = (req,res,next) => {
    return;
};

exports.post_openup = (req,res,next) => {
    // get the product_id;
    // compute the corresponding "example_prod_long" object by quering using the prod id.
    p = new example_base_prod();
    p = new example_prod_long(p);
    res.render('buyer/productdetails', {
        pageTitle: 'Product Details',
        path: '/buyer/productdetails',
        editing: false,
        // prods: result.rows
        product: p
    });
};

exports.post_orderdetails = (req,res,next) => {
    // get the order_id;
    // compute the corresponding "example_order_long" object by quering using the order id.
    p = new example_order_long();
    res.render('buyer/orderdetails', {
        pageTitle: 'Order Details',
        path: '/buyer/orderdetails',
        editing: false,
        // prods: result.rows
        order: p
    });
};

exports.post_removefromcart = (req,res,next) => {
    return;
};

exports.post_addtocart = (req,res,next) => {
    return;
};