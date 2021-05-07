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

class example_buyer {
    constructor(name, address, contact, mail){
        this.id = 1;
        this.name = "Dolly";
        this.address = "Shaitan Gali, Khatra Mahal, Shamshaan ke Samne";
        this.contact = "8881212";
        this.mail = "dololol@gmail.com";
        this.balance = 210983;
    }
}

class example_seller {
    constructor(name, address, contact, mail){
        this.id = 1;
        this.name = "Dolly_sell";
        this.address = "Seller Shaitan Gali, Khatra Mahal, Shamshaan ke Samne";
        this.contact = "0008881212";
        this.mail = "seldololol@gmail.com";
    }
}

class example_delagents {
    constructor(name, address, contact, mail){
        this.id = 1;
        this.name = "Dolly_del";
        this.address = "Dell Shaitan Gali, Khatra Mahal, Shamshaan ke Samne";
        this.contact = "44408881212";
        this.mail = "deldololol@gmail.com";
        this.num_delivered = 40;
        this.num_active = 3;
    }
}

exports.get_browse = (req,res,next) => {
    p = new example_base_prod();
    arr = [p,p,p,p,p,p];
    res.render('admin/browse', {
        pageTitle: 'Browse',
        path: '/admin/browse',
        editing: false,
        prods: arr
    });
};

exports.get_buyers = (req,res,next) => {
    d = new example_buyer()
    arr = [d,d,d,d,d,d,d]
    res.render('admin/buyers', {
        pageTitle: 'Buyers',
        path: '/admin/buyers',
        editing: false,
        buyers: arr
    });
};

exports.get_sellers = (req,res,next) => {
    d = new example_seller()
    arr = [d,d,d,d,d,d,d]
    res.render('admin/sellers', {
        pageTitle: 'Sellers',
        path: '/admin/sellers',
        editing: false,
        sellers: arr
    });
};

exports.get_delagents = (req,res,next) => {
    d = new example_delagents()
    arr = [d,d,d,d,d,d,d]
    res.render('admin/delagents', {
        pageTitle: 'Delivery Agents',
        path: '/admin/delagents',
        editing: false,
        delagents: arr
    });
};

exports.get_add_delagent = (req,res,next) => {
    res.render('admin/add_delagent', {
        pageTitle: 'Add Delivery Agent',
        path: '/admin/add_delagent',
        editing: false,
    });
};

exports.get_add_seller = (req,res,next) => {
    res.render('admin/add_seller', {
        pageTitle: 'Add Seller',
        path: '/admin/add_seller',
        editing: false,
    });
};

exports.get_analytics = (req,res,next) => {
    var list_of_tuples = [
          ['Task', 'Hours per Day'],
          ['Electronics', 32],
          ['Books', 2],
          ['Chemicals', 43],
          ['Artillery', 87],
          ['Confectionaries', 18]
        ];
    var topbuyers = [
        ['Niraj', 44],
        ['Shivam', 43],
        ['Tathagat', 42],
        ['Bhaskar', 2],
        ];
    var topratedsellers = [
        ['SNiraj', 4.4, 330],
        ['SShivam', 4.3, 130],
        ['STathagat', 4.2, 31],
        ['SBhaskar', 0.2, 33],
        ]
    var topdelagents = [
        ['DNiraj', 76],
        ['DShivam', 32],
        ['DTathagat', 12],
        ['DBhaskar', 4],
        ]

    var orders_per_year = [
        [2004,  0.1],
        [2005,  0.16],
        [2006,  0.21],
        [2007,  0.22],
        [2008,  0.67],
        [2009,  0.99],
        [2010,  0.94],
        [2011,  1.56],
        [2012,  1.89],
        [2013,  1.77],
        [2014,  2.66],
        [2015,  6.6],
        [2016,  9.94],
        [2017,  11.33],
        [2018,  15.81],
        [2019,  25.91],
        [2020,  32.11],
      ]

    res.render('admin/analytics', {
        pageTitle: 'Analytics',
        path: '/admin/analytics',
        editing: false,
        list_of_tuples: list_of_tuples,
        topbuyers: topbuyers,
        topratedsellers: topratedsellers,
        topdelagents: topdelagents,
        orders_per_year: orders_per_year,
    });
};

exports.get_about = (req,res,next) => {
    res.render('admin/about', {
        pageTitle: 'About',
        path: '/admin/about',
        editing: false
    });
};

exports.post_add_seller = (req,res,next) => {
    return
};

exports.post_add_delagent = (req,res,next) => {
    return
};

exports.post_sort = (req,res,next) => {
    return
};

exports.post_openup = (req,res,next) => {
    // get the product_id;
    // compute the corresponding "example_prod_long" object by quering using the prod id.
    p = new example_base_prod();
    p = new example_prod_long(p);
    res.render('admin/productdetails', {
        pageTitle: 'Product Details',
        path: '/admin/productdetails',
        editing: false,
        // prods: result.rows
        product: p
    });
};