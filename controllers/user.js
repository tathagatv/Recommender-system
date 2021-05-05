const pool= require('../utils/database');
const Prod = require('../models/prod');


exports.get_prod = (req,res,next) => {
    pool.query('SELECT * FROM products ORDER BY id;', function(err, result) {
        res.render('user/prods', {
            pageTitle: 'Products',
            path: '/user/prods',
            editing: false,
            prods: result.rows
    })});
};

exports.post_prod = (req,res,next) => {
    const prod_id = req.body.product_id;
    var quant = 0;
    var quan_q = pool.query('SELECT quantity FROM products WHERE id = $1',[prod_id]);
    quan_q.then(
        res1 => {
            quant = res1.rows[0].quantity;
            if (quant == 0) {
                res.redirect("/prods");
            }else {
                pool
                .query('UPDATE products SET quantity=quantity-1 WHERE id = $1;', [prod_id])
                .then(
                    res3 => {
                        pool.query('SELECT COUNT(quantity) as cnt FROM cart WHERE item_id = $1', [prod_id])
                        .then(
                            res4 => {
                                if (res4.rows[0].cnt == 0) {
                                    pool.query('INSERT INTO cart(user_id, item_id, quantity) VALUES ($1,$2,$3)', [1,prod_id, 1]);
                                } else{
                                    pool.query('UPDATE cart SET quantity=quantity+1 WHERE item_id = $1 AND user_id = $2;',[prod_id, 1]);
                                }
                            }
                        );
                    }
                );
                res.redirect("/cart");
            }
        }
    )
    .catch(err => console.log(err));
};

exports.get_orders = (req,res,next) => {
    pool.query('SELECT title, price, orders.quantity, image FROM orders, products WHERE orders.item_id = products.id ORDER BY products.id;', function(err, result) {
        res.render('user/orders', {
            pageTitle: 'Orders',
            path: '/user/orders',
            editing: false,
            orders: result.rows
    })});
};

exports.get_cart = (req,res,next) => {
    var cred = 0;
    pool.query('SELECT credit FROM users WHERE user_id = $1',[1])
    .then(
        async(res1) => {
            cred = res1.rows[0].credit;
            await pool.query('SELECT title, price, cart.quantity, image FROM cart, products WHERE cart.item_id = products.id ORDER BY products.id;', function(err, result) {
                res.render('user/cart', {
                    pageTitle: 'Cart',
                    path: '/user/cart',
                    editing: false,
                    carts: result.rows,
                    credits: cred
            })});
        }
    )
};

exports.post_cart = (req,res,next) => {
    const prod_id = req.body.product_id;
    var cred = 0;
    var cost = 0;
    pool.query('SELECT credit FROM users WHERE user_id = $1',[1])
    .then(
        res1 => {
            cred = res1.rows[0].credit;
            pool.query('SELECT COALESCE(SUM(price*cart.quantity),0) as mrp FROM cart LEFT OUTER JOIN products ON(cart.item_id = products.id)')
            .then(
                async(res2) => {
                    cost = res2.rows[0].mrp;
                    if (cost > cred){
                        res.redirect("/cart");
                    } else {
                        await pool.query('UPDATE orders SET quantity=(orders.quantity + COALESCE((SELECT quantity FROM cart WHERE cart.item_id = orders.item_id), 0))');
                        await pool.query('INSERT into orders(item_id, user_id, quantity) (SELECT item_id, user_id, quantity FROM cart WHERE item_id NOT IN (SELECT item_id FROM orders))');
                        await pool.query('DELETE from cart;');
                        await pool.query('UPDATE users SET credit=credit-$1;',[cost]);
                        res.redirect("/orders");
                    }
                }
            )
        }
    );
};