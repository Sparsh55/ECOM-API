import { MongoClient } from "mongodb";

let client;

export const connectToMongodb = () => {

    MongoClient.connect(process.env.DB_URL).then(clientInstance => {
        console.log("Connected to MongoDB");
        client=clientInstance;
        createCounter(client.db());
        createIndexes(client.db());
    }).catch(err => {
        console.error('Error connecting to Mongodb', err);
    })

}


export const getDB = () => {
    return client.db();
}

export const getClient = ()=>{
    return client;
}


const createCounter = async (db) => {
    const existingCounter = await db.collection("counters").findOne({_id:'cartItemId'});
    if(!existingCounter){
        await db.collection("counters").insertOne({ _id: 'cartItemId', value: 0 });
    }

}

const createIndexes = async(db) => {
    try {
        await db.collection("products").createIndex({price:1});
        await db.collection("products").createIndex({name:1, category:-1});
        await db.collection("products").createIndex({desc:"text"});
    } catch (error) {
        console.log(error);
    }
    
}