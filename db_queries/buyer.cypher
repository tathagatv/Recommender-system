// view product - without login
MATCH (p:product {id:pid})-[:prod_cat]->(c:category)
return c;

MATCH (p:product {id:pid})-[:prod_sell]->(s:seller)
RETURN p, s;

// view product - buyer
MATCH (p:product {id:pid})-[:prod_cat]->(c:category) RETURN c;
MATCH (p:product {id:pid})-[:prod_brand]->(b:brand) return b;
MATCH (p:product {id:pid})-[:prod_sell]->(s:seller) return p, s;
MATCH (p:product {id:pid})-[:also_bought]->(p1:product) return p1;
MATCH (p:product {id:pid})-[:also_viewed]->(p2:product) return p2;

MATCH (p3:product)-[v:view_history]->(b:buyer{id:b1}), (p:product {id:p1})
WHERE timestamp()-v.timestamp < 3600000
create (p)-[:also_viewed]->(p3) // updates the also_viewed of product
create (p)-[:view_history{timestamp:timestamp()}]->(b); // update view_history of user

// view cart - buyer
MATCH (p:product)-[c:cart]->(b:buyer{id:bid})
RETURN p ,c;

// add to cart - buyer
MATCH (p:product{id:"0000004545"}), (b:buyer{id:"AA"})
MERGE (p)-[c:cart]->(b)
ON CREATE SET c.quantity=3
ON MATCH SET c.quantity=c.quantity + 3;

// remove from cart - buyer
MATCH (p:product{id:pid})-[c:cart]->(b:buyer{id:bid})
DELETE c;

// place order - buyer
MATCH (p:product)-[c:cart]->(b:buyer{id:"AA"})
create (o:order{timestamp:timestamp(), o_id:101, status:"requested", quantity:c.quantity}),
(b)-[:buyer_order]->(o)-[:order_product]->(p)
DELETE c
with b, o
MATCH (b)-[:buyer_order]->(o2:order)
WHERE o.timestamp-o2.timestamp< 36000000 and o.timestamp-o2.timestamp > 1000
MATCH (o2)-[:order_product]->(p2:product)
MERGE (p)-[:also_bought]->(p2); // updates the also_bought of product

// view order history - buyer
MATCH (:buyer{id:"AA"})-[:buyer_order]->(o:order)-[:order_product]->(p:product)
RETURN o, p;

// give rating - buyer
MATCH (o:order{o_id:order_id})-[:order_product]->(p:product{id:pid})
SET p.rating=(p.rating*p.numRating+r)/(p.numRating+1)
SET p.numRating=p.numRating+1;

// add money - buyer
MATCH (b:buyer{id:bid})
SET b.money=b.money+23;
