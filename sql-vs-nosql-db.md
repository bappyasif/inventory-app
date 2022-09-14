**SQL databases**
> SQL language is an American National Standards Institute (ANSI) standard, with some dialects, like PL/SQL (in Oracle) and T-SQL (in Microsoft SQL Server)
> advantage of writing ANSI-compatible SQL is that you can easily transfer your scripts to another SQL database
> Popular SQL databases include Oracle, MySQL, Microsoft SQL Server, and PostgreSQL

***SQL is relational***
> A common misconception is that SQL databases are considered relational because you can define relations between records in your database using foreign keys
> In fact, the name is based on the mathematical concept of a relation, which refers to a collection of unique tuples. A tuple is simply an ordered collection of values
> In an SQL database, a relation is represented as a table, with each tuple in the relation making up a row (commonly called a record) in the table
> It’s like a large, formalized Excel spreadsheet for software to use
> We call the definition of tables and rows a schema
> In relational databases, you can (and generally should) normalize your data by not storing it redundantly
> In the past, storage was expensive, and normalizing your data saved storage

***SQL is robust***
> Having a schema has pros and cons
> On the one hand, you always know the entities and values your application expects
> On the other hand, it’s not good at dealing with dynamic data
> Having a schema means you can validate your data
> For example, the ID field must be unique and may not be NULL (empty)
> You can also force a foreign key relationship, meaning that a record can’t reference another record that doesn’t exist in your database
> Having a normalized database and these validations in place makes your data reliable
> With other SQL perks, like transactions, SQL databases are generally fast, reliable, and robust

**NoSQL databases**
> You may find some SQL in NoSQL databases
> there are four broad categories of NoSQL database: 
    > Document stores
    > Graph databases
    > Key-value stores
    > Wide-column data stores
> One thing they generally have in common is that they sacrifice some robustness to gain speed and scalability

***Document stores***
> most popular type of NoSQL database is the document store
> Document stores look the most like traditional SQL databases, except there is no schema and no normalization
> Instead of columns and rows, you simply have a collection of whatever it is you put in
> Adding a new field to an entity is easy, but it means some entities have this field defined while others don’t
> You can store the same entity multiple times and with different values
> Document stores can generally run on multiple servers, while SQL databases are usually tied to a single server
> Since document stores don’t have all these pesky field validations, they’re lightning fast!
> Popular document stores include MongoDB, DynamoDB, Couchbase, Firebase, and Cosmos DB

***Graph databases***
> graph database is a niche type of NoSQL database that is pretty specialized
> most common use case for this type of database is the “people you may know” example
> In a graph database, all these people are represented as nodes, and the relationships between them are represented as edges
> To find all the friends of your friends, you would start with a node and simply “walk” the edges
> With a big enough dataset, a graph database takes seconds to fetch all these friends of friends, 
> An SQL database would quickly bog down doing this
    > It would need to match millions of users, each with millions of users, and all those with their own millions of users and ultimately filter billions of (double) users
    > If you need a graph database, some popular ones are Neo4j, ArangoDB, and Cosmos DB

***Key-value stores***
> Probably the most straightforward NoSQL database is the key-value store
> As its name suggests, the key-value store holds collections of key-value pairs
> value can be anything, from a numeric value to a complex object with sub-objects
> It’s not widely applicable, but the key-value store is perfect for use cases such as caching or storing session data
> Redis, Memcached, and Cosmos DB are popular key-value stores

***Wide-column data stores***
> wide-column data store looks a bit like the key-value store
> However, instead of having a single value, a key holds access to columns
> A value can consist of billions of columns and can be dynamic
> Wide-column data stores are scalable and can hold up to petabytes of data
> Their use cases vary, such as time-series data (like CPU use over time for multiple servers), financial data marketing, internet of things (IoT) data, and graph data
> Popular databases of this type include Cassandra, HBase, Bigtable, and Cosmos DB

***Other NoSQL databases***
> NoSQL includes other types of databases, like databases centered around flat text files
> Also, keep in mind that we can classify everything we had before SQL as NoSQL
> Search engines are NoSQL databases that specialize in finding data content
> They typically support complex search queries, full-text search, result ranking and grouping, and distributed search for high scalability
> Elasticsearch, Solr, and Splunk are popular search engines
> There are various multi-model databases, or databases that can store data in multiple ways, like Cosmos DB
> Amazon has its own DynamoDB, which is a multi-model database running in AWS
> There are some limitations to multi-model databases
    > You can’t use the different approaches in a single database, for example, but you can create multiple instances and use a different method on each

***NewSQL databases***
> Sometimes, NoSQL is your only option
> However, SQL databases have caught up and now offer some NoSQL perks while still being SQL
> For example, databases such as Oracle and SQL Server enable you to store dynamic JSON and even use indices and filter queries on those values
> Some databases take it a step further. Snowflake, for example, is a decentralized SQL database hosted in the cloud
> It solves the challenge of SQL not being scalable while still remaining SQL completely. These types of databases are often called NewSQL
> Other popular NewSQL databases include CockroachDB and Spark SQL

**SQL vs NoSQL: How to choose**
> right tool may just be the tool your team already knows
> An optimal yet unfamiliar database may negatively impact your project, while a suboptimal yet familiar tool may be sufficient to do the job
> If you decide to use a new database, be it SQL, NoSQL, or NewSQL, ensure your team gets the training and guidance they need to implement it correctly
> SQL is usually a good choice and a pretty strong all-arounder for most projects
> However, for more specialized work, a NoSQL database may be the better choice
> For example, Redis has become a popular choice for caching
> And if you’re looking for a fast and scalable database and have no problems sacrificing some robustness, MongoDB may be just what you need
> Avoid pursuing the latest and greatest just for the sake of newness
> Programmers may like the idea of new tech, but what’s hot today may be discontinued five years from now
> It’s challenging to find people or support for a discontinued product, and replacing a database mid-project is usually costly
> Ultimately, the answer to what database you should use for your next project is: it depends
> Luckily, with modern architecture, like microservices, the choice between SQL and NoSQL isn’t an either-or option
> They can exist side-by-side in the same application landscape

**Conclusion**
> Both SQL and NoSQL have their place in modern software development
> They each have their strengths and weaknesses
> NoSQL databases can incorporate SQL elements, while SQL databases can offer some of the benefits of NoSQL through new features and full-fledged NewSQL databases
> When choosing your database, consider your needs and what makes the most sense for your team, be it SQL or NoSQL