// add seller, admin and del_personnel
CREATE (u:seller{id:1, username:"a", password:"a"});
CREATE (u:admin{id:1, username:"a", password:"a"});
CREATE (u:del_personnel{id:1, username:"a", password:"a"});
// assign the same seller to all products
MATCH (p:product), (s:seller) CREATE (p)-[:prod_sell]->(s);

// CREATE INDEX IF NOT EXISTS FOR (p:product) on (p.id);
// CREATE INDEX IF NOT EXISTS FOR (c:category) on (c.name);
// CREATE INDEX IF NOT EXISTS FOR (b:brand) on (b.name);


// initialize product ratings randomly
match (p:product) set p.rating=rand()*5, p.numRating=tointeger(rand()*100);
// initialize buyer data
match (b:buyer) set b.money=0, b.username=apoc.text.random(10), b.password=apoc.text.random(10);