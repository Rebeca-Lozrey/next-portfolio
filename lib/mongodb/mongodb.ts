import {
  Collection,
  Db,
  MongoClient,
  Document as MongoDocument,
  ServerApiVersion,
} from "mongodb";

function getUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please add MONGODB_URI to .env.local");
  }
  return uri;
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    // strict: true,
    deprecationErrors: true,
  },
};

let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function connectClient(): Promise<MongoClient> {
  const uri = getUri();
  let client: MongoClient;
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  if (!clientPromise) {
    client = new MongoClient(uri, options);
    const dbStart = performance.now();
    clientPromise = client.connect();
    const dbDuration = performance.now() - dbStart;
    console.log("Mongo connection time:", dbDuration.toFixed(2), "ms");
  }

  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await connectClient();
  return client.db("social-network");
}

export async function getCollection<T extends MongoDocument>(
  name: string,
): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}
