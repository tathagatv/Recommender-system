const pool= require('../utils/database');
const Prod = require('../models/prod');

class example_base_prod {
    constructor(name, image, seller, cost, rating, category){
        this.name = name;
        this.image = image;
        this.seller = seller;
        this.cost = cost;
        this.rating = rating;
        this.category = category;
        this.quantity = 10;
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

exports.get_logout = (req,res,next) => {
    arr = []
    res.render('base/logout', {
        pageTitle: 'Log Out',
        path: '/base/logout',
        editing: false,
        // prods: result.rows
        prods: arr
    });
};