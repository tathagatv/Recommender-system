const pool= require('../utils/database');
const Prod = require('../models/prod');

/*class example_order {
    constructor(name, address, contact, mail){
        this.orderid = 1;
        this.customer_address = "Shaitan Gali, Khatra Mahal, Shamshaan ke Samne";
        this.customer_contact = "999998888222";
        this.cost = "432";
    }
}*/

class order {
    constructor(id, address, contact, tc){
        this.orderid = id;
        this.customer_address = address;
        this.customer_contact = contact;
        this.cost = tc;
    }
}

class order2 {
    constructor(id, tc){
        this.orderid = id;
        this.cost = tc;
    }
}

exports.get_ongoing = (req,res,next) => {
    db_session
        .run("match (d:del_personnel{id:$id})-[:del_order]->(o:order{status:\"shipped\"}) match (p:product)-[:order_product]->(o) \
              match (b:buyer)-[:order_buyer]->(o) with o.id as id,b,sum(o.quantity*p.price) as tc return id,tc,b.address,b.contact",{id: 1})
        .then(function(result){
            arr=[];
            for (i=0;i<result.records.length;i++){
                oid=result.records[i].get('id');
                address=result.records[i].get('b.address');
                contact=result.records[i].get('b.contact');
                tc=result.records[i].get('tc');
                arr.push(new order(oid,address,contact,tc));
            }
            res.render('delagent/ongoing', {
                pageTitle: 'Ongoing Orders',
                path: '/delagent/ongoing',
                editing: false,
                // prods: result.rows
                orders: arr
            });
        });
};

exports.get_delivered = (req,res,next) => {
    db_session
        .run("match (d:del_personnel{id:$id})-[:del_order]->(o:order{status:\"delivered\"}) match (p:product)-[:order_product]->(o) \
              with o.id as id,sum(o.quantity*p.price) as tc return id,tc",{id: 1})
        .then(function(result){
            arr=[];
            for (i=0;i<result.records.length;i++){
                oid=result.records[i].get('id');
                tc=result.records[i].get('tc');
                arr.push(new order2(oid,tc));
            }
            res.render('delagent/delivered', {
                pageTitle: 'Cart',
                path: '/delagent/delivered',
                editing: false,
                // prods: result.rows
                orders: arr
            });
        });
};

exports.get_about = (req,res,next) => {
    res.render('delagent/about', {
        pageTitle: 'About',
        path: '/delagent/about',
        editing: false,
        // prods: result.rows
    });
};

exports.post_sort = (req,res,next) => {
    return;
};

exports.post_setasdelivered = (req,res,next) => {
    var oid = req.body.setasdelivered;
    db_session
        .run("match (d:del_personnel{id:$id})-[:del_order]->(o:order{id:oid,status:\"shipped\"}) \
              set o.status=\"delivered\"\
              set d.active=d.active-1\
              set d.delivered=d.delivered+1",{id:1,o_id:oid})
        .then(function(result){
            res.redirect('/seller/delivered');
        });
    return;
};