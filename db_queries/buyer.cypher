// view product - without login
MATCH (p:product {id:pid})-[:prod_cat]->(c:category)
return c;

MATCH (p:product {id:pid})-[:prod_sell]->(s:seller)
RETURN p, s;

// view product - buyer
MATCH (p:product {id:pid})-[:prod_cat]->(c:category) RETURN c;
MATCH (p:product {id:pid})-[:prod_brand]->(b:brand) return b;
MATCH (p:product {id:pid})-[:prod_sell]->(s:seller) return p.title, s;
MATCH (p:product {id:pid})-[:also_bought]->(p1:product) return p1.title;
MATCH (p:product {id:pid})-[:also_viewed]->(p2:product) return p2.title;

MATCH (p3:product)-[v:view_history]->(b:buyer{id:"A1C6M8LCIX4M6M"}), (p:product {id:"000105001X"})
WHERE timestamp()-v.timestamp < 3600000
create (p)-[:also_viewed]->(p3) // updates the also_viewed of product
create (p)-[:view_history{timestamp:timestamp()}]->(b); // update view_history of user

// view cart - buyer
MATCH (p:product)-[c:cart]-(b:buyer{id:b1})
RETURN p,c
