const Prod = require('../models/prod');
var sel_id_cnt=2;
var del_id_cnt=2;
/*class example_base_prod {
    constructor(){
        this.id = 1;
        this.name = "BG";
        this.image = "https://www.cse.iitb.ac.in/~bhaskargupta/def.jpeg";
        this.seller = "Tathagat";
        this.cost = 150;
        this.rating = 5;
        this.category = "Randi";
    }
}*/

class base_prod{
    constructor(id,name, image, cost, seller, rating, quantity, description){
        this.id = id;
        this.name = name;
        this.image = image;
        this.cost = cost;
        this.seller = seller;
        this.rating = rating.toFixed(2);
        this.quantity = quantity;
        this.description = description;
    }
}

function prod_p(rec,seller){
    return new base_prod(rec['id'],rec['title'],rec['img'],rec['price'], seller, rec['rating'],rec['quantity'],rec['description']);
}

/*class example_buyer {
    constructor(name, address, contact, mail){
        this.id = 1;
        this.name = "Dolly";
        this.address = "Shaitan Gali, Khatra Mahal, Shamshaan ke Samne";
        this.contact = "8881212";
        this.mail = "dololol@gmail.com";
        this.balance = 210983;
    }
}*/

class buyer {
    constructor(id,name, address, contact, mail,balance){
        this.id = id;
        this.name = name;
        this.address = address;
        this.contact = contact;
        this.mail = mail;
        this.balance = balance;
    }
}

function prod_b(rec){
    return new buyer(rec['id'],rec['name'],rec['address'],rec['contact'],rec['mail'],rec['money']);
}

/*class example_seller {
    constructor(name, address, contact, mail){
        this.id = 1;
        this.name = "Dolly_sell";
        this.address = "Seller Shaitan Gali, Khatra Mahal, Shamshaan ke Samne";
        this.contact = "0008881212";
        this.mail = "seldololol@gmail.com";
    }
}*/

class seller {
    constructor(id,name, address, contact, mail){
        this.id = id;
        this.name = name;
        this.address = address;
        this.contact = contact;
        this.mail = mail;
    }
}

function prod_s(rec){
    return new seller(rec['id'],rec['name'],rec['address'],rec['contact'],rec['mail']);
}

/*class example_delagents {
    constructor(name, address, contact, mail){
        this.id = 1;
        this.name = "Dolly_del";
        this.address = "Dell Shaitan Gali, Khatra Mahal, Shamshaan ke Samne";
        this.contact = "44408881212";
        this.mail = "deldololol@gmail.com";
        this.num_delivered = 40;
        this.num_active = 3;
    }
}*/

class delagents {
    constructor(id,name, contact, mail,n1,n2){
        this.id = id;
        this.name = name;
        this.contact = contact;
        this.mail = mail;
        this.num_delivered = n1;
        this.num_active = n2;
    }
}

function prod_d(rec){
    return new delagents(rec['id'],rec['name'],rec['contact'],rec['mail'],rec['delivered'],rec['active']);
}

exports.get_browse = (req,res,next) => {
    db_session
    .run("match (p:product)-[:prod_sell]->(s:seller) return p,s.name",{})
    .then(function(result){
        arr=[]
        for (i=0;i<result.records.length;i++){
            arr.push(prod_p(result.records[i].get('p').properties,result.records[i].get('s.name')));
        }
        res.render('admin/browse', {
            pageTitle: 'Browse',
            path: '/admin/browse',
            editing: false,
            prods: arr
        });
    });
};

exports.get_buyers = (req,res,next) => {
    db_session
    .run("match (b:buyer) return b",{})
    .then(function(result){
        arr=[]
        for (i=0;i<result.records.length;i++){
            arr.push(prod_b(result.records[i].get('b').properties));
        }
        res.render('admin/buyers', {
            pageTitle: 'Buyers',
            path: '/admin/buyers',
            editing: false,
            buyers: arr
        });
    });
};

exports.get_sellers = (req,res,next) => {
    db_session
    .run("match (s:seller) return s",{})
    .then(function(result){
        arr=[]
        for (i=0;i<result.records.length;i++){
            arr.push(prod_s(result.records[i].get('s').properties));
        }
        res.render('admin/sellers', {
            pageTitle: 'Sellers',
            path: '/admin/sellers',
            editing: false,
            sellers: arr
        });
    });
};

exports.get_delagents = (req,res,next) => {
    db_session
    .run("match (d:del_personnel) return d",{})
    .then(function(result){
        arr=[]
        for (i=0;i<result.records.length;i++){
            arr.push(prod_d(result.records[i].get('d').properties));
        }
        res.render('admin/delagents', {
            pageTitle: 'Delivery Agents',
            path: '/admin/delagents',
            editing: false,
            delagents: arr
        });
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

exports.get_about = (req,res,next) => {
    res.render('admin/about', {
        pageTitle: 'About',
        path: '/admin/about',
        editing: false
    });
};

exports.post_add_seller = (req,res,next) => {
    var name = req.body.name;
	var uname = req.body.uname;
    var psw = req.body.psw;
    var address = req.body.address;
    var contact = req.body.contact;
    var mail = req.body.mail;

    db_session
        .run("merge (s:seller{id:$id,name:$na,username:$un,password:$pw,address:$ad,contact:$co,mail:$ma})",
            {id:sel_id_cnt,na:name,un:uname,pw:psw,ad:address,co:contact,ma:mail})
        .then(function(result){
            sel_id_cnt+=1;
            res.redirect('/admin/sellers');
        });
    return
};

exports.post_add_delagent = (req,res,next) => {
    var name = req.body.name;
	var uname = req.body.uname;
    var psw = req.body.psw;
    var contact = req.body.contact;
    var mail = req.body.mail;

    db_session
        .run("merge (d:del_personnel{id:$id,name:$na,username:$un,password:$pw,contact:$co,mail:$ma,delivered:$n1,active:$n2})",
            {id:del_id_cnt,na:name,un:uname,pw:psw,co:contact,ma:mail,n1:0,n2:0})
        .then(function(result){
            del_id_cnt+=1;
            res.redirect('/admin/delagents');
        });
    return
};

exports.post_sort = (req,res,next) => {
    return
};