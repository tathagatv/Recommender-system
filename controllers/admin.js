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
    .run("match (p:product)-[:prod_sell]->(s:seller) return p,s.name limit 200")
    .then(function(result){
        arr=[];
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
        arr=[];
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
        arr=[];
        result.records.forEach((rec) => {
            arr.push(prod_s(rec.get('s').properties));
        });
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
        arr=[];
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
        ['SNiraj', 330],
        ['SShivam', 130],
        ['STathagat', 31],
        ['SBhaskar', 33],
        ];
    var topdelagents = [
        ['DNiraj', 76],
        ['DShivam', 32],
        ['DTathagat', 12],
        ['DBhaskar', 4],
        ];
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
      ];
    db_session
      .run("match (o:order) return o.timestamp/31540000000+1970 as yr, count(*) as fr")
      .then(function(result){
        //   result.records --> orders_per_year
        db_session
            .run("match (b:buyer)-[:buyer_order]->(o:order) return b.name, count(*) as cnt\
            order by cnt desc limit 4") // for top buyers
            .then(function(result) {
                topbuyers = [];
                result.records.forEach((rec) => {
                    topbuyers.push([rec.get('b.name'), rec.get('cnt')]);
                })
            })
            .then(() => {
                db_session
                    .run("match (o:order)-[:order_product]->(p:product)-[:prod_sell]->(s:seller)\
                    return s.name, count(*) as cnt order by cnt desc limit 4") // for top sellers
                    .then(function(result) {
                        topratedsellers = [];
                        result.records.forEach((rec) => {
                            topratedsellers.push([rec.get('s.name'), rec.get('cnt')]);
                        })
                    })
                    .then(() => {
                        db_session
                            .run("match (c:category)-[:prod_cat]-(p:product) return c.name, count(*) as cnt\
                            order by cnt desc limit 12;")
                            .then(function(result){
                                list_of_tuples = [['Category', 'Product count']];
                                for(i=2; i<result.records.length; i++){
                                    var rec = result.records[i];
                                    list_of_tuples.push([rec.get('c.name'), parseInt(rec.get('cnt'))]);
                                }
                            })
                            .then(() => {
                                db_session
                                    .run("match (d:del_personnel) return d.name, d.delivered as cnt order by cnt desc limit 4")
                                    .then((result) => {
                                        topdelagents = [];
                                        result.records.forEach((rec) => {
                                            topdelagents.push([rec.get('d.name'), rec.get('cnt')]);
                                        });
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
                                    })
                            });
                    });
            });
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
            {id: randomstring.generate(4), na: name, un: uname, pw: psw, ad: address, co: contact, ma: mail})
        .then(function(result){
            res.redirect('/admin/sellers');
        });
};

exports.post_add_delagent = (req,res,next) => {
    var name = req.body.name;
	var uname = req.body.uname;
    var psw = req.body.psw;
    var contact = req.body.contact;
    var mail = req.body.mail;

    db_session
        .run("merge (d:del_personnel{id:$id,name:$na,username:$un,password:$pw,contact:$co,mail:$ma,delivered:0,active:0})",
            {id:randomstring.generate(5), na:name,un:uname,pw:psw,co:contact,ma:mail})
        .then(function(result){
            res.redirect('/admin/delagents');
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
        where p.title contains $s return p, sl.name limit 10", {s: req.body.search})
        .then(function(result){
            result.records.forEach(element => {
                properties = element.get('p').properties;
                seller1 = element.get('sl.name');
                arr.push(new example_base_prod(properties['id'], properties['title'], properties['img'], seller1, properties['price'], properties['rating'].toFixed(2)));
            });
            res.render('admin/browse', {
                pageTitle: 'Browse',
                path: '/admin/browse',
                editing: false,
                prods: arr
            });
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
                            res.render('admin/productdetails', {
                                pageTitle: 'Product Details',
                                path: '/admin/productdetails',
                                editing: false,
                                product: product
                            });
                        });
                    });
                });
            });
        });

};