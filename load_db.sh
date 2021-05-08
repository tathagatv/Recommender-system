neo4j_username="neo4j"
neo4j_passwd="12345"
neo4j_db="neo4j"

for file in product_data init
do
    ./neo4j-community-4.2.4/bin/cypher-shell.bat -u $neo4j_username -p $neo4j_passwd -d $neo4j_db -f db_queries/$file.cypher
done