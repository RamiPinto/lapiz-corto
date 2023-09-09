import clientPromise from '../../lib/mongodb';

export default async (req, res) => {

    try {
        const client = await clientPromise;
        const db = client.db("lapizcorto");

        const { proverb } = req.body;

        proverb.timestamp = new Date();
        proverb.lastUpdateTimestamp = new Date();
        proverb.written = false;
        
        const result = await db
            .collection("proverbs")
            .insertOne(proverb);
            
        res.status(200).json(result);

    }
    catch (e){
        console.error(e);
        res.status(500).json({ error: 'Error adding proverbs' });
    }
};