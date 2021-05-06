import os
import json
import gzip
import csv
import argparse

data_dir = 'amazon_data'
main_categories = [
    'Books',
    'Electronics',
]

try:
    os.mkdir(data_dir)
except:
    pass

## download metadata
amazon_metadata_url = 'http://deepyeti.ucsd.edu/jianmo/amazon/metaFiles/'
print('\ndownloading metadata-------------')
for cat in main_categories:
    f_name = 'meta_%s.json.gz' % cat
    f_path = os.path.join(data_dir, f_name)
    if os.path.isfile(f_path):
        print('\n%s metadata exists - %s' % (cat, f_path))
    else:
        print('\nDownloading %s metadata' % cat)
        os.system('wget -O %s %s%s' % (f_path, amazon_metadata_url, f_name))
        print('\nDownloaded %s metadata - %s' % (cat, f_path))

## download ratings
amazon_ratingdata_url = 'http://deepyeti.ucsd.edu/jianmo/amazon/categoryFilesSmall/'
print('\ndownloading rating data-------------')
for cat in main_categories:
    f_name = '%s.csv' % cat
    f_path = os.path.join(data_dir, f_name)
    if os.path.isfile(f_path):
        print('\n%s rating data exists - %s' % (cat, f_path))
    else:
        print('\nDownloading %s metadata' % cat)
        os.system('wget -O %s %s%s' % (f_path, amazon_ratingdata_url, f_name))
        print('\nDownloaded %s review data - %s' % (cat, f_path))


product_cypher_file = 'product_data.cypher'
user_cypher_file = 'user_data.cypher'
usd_inr = 72.36
default_price = 100.0
num_products = 1e4
num_rating = 1e4

def add_product(cat):
    metadata_path = os.path.join(data_dir, 'meta_%s.json.gz' % cat)
    with gzip.open(metadata_path) as f:
        g = open(product_cypher_file, 'a')
        i = 0
        for l in f:
            i += 1
            data = json.loads(l.strip())

            ## clean data

            ## title, brand
            data['title'] = data['title'].replace('"', ' ')
            data['brand'] = data['brand'].replace('"', ' ')


            ## description
            if len(data['description'])>0:
                data['description'] = data['description'][0].replace('"', ' ') ## take only the 1st description
            else:
                data['description'] = ''

            ## image
            if len(data['image']) > 0:
                data['image'] = data['image'][0]
            else:
                data['image'] = ''
        
            ## price
            data['price'] = data['price'].replace(',','')
            if data['price'] == '':
                data['price'] = default_price
            else:
                if data['price'][0] != '$':
                    data['price'] = default_price
                else:
                    try:
                        data['price'] = float(data['price'][1:]) * usd_inr
                    except:
                        data['price'] = default_price

            
            query = 'CREATE (p:product {'
            query += 'id:"%s", title:"%s", price:%.2f, description:"%s", rating:%.2f, num_rating:%d, img:"%s"' % \
            (data['asin'], data['title'], data['price'], data['description'], 0, 0, data['image'])
            query += '})\n'

            ## brand node and edge
            query += 'MERGE (b:brand {name:"%s"%s) ' % (data['brand'], '}')
            query += 'CREATE (p)-[:prod_brand]->(b);\n'

            ## category nodes and edges
            for c in data['category']:
                c_cleaned = c.replace('"', '\\"')
                query += 'MATCH (p:product {id:"%s"%s) ' % (data['asin'], '}')
                query += 'MERGE (c:category {name:"%s"%s) ' % (c_cleaned, '}')
                query += 'CREATE (p)-[:prod_cat]->(c);\n'
            
            g.write(query)

            if i>num_products:
                break
        
        g.close()

        print("%d products in %s category" % (i, cat))


def add_product_edges(cat):
    metadata_path = os.path.join(data_dir, 'meta_%s.json.gz' % cat)
    with gzip.open(metadata_path) as f:
        g = open(product_cypher_file, 'a')
        i = 0
        for l in f:
            i += 1
            data = json.loads(l.strip())

            query = ''

            for p in data['also_buy']:
                query += 'MATCH (p1:product {id:"%s"%s) ' % (data['asin'], '}')
                query += 'MATCH (p2:product {id:"%s"%s) ' % (p, '}')
                query += 'MERGE (p1)-[:also_bought]->(p2);\n'
    
            for p in data['also_view']:
                query += 'MATCH (p1:product {id:"%s"%s) ' % (data['asin'], '}')
                query += 'MATCH (p2:product {id:"%s"%s) ' % (p, '}')
                query += 'MERGE (p1)-[:also_viewed]->(p2);\n'
            
            g.write(query)

            if i>num_products:
                break
        
        g.close()

## create users and add reviews

def add_user(cat):
    ratings_path = os.path.join(data_dir, '%s.csv' % cat)
    with open(ratings_path, 'r') as f:
        reader = csv.reader(f)
        i=0
        for row in reader:

            query = 'MATCH (p:product{id:"%s"%s) ' % (row[0], '}')
            query += 'MERGE (u:buyer{id:"%s", username:"a", password:"a"%s)\n' % (row[1], '}')
            query += 'CREATE (u)-[:buyer_rating{rating:%d, timestamp:%d%s]->(p);\n' % (float(row[2]), int(row[3]), '}')

            g = open(user_cypher_file, 'a')
            g.write(query)
            g.close()

            i += 1
            if i>num_rating:
                break

        print("%d ratings in %s category" % (i, cat))

parser = argparse.ArgumentParser()
parser.add_argument('--product', action='store_true')
parser.add_argument('--user', action='store_true')
args = parser.parse_args()

if args.product:
    with open(product_cypher_file, 'w') as f:
        query = 'MATCH(n:product) DETACH DELETE n;\n'
        query += 'MATCH(n:brand) DETACH DELETE n;\n'
        query += 'MATCH(n:category) DETACH DELETE n;\n'

        # query += 'CREATE INDEX IF NOT EXISTS FOR (p:product) on (p.id);\n'
        # query += 'CREATE INDEX IF NOT EXISTS FOR (c:category) on (c.name);\n'
        # query += 'CREATE INDEX IF NOT EXISTS FOR (b:brand) on (b.name);\n'
        f.write(query)
    for c in main_categories:
        add_product(c)
    for c in main_categories:
        add_product_edges(c)

if args.user:
    with open(user_cypher_file, 'w') as f:
        query = 'MATCH(u:buyer) DETACH DELETE u;\n'
        query += 'MATCH(u:seller) DETACH DELETE u;\n'
        query += 'MATCH(u:admin) DETACH DELETE u;\n'
        query += 'MATCH(u:del_personnel) DETACH DELETE u;\n'
        f.write(query)
    for cat in main_categories:
        add_user(cat)

    with open(user_cypher_file, 'a') as f:
        query = 'CREATE (u:seller{id:1, username:"a", password:"a"%s);\n' % ('}')
        query += 'CREATE (u:admin{id:1, username:"a", password:"a"%s);\n' % ('}')
        query += 'CREATE (u:del_personnel{id:1, username:"a", password:"a"%s);\n' % ('}')
        query += 'MATCH (p:product) match (s:seller) CREATE (p)-[:prod_sell]->(s);\n'
        f.write(query)