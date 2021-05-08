const pool= require('../utils/database');
const Prod = require('../models/prod');

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
        .run("match (d:del_personnel{id:$id})-[:del_order]->(o:order{status:\"shipped\"}) match (p:product)<-[:order_product]-(o) \
              match (b:buyer)-[:buyer_order]->(o) with o.o_id as id,b,sum(o.quantity*p.price) as tc return id,tc,b.address,b.contact",{id: req.session.uid})
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
                orders: arr
            });
        });
};

exports.get_delivered = (req,res,next) => {
    db_session
        .run("match (d:del_personnel{id:$id})-[:del_order]->(o:order{status:\"delivered\"}) match (p:product)<-[:order_product]-(o) \
              with o.o_id as id,sum(o.quantity*p.price) as tc return id,tc",{id: req.session.uid})
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
                orders: arr
            });
        });
};

exports.get_about = (req,res,next) => {
    res.render('delagent/about', {
        pageTitle: 'About',
        path: '/delagent/about',
        editing: false,
    });
};

exports.post_sort = (req,res,next) => {
    return;
};

exports.post_setasdelivered = (req,res,next) => {
    var oid = req.body.setasdelivered;
    db_session
        .run("match (d:del_personnel{id:$id})-[:del_order]->(o:order{o_id:$o_id,status:\"shipped\"}) \
              set o.status=\"delivered\"\
              set d.active=d.active-1\
              set d.delivered=d.delivered+1",{id:req.session.uid,o_id:oid})
        .then(function(result){
            res.redirect('/delagent/delivered');
        });
    return;
};