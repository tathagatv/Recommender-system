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

class example_admin_seller {
    constructor(name, address, contact, mail){
        this.name = name;
        this.address = address;
        this.contact = contact;
        this.mail = mail;
    }
}


exports.get_browse = (req,res,next) => {
	// TODO Force Logout here
    p = new example_base_prod("BG", "https://www.cse.iitb.ac.in/~bhaskargupta/def.jpeg", "Tathagat", "150", "5", "Randi");
    arr = [p,p,p,p];
    res.render('base/browse', {
        pageTitle: 'Browse',
        path: '/base/browse',
        editing: false,
        // prods: result.rows
        prods: arr
    });
};

exports.get_about = (req,res,next) => {
    arr = []
    res.render('base/about', {
        pageTitle: 'About',
        path: '/base/about',
        editing: false,
        // prods: result.rows
        prods: arr
    });
};

exports.get_login = (req,res,next) => {
    arr = []
    res.render('base/login', {
        pageTitle: 'Log In',
        path: '/base/login',
        editing: false,
        // prods: result.rows
        prods: arr
    });
};

exports.get_signup = (req,res,next) => {
    arr = []
    res.render('base/signup', {
        pageTitle: 'Sign Up',
        path: '/base/signup',
        editing: false,
        // prods: result.rows
        prods: arr
    });
};

exports.post_login = (req,res,next) => {
    var username = req.body.uname;
	var password = req.body.psw;
    var mode = req.body.mode;

    db_session
        .run("match (b:"+ mode +"{username: $uname, password: $psw}) return b.id, b.username",
            {uname: username, psw: password})
        .then(function(result){
            var len = result.records.length;
            var role = mode;
            if(mode=='del_personnel'){
                role = 'delagent';
            }
            if(len > 0){
                req.loggedin = true;
                req.username = result.records[0].get('b.username');
                req.id = result.records[0].get('b.id');
                req.role = role;
                req.mode = mode;
                res.redirect('/'+ role + '/');
            }else{
                res.send('Incorrect Username and/or Password!');
            }
        });
    
};

exports.post_signup = (req,res,next) => {
    arr = []
    res.render('base/signup', {
        pageTitle: 'Sign Up',
        path: '/base/signup',
        editing: false,
        // prods: result.rows
        prods: arr
    });
};

exports.post_openup = (req,res,next) => {
    // get the product_id;
    // compute the corresponding "example_prod_long" object by quering using the prod id.
    p = new example_base_prod();
    p = new example_prod_long(p);
    res.render('base/productdetails', {
        pageTitle: 'Product Details',
        path: '/base/productdetails',
        editing: false,
        // prods: result.rows
        product: p
    });
};