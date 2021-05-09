const pool= require('../utils/database');
const Prod = require('../models/prod');

var randomstring = require("randomstring");

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

class example_cart_item {
    constructor(id, name, image, seller, cost, rating, quantity){
        this.id = id;
        this.name = name;
        this.image = image;
        this.seller = seller;
        this.cost = cost;
        this.rating = rating;
        this.quantity = quantity;
    }
}

class example_cart {
    constructor(uid, prod_list){
        this.uid = uid; // user id
        this.prods = prod_list;
    }
}

class example_order_short {
    constructor(oid, cost){
        this.orderid = oid;
        this.totalcost = cost;
    }
}

class example_order_long {
    constructor(orderid, totalcost, product_list){
        this.orderid = orderid;
        this.totalcost = totalcost;
        this.product_list = product_list;
    }
}

class example_buyer {
    constructor(uid, name, address, contact, mail, money){
        this.id = uid;
        this.name = name;
        this.address = address;
        this.contact = contact;
        this.mail = mail;
        this.balance = money;
    }
}

exports.get_browse = (req,res,next) => {
    arr = [];
    db_session
        .run("match (p:product)-[:prod_sell]->(s:seller) return p, s.name order by p.rating desc limit 15")
        .then(function(result){
            result.records.forEach(element => {
                properties = element.get('p').properties;
                seller = element.get('s.name');
                arr.push(new example_base_prod(properties['id'], properties['title'], properties['img'], seller, properties['price'], properties['rating'].toFixed(2)));
            });
            res.render('buyer/browse', {
                pageTitle: 'Browse',
                path: '/buyer/browse',
                editing: false,
                prods: arr
            });
        });
};

exports.get_cart = (req,res,next) => {
    arr = [];
    db_session
        .run("match (p:product)-[c:cart]->(b:buyer{id:$id}), (p)-[:prod_sell]->(s:seller) return p, s.name, c.quantity", {id: req.session.uid})
        .then(function(result){
            result.records.forEach(element => {
                properties = element.get('p').properties;
                seller = element.get('s.name');
                qty = element.get('c.quantity');
                arr.push(new example_cart_item(properties['id'], properties['title'], properties['img'], seller, properties['price'], properties['rating'].toFixed(2), qty));
            });
            res.render('buyer/cart', {
                pageTitle: 'Cart',
                path: '/buyer/cart',
                editing: false,
                cart: new example_cart(req.session.uid, arr)
            });
        });
};

exports.get_about = (req,res,next) => {
    arr = []
    res.render('buyer/about', {
        pageTitle: 'About',
        path: '/buyer/about',
        editing: false,
        prods: arr
    });
};

exports.get_recharge = (req,res,next) => {
    db_session
        .run("match (b:buyer{id:$id}) return b", {id: req.session.uid})
        .then(function(result){
            properties = result.records[0].get('b').properties;
            u = new example_buyer(properties['id'], properties['name'], properties['address'], properties['contact'], properties['mail'], properties['money']);
            res.render('buyer/recharge', {
                pageTitle: 'Recharge',
                path: '/buyer/recharge',
                editing: false,
                user: u
            });
        });
};

exports.get_history = (req,res,next) => {
    arr = [];
    db_session
        .run("MATCH (:buyer{id:$id})-[:buyer_order]->(o:order)-[:order_product]->(p:product) return o.o_id, sum(o.quantity*p.price) as cost", {id: req.session.uid})
        .then(function(result){
            result.records.forEach(element => {
                o_id = element.get('o.o_id');
                cost = element.get('cost');
                arr.push(new example_order_short(o_id, cost.toFixed(2)));
            });
            res.render('buyer/history', {
                pageTitle: 'Past Orders',
                path: '/buyer/history',
                editing: false,
                orders: arr
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
        where p.title contains $s return p, sl.name limit 10", {s: req.body.search})
        .then(function(result){
            result.records.forEach(element => {
                properties = element.get('p').properties;
                seller = element.get('sl.name');
                arr.push(new example_base_prod(properties['id'], properties['title'], properties['img'], seller, properties['price'], properties['rating'].toFixed(2)));
            });
            res.render('buyer/browse', {
                pageTitle: 'Browse',
                path: '/buyer/browse',
                editing: false,
                prods: arr
            });
        });
};

exports.post_recharge = (req,res,next) => {
    db_session
        .run("match (b:buyer{id:$id}) set b.money=b.money+$amount return b", {id: req.session.uid, amount: parseInt(req.body.amount)})
        .then(function(result){
            properties = result.records[0].get('b').properties;
            u = new example_buyer(properties['id'], properties['name'], properties['address'], properties['contact'], properties['mail'], properties['money']);
            res.render('buyer/recharge', {
                pageTitle: 'Recharge',
                path: '/buyer/recharge',
                editing: false,
                user: u
            });
        });
};

exports.post_placeorder = (req,res,next) => {
    var oid = randomstring.generate(7);
    db_session
        .run("match (p:product)-[c:cart]->(b:buyer{id:$bid})\
            return sum(p.price * c.quantity) as tc, b.money", {bid:req.session.uid})
        .then(function(result) {
            tc = result.records[0].get('tc');
            money = result.records[0].get('b.money');
            if (tc > money){
                res.redirect('/buyer/cart');
            }else{
                db_session
                .run("MATCH (p:product)-[c:cart]->(b:buyer{id:$bid})\
                    set b.money = b.money - $tc\
                    create (o:order{timestamp:timestamp(), o_id:$oid, status:\"requested\", quantity:c.quantity}),\
                    (b)-[:buyer_order]->(o)-[:order_product]->(p)\
                    DELETE c;", {bid: req.session.uid, oid:oid, tc:tc})
                .then(() => {
                    db_session
                        .run("match (b:buyer{id:$bid}), \
                            (b)-[:buyer_order]->(o1:order{o_id:$oid})-[:order_product]->(p1:product), \
                            (b)-[:buyer_order]->(o2:order)-[:order_product]->(p2:product)\
                            where o1.timestamp-o2.timestamp< 36000000 and o1.timestamp-o2.timestamp > 1000\
                            and p1.id <> p2.id\
                            MERGE (p1)<-[:also_bought]-(p2)", {bid: req.session.uid, oid:oid})
                        .then(() => {
                            arr = [];
                            db_session
                                .run("MATCH (:buyer{id:$id})-[:buyer_order]->(o:order)-[:order_product]->(p:product) return o.o_id, sum(o.quantity*p.price) as cost", {id: req.session.uid})
                                .then(function(result){
                                    result.records.forEach(element => {
                                        o_id = element.get('o.o_id');
                                        cost = element.get('cost');
                                        arr.push(new example_order_short(o_id, cost.toFixed(2)));
                                    });
                                    res.render('buyer/history', {
                                        pageTitle: 'Past Orders',
                                        path: '/buyer/history',
                                        editing: false,
                                        orders: arr
                                    });
                                });
                        });
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
                        }).then(() => {
                            db_session
                            .run("MATCH (b:buyer{id:$b1}), (p:product {id:$p1})\
                                create (p)-[:view_history{timestamp:timestamp()}]->(b);",
                                {b1:req.session.uid, p1: pid})
                            .then(function(result){
                                db_session
                                .run("MATCH (p3:product)-[v:view_history]->(b:buyer{id:$b1}), (p:product {id:$p1})\
                                    WHERE timestamp()-v.timestamp < 600000 and p3.id <> p.id\
                                    merge (p)-[:also_viewed]->(p3);",
                                    {b1:req.session.uid, p1: pid})
                                .then(() => {
                                    console.log("dddddddddddddddddddddddddddd");
                                    res.render('buyer/productdetails', {
                                        pageTitle: 'Product Details',
                                        path: '/buyer/productdetails',
                                        editing: false,
                                        product: product
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
};

exports.post_orderdetails = (req,res,next) => {
    arr = [];
    db_session
        .run("MATCH (o:order{o_id:$o_id, status:\"requested\"})-[:order_product]->(p:product)-[:prod_sell]->(s:seller)\
         return s.name, p, o, null as d\
         union\
         MATCH (o:order{o_id:$o_id})-[:order_product]->(p:product)-[:prod_sell]->(s:seller),\
         (o)<-[:del_order]-(d:del_personnel) return s.name, p, o, d\
         ", {o_id: req.body.o_id})
        .then(function(result){
            result.records.forEach(element => {
                order = element.get('o').properties;
                prod = element.get('p').properties;
                seller = element.get('s.name');
                var del_name, del_contact;
                if (element.get('d') == null){
                    del_name= '-';
                    del_contact = '-';
                }else{
                    del_name= element.get('d').properties['name'];
                    del_contact = element.get('d').properties['contact'];
                }
                arr.push(new example_prod_long(prod['id'], prod['title'], "", seller, prod['price'], order['status'], del_name,
                del_contact, order['rating'], "", order['quantity']));
            });
            res.render('buyer/orderdetails', {
                pageTitle: 'Order Details',
                path: '/buyer/orderdetails',
                editing: false,
                order: new example_order_long(req.body.o_id, req.body.totalcost, arr)
            });
        });
};

exports.post_removefromcart = (req,res,next) => {
    db_session
        .run("MATCH (p:product{id:$pid}), (b:buyer{id:$bid}) match (p)-[c:cart]->(b)\
        set p.quantity=p.quantity+c.quantity delete c;",
        {bid: req.session.uid, pid: req.body.pid})
        .then(() => {
            arr = [];
            db_session
                .run("match (p:product)-[c:cart]->(b:buyer{id:$id}), (p)-[:prod_sell]->(s:seller) return p, s.name, c.quantity", {id: req.session.uid})
                .then(function(result){
                    result.records.forEach(element => {
                        properties = element.get('p').properties;
                        seller = element.get('s.name');
                        qty = element.get('c.quantity');
                        arr.push(new example_cart_item(properties['id'], properties['title'], properties['img'], seller, properties['price'], properties['rating'].toFixed(2), qty));
                    });
                    res.render('buyer/cart', {
                        pageTitle: 'Cart',
                        path: '/buyer/cart',
                        editing: false,
                        cart: new example_cart(req.session.uid, arr)
                    });
                });
        });
};

exports.post_addtocart = (req,res,next) => {
    db_session
        .run("MATCH (p:product{id:$pid}), (b:buyer{id:$bid}) MERGE (p)-[c:cart]->(b)\
        ON CREATE SET c.quantity=$qty ON MATCH SET c.quantity=c.quantity + $qty set p.quantity=p.quantity-$qty;",
        {bid: req.session.uid, qty: parseInt(req.body.addtocart), pid: req.body.pid})
        .then(() => {
            arr = [];
            db_session
                .run("match (p:product)-[c:cart]->(b:buyer{id:$id}), (p)-[:prod_sell]->(s:seller) return p, s.name, c.quantity", {id: req.session.uid})
                .then(function(result){
                    result.records.forEach(element => {
                        properties = element.get('p').properties;
                        seller = element.get('s.name');
                        qty = element.get('c.quantity');
                        arr.push(new example_cart_item(properties['id'], properties['title'], properties['img'], seller, properties['price'], properties['rating'].toFixed(2), qty));
                    });
                    res.render('buyer/cart', {
                        pageTitle: 'Cart',
                        path: '/buyer/cart',
                        editing: false,
                        cart: new example_cart(req.session.uid, arr)
                    });
                });
        });
};

exports.post_rating = (req,res,next) => {
    db_session
        .run("MATCH (o:order{o_id:$oid})-[:order_product]->(p:product{id:$pid})\
        SET o.rating=$rating set p.rating = (p.rating*p.num_rating + $rating)/(p.num_rating+1) set p.num_rating=p.num_rating+1;",
        {oid: req.body.o_id, rating: parseInt(req.body.rating), pid: req.body.pid})
        .then(() => {
            arr = [];
            db_session
                .run("MATCH (o:order{o_id:$o_id, status:\"requested\"})-[:order_product]->(p:product)-[:prod_sell]->(s:seller)\
                return s.name, p, o, null as d\
                union\
                MATCH (o:order{o_id:$o_id})-[:order_product]->(p:product)-[:prod_sell]->(s:seller),\
                (o)<-[:del_order]-(d:del_personnel) return s.name, p, o, d\
                ", {o_id: req.body.o_id})
                .then(function(result){
                    result.records.forEach(element => {
                        order = element.get('o').properties;
                        prod = element.get('p').properties;
                        seller = element.get('s.name');
                        var del_name, del_contact;
                        if (element.get('d') == null){
                            del_name= '-';
                            del_contact = '-';
                        }else{
                            del_name= element.get('d').properties['name'];
                            del_contact = element.get('d').properties['contact'];
                        }
                        arr.push(new example_prod_long(prod['id'], prod['title'], "", seller, prod['price'], order['status'], del_name,
                        del_contact, order['rating'], "", order['quantity']));
                    });
                    res.render('buyer/orderdetails', {
                        pageTitle: 'Order Details',
                        path: '/buyer/orderdetails',
                        editing: false,
                        order: new example_order_long(req.body.o_id, req.body.totalcost, arr)
                    });
                });
        });
};