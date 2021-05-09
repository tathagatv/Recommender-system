const pool= require('../utils/database');
const Prod = require('../models/prod');

const randomstring = require("randomstring");

class example_base_prod {
    constructor(id, name, image, seller, cost, rating){
        this.id = id;
        this.name = name;
        this.image = image;
        this.seller = seller;
        this.cost = cost;
        this.rating = rating;
    }
}

class example_prod_long {
    constructor(pid, name, img, seller, cost, status,delagent, delcontact,
        rating, category, qty, brand, description, also_viewed, also_bought){
        this.id = pid;
        this.name = name;
        this.image = img;
        this.seller = seller;
        this.cost = cost;
        this.status = status;
        this.delagent = delagent;
        this.delcontact = delcontact;
        this.rating = rating;
        this.category = category;
        this.quantity = qty;
        this.brand = brand;
        this.description = description;
        this.also_viewed = also_viewed;
        this.also_bought = also_bought;
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
    arr = [];
    db_session
        .run("match (p:product)-[:prod_sell]->(s:seller) return p, s.name order by p.rating desc limit 15 ")
        .then(function(result){
            req.session.uid = null;
            req.session.loggedin = false;
            result.records.forEach(element => {
                properties = element.get('p').properties;
                seller = element.get('s.name');
                arr.push(new example_base_prod(properties['id'], properties['title'], properties['img'], seller, properties['price'], properties['rating'].toFixed(2)));
            });
            res.render('base/browse', {
                pageTitle: 'Browse',
                path: '/base/browse',
                editing: false,
                prods: arr
            });
        });
};

exports.get_about = (req,res,next) => {
    arr = []
    res.render('base/about', {
        pageTitle: 'About',
        path: '/base/about',
        editing: false,
        prods: arr
    });
};

exports.get_login = (req,res,next) => {
    arr = []
    res.render('base/login', {
        pageTitle: 'Log In',
        path: '/base/login',
        editing: false,
        prods: arr
    });
};

exports.get_signup = (req,res,next) => {
    arr = []
    res.render('base/signup', {
        pageTitle: 'Sign Up',
        path: '/base/signup',
        editing: false,
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
                req.session.loggedin = true;
                req.session.username = result.records[0].get('b.username');
                req.session.uid = result.records[0].get('b.id');
                req.session.role = role;
                req.session.mode = mode;
                res.redirect('/'+ role + '/');
            }else{
                res.send('Incorrect Username and/or Password!');
            }
        });
    
};

exports.post_signup = (req,res,next) => {
    db_session
        .run("match (b:buyer) where b.username=$uname or b.mail=$mail return count(*)",
        {uname: req.body.uname, mail: req.body.mail})
        .then(function(result) {
            var cnt = result.records[0].get('count(*)');
            var uid = randomstring.generate(7);
            if(cnt == 0){
                db_session
                    .run("create (b:buyer{id:$id, name:$name, username:$uname, password:$pw,\
                    address:$addr, contact:$contact, state:$state, mail:$mail,\
                    money:0});", {id: uid,
                    name: req.body.name, uname: req.body.uname, pw:req.body.psw, mail:req.body.mail,
                    state:req.body.state, contact:req.body.contact, addr: req.body.address})
                    .then(()=>{
                        req.session.loggedin = true;
                        req.session.username = req.body.uname;
                        req.session.uid = uid;
                        req.session.role = 'buyer';
                        req.session.mode = 'buyer';
                        res.redirect('/buyer/');
                    })
            }else{
                // username / email already exists
                res.render('base/signup', {
                    pageTitle: 'Sign Up',
                    path: '/base/signup',
                    editing: false,
                    err_alert: 1,
                    prods: []
                });
            }
        });
};

exports.post_openup = (req,res,next) => {

    product = new example_prod_long();
    pid = req.body.pid;
    db_session
        .run("MATCH (p:product{id:$pid})-[:also_bought]-(p2:product)-[:prod_sell]->(s:seller) return distinct p2, s.name", {pid: pid})
        .then(function(result){
            also_bought = [];
            result.records.forEach(element => {
                p = element.get('p2').properties;
                seller = element.get('s.name');
                also_bought.push(new example_base_prod(p['id'], p['title'], p['img'], seller, p['price'], p['rating'].toFixed(2)));
            });
            product.also_bought = also_bought;
        }).then(() => {db_session
            .run("MATCH (p:product{id:$pid})-[:also_viewed]-(p2:product)-[:prod_sell]->(s:seller) return distinct p2, s.name", {pid: pid})
            .then(function(result){
                also_viewed = [];
                result.records.forEach(element => {
                    p = element.get('p2').properties;
                    seller = element.get('s.name');
                    also_viewed.push(new example_base_prod(p['id'], p['title'], p['img'], seller, p['price'], p['rating'].toFixed(2)));
                });
                product.also_viewed = also_viewed;
            }).then(() => {db_session
                .run("MATCH (p:product{id:$pid})-[:prod_sell]->(s:seller) return p, s.name", {pid: pid})
                .then(function(result){
                    p = result.records[0].get('p').properties;
                    seller = result.records[0].get('s.name');
                    product.id = pid;
                    product.name = p['title'];
                    product.image = p['img'];
                    product.seller = seller;
                    product.cost = p['price'];
                    product.rating = p['rating'].toFixed(2);
                    product.quantity = p['quantity'];
                    product.description = p['description'];
                }).then(() => {db_session
                    .run("MATCH (p:product{id:$pid})-[:prod_cat]->(c:category) return c.name", {pid: pid})
                    .then(function(result){
                        cat = [];
                        result.records.forEach(element => {
                            cat.push(element.get('c.name'));
                        });
                        product.categories = cat;
                    }).then(() => {db_session
                        .run("MATCH (p:product{id:$pid})-[:prod_brand]->(b:brand) return b.name", {pid: pid})
                        .then(function(result){
                            if(result.records.length > 0){
                                product.brand = result.records[0];
                            }
                            res.render('base/productdetails', {
                                pageTitle: 'Product Details',
                                path: '/base/productdetails',
                                editing: false,
                                product: product
                            });
                        });
                    });
                });
            });
        });

};

exports.post_sort = (req,res,next) => {
    arr = [];
    db_session
        .run("MATCH (p:product)-[:prod_sell]->(sl:seller)\
        WITH apoc.text.levenshteinDistance($s, p.title)/(1.0+size(p.title)) as output1, p, sl\
        WITH apoc.text.levenshteinDistance($s, p.description)/(1.0+size(p.description)) as output2, p, sl, output1\
        WITH output1*2+output2*2+(5.0-p.rating)*1+(1.0/(p.num_rating+1))*10 as output, p, sl\
        ORDER BY output\
        RETURN p, sl.name limit 10\
        union match (p:product)-[:prod_sell]->(sl:seller)\
        where toLower(p.title) contains toLower($s) return p, sl.name limit 10", {s: req.body.search})
        .then(function(result){
            result.records.forEach(element => {
                properties = element.get('p').properties;
                seller = element.get('sl.name');
                arr.push(new example_base_prod(properties['id'], properties['title'], properties['img'], seller, properties['price'], properties['rating'].toFixed(2)));
            });
            res.render('base/browse', {
                pageTitle: 'Browse',
                path: '/base/browse',
                editing: false,
                prods: arr
            });
        });
};