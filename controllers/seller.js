const pool= require('../utils/database');
const Prod = require('../models/prod');
var prod_id_cnt=1;
/*class example_base_prod {
    constructor(name, image, seller, cost, rating, category){
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
}*/
class base_prod{
    constructor(id,name, image, cost, rating, quantity, description){
        this.id = id;
        this.name = name;
        this.image = image;
        this.cost = cost;
        this.rating = rating;
        this.quantity = quantity;
        this.description = description;
    }
}
function prod(rec){
    return new base_prod(rec['id'],rec['title'],rec['img'],rec['price'],rec['rating'],rec['quantity'],rec['description']);
}

/*
class example_past_order {
    constructor(){
        this.orderid = 1;
        this.productlist = ["laptop", "Grinder", "AK47", "nail cutter", "jello"];
        this.quantitylist = [1,2,743,1,8]
        this.costlist = [44000, 1400, 8930, 23, 65]
        this.totalcost = 88654;
        this.buyer = "Taliban";
    }
}*/

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
        .run("match (p:product)-[:prod_sell]->(s:seller{id: $id}) return p",{id: 1})
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
    db_session
        .run("match (p:product)-[:prod_sell]->(s:seller{id: $id}) match (p)-[:order_product]->(o:order{status:\"delivered\"})\
              match (b:buyer)-[:buyer_order]->(o) return o.id,b.name,p,o.quantity order by o.id",{id: 1})
        .then(function(result){
            arr=[];
            pl=[];
            ql=[];
            cl=[];
            tc=0;
            var loid=-1;
            for (i=0;i<result.records.length;i++){
                oid=result.records[i].get('o.id');
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
                // prods: result.rows
                orders: arr
            });
        });
};

exports.get_requests = (req,res,next) => {
    db_session
        .run("match (p:product)-[:prod_sell]->(s:seller{id: $id}) match (p)-[:order_product]->(o:order{status:\"requested\"})\
              match (b:buyer)-[:buyer_order]->(o) return o.id,b.name,p,o.quantity order by o.id",{id: 1})
        .then(function(result){
            arr=[];
            pl=[];
            ql=[];
            cl=[];
            tc=0;
            var loid=-1;
            for (i=0;i<result.records.length;i++){
                oid=result.records[i].get('o.id');
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
            res.render('seller/requests', {
                pageTitle: 'Order Requests',
                path: '/seller/requests',
                editing: false,
                // prods: result.rows
                orders: arr
            });
        });
};

exports.get_ongoing = (req,res,next) => {
    db_session
        .run("match (p:product)-[:prod_sell]->(s:seller{id: $id}) match (p)-[:order_product]->(o:order{status:\"shipped\"})\
              match (b:buyer)-[:buyer_order]->(o) return o.id,b.name,p,o.quantity order by o.id",{id: 1})
        .then(function(result){
            arr=[];
            pl=[];
            ql=[];
            cl=[];
            tc=0;
            var loid=-1;
            for (i=0;i<result.records.length;i++){
                oid=result.records[i].get('o.id');
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
                // prods: result.rows
                orders: arr
            });
        });
};

exports.post_sort = (req,res,next) => {
    return;
};

exports.post_addnew = (req,res,next) => {
    var oid = req.body.ship;
    db_session
        .run("match (p:product)-[:prod_sell]->(s:seller{id:$id}) match (p)-[:order_product]->(o:order{id:$o_id,status:\"requested\"}) set o.status=\"shipped\" \
              with o match (d:del_personnel) with d,min(d.active) as m1 create (d)-[:del_order]->(o) set d.active=d.active+1",{id:1,o_id:oid})
        .then(function(result){
            res.redirect('/seller/ongoing');
        });
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