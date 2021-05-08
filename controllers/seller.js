const pool= require('../utils/database');
const Prod = require('../models/prod');
var randomstring = require("randomstring");

class base_prod{
    constructor(id,name, image, cost, rating, quantity, description){
        this.id = id;
        this.name = name;
        this.image = image;
        this.cost = cost;
        this.rating = rating.toFixed(2);
        this.quantity = quantity;
        this.description = description;
    }
}
function prod(rec){
    return new base_prod(rec['id'],rec['title'],rec['img'],rec['price'],rec['rating'],rec['quantity'],rec['description']);
}

class past_order {
    constructor(oid,pl,ql,cl,tc,buyer){
        this.orderid = oid;
        this.productlist = pl;
        this.quantitylist = ql;
        this.costlist = cl;
        this.totalcost = tc;
        this.buyer = buyer;
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
    db_session
        .run("match (p:product)-[:prod_sell]->(s:seller{id: $id}) return p limit 100",{id: req.session.uid})
        .then(function(result){
            arr=[];
            for (i=0;i<result.records.length;i++){
                arr.push(prod(result.records[i].get('p').properties));
            }
            res.render('seller/onsale', {
                pageTitle: 'On Sale',
                path: '/seller/onsale',
                editing: false,
                prods: arr
            });
        });
};

exports.get_about = (req,res,next) => {
    arr = []
    res.render('seller/about', {
        pageTitle: 'About',
        path: '/seller/about',
        editing: false,
        prods: arr
    });
};

exports.get_addnew = (req,res,next) => {
    arr = [];
    res.render('seller/addnew', {
        pageTitle: 'Add New',
        path: '/seller/addnew',
        editing: false,
        prods: arr
    });
};

exports.get_past = (req,res,next) => {
    db_session
        .run("match (p:product)-[:prod_sell]->(s:seller{id: $id}) match (p)<-[:order_product]-(o:order{status:\"delivered\"})\
              match (b:buyer)-[:buyer_order]->(o) return o.o_id,b.name,p,o.quantity order by o.o_id",{id: req.session.uid})
        .then(function(result){
            arr=[];
            pl=[];
            ql=[];
            cl=[];
            tc=0;
            var loid=-1;
            for (i=0;i<result.records.length;i++){
                oid=result.records[i].get('o.o_id');
                prop=result.records[i].get('p').properties;
                qty=result.records[i].get('o.quantity');
                buyer=result.records[i].get('b.name');
                if(oid===loid){
                    pl.push(prop['title']);
                    ql.push(qty);
                    cl.push(prop['price']);
                    tc+=(prop['price']*qty);
                }else{
                    if(i===0){
                        //do nothing
                    }else{
                        arr.push(new past_order(oid,pl,ql,cl,tc,buyer));
                    }
                    pl=[prop['title']];
                    ql=[qty];
                    cl=[prop['price']];
                    tc=prop['price']*qty;
                }
                loid=oid;
            }
            if(result.records.length>0){
                arr.push(new past_order(oid,pl,ql,cl,tc,buyer));
            }
            res.render('seller/past', {
                pageTitle: 'Past Orders',
                path: '/seller/past',
                editing: false,
                orders: arr
            });
        });
};

exports.get_requests = (req,res,next) => {
    db_session
        .run("match (p:product)-[:prod_sell]->(s:seller{id: $id}) match (p)<-[:order_product]-(o:order{status:\"requested\"})\
              match (b:buyer)-[:buyer_order]->(o) return o.o_id,b.name,p,o.quantity order by o.o_id",{id: req.session.uid})
        .then(function(result){
            arr=[];
            pl=[];
            ql=[];
            cl=[];
            tc=0;
            var loid=-1;
            for (i=0;i<result.records.length;i++){
                oid=result.records[i].get('o.o_id');
                prop=result.records[i].get('p').properties;
                qty=result.records[i].get('o.quantity');
                buyer=result.records[i].get('b.name');
                if(oid===loid){
                    pl.push(prop['title']);
                    ql.push(qty);
                    cl.push(prop['price']);
                    tc+=(prop['price']*qty);
                }else{
                    if(i===0){
                        //do nothing
                    }else{
                        arr.push(new past_order(loid,pl,ql,cl,tc,buyer));
                    }
                    pl=[prop['title']];
                    ql=[qty];
                    cl=[prop['price']];
                    tc=prop['price']*qty;
                }
                loid=oid;
            }
            if(result.records.length>0){
                arr.push(new past_order(oid,pl,ql,cl,tc,buyer));
            }
            res.render('seller/requests', {
                pageTitle: 'Order Requests',
                path: '/seller/requests',
                editing: false,
                orders: arr
            });
        });
};

exports.get_ongoing = (req,res,next) => {
    db_session
        .run("match (p:product)-[:prod_sell]->(s:seller{id: $id}) match (p)<-[:order_product]-(o:order{status:\"shipped\"})\
              match (b:buyer)-[:buyer_order]->(o) return o.o_id,b.name,p,o.quantity order by o.o_id",{id: req.session.uid})
        .then(function(result){
            arr=[];
            pl=[];
            ql=[];
            cl=[];
            tc=0;
            var loid=-1;
            for (i=0;i<result.records.length;i++){
                oid=result.records[i].get('o.o_id');
                prop=result.records[i].get('p').properties;
                qty=result.records[i].get('o.quantity');
                buyer=result.records[i].get('b.name');
                if(oid===loid){
                    pl.push(prop['title']);
                    ql.push(qty);
                    cl.push(prop['price']);
                    tc+=(prop['price']*qty);
                }else{
                    if(i===0){
                        //do nothing
                    }else{
                        arr.push(new past_order(oid,pl,ql,cl,tc,buyer));
                    }
                    pl=[prop['title']];
                    ql=[qty];
                    cl=[prop['price']];
                    tc=prop['price']*qty;
                }
                loid=oid;
            }
            if(result.records.length>0){
                arr.push(new past_order(oid,pl,ql,cl,tc,buyer));
            }
            res.render('seller/ongoing', {
                pageTitle: 'Ongoing Orders',
                path: '/seller/ongoing',
                editing: false,
                orders: arr
            });
        });
};

exports.post_addnew = (req, res, next) => {
    var name= req.body.pname;
    var price= req.body.cost;
    var brand= req.body.brand;
    var category= req.body.category;
    var description= req.body.description;
    var quantity= req.body.quantity;
    var image= req.body.image;
    db_session
        .run("merge (p:product{id:$id, price:$pr, description:$dr, quantity:$qu, img:$im, \
        title:$na, rating:2.5, num_rating:1}) merge (c:category{name:$ca}) merge (b:brand{name:$br})\
        with p,c,b match (s:seller{id:$id1})\
        create (p)-[:prod_cat]->(c) create (p)-[:prod_brand]->(b) create (p)-[:prod_sell]->(s)",
        {id:randomstring.generate(7), pr:price, dr:description, qu:quantity, im:image, na:name,
        ca:category, br:brand, id1:req.session.uid})
        .then(function(result){
            res.redirect('/seller/onsale');
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
        RETURN p, sl.name limit 5\
        union match (p:product)-[:prod_sell]->(sl:seller)\
        where p.title contains $s return p, sl.name limit 10", {s: req.body.search})
        .then(function(result){
            result.records.forEach(element => {
                properties = element.get('p').properties;
                seller = element.get('sl.name');
                arr.push(new base_prod(properties['id'], properties['title'], properties['img'], properties['price'], properties['rating'], properties['quantity']));
            });
            res.render('seller/onsale', {
                pageTitle: 'On sale',
                path: '/seller/onsale',
                editing: false,
                prods: arr
            });
        });
};
exports.post_ship = (req,res,next) => {
    var oid = req.body.ship;
    console.log(oid);
    db_session
        .run("match (p:product)-[:prod_sell]->(s:seller{id:$id}) match (p)<-[:order_product]-(o:order{o_id:$o_id,status:\"requested\"}) set o.status=\"shipped\" \
              with o match (d:del_personnel) with d, o, min(d.active) as m1 create (d)-[:del_order]->(o) set d.active=d.active+1",{id:req.session.uid,o_id:oid})
        .then(function(result){
            res.redirect('/seller/ongoing');
        });
};

exports.post_openup = (req,res,next) => {
    product = new example_prod_long();
    pid = req.body.pid;
    console.log('prod id = '+ pid);
    db_session
        .run("MATCH (p:product{id:$pid})-[:also_bought]->(p2:product)-[:prod_sell]->(s:seller) return p2, s.name", {pid: pid})
        .then(function(result){
            also_bought = [];
            result.records.forEach(element => {
                p = element.get('p2').properties;
                seller = element.get('s.name');
                also_bought.push(new example_base_prod(p['id'], p['title'], p['img'], seller, p['price'], p['rating'].toFixed(2)));
            });
            product.also_bought = also_bought;
        }).then(() => {db_session
            .run("MATCH (p:product{id:$pid})-[:also_viewed]->(p2:product)-[:prod_sell]->(s:seller) return p2, s.name", {pid: pid})
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
                    console.log(p);
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
                            res.render('seller/productdetails', {
                                pageTitle: 'Product Details',
                                path: '/seller/productdetails',
                                editing: false,
                                product: product
                            });
                        });
                    });
                });
            });
        });
    p = new example_base_prod();
    p = new example_prod_long(p);
};