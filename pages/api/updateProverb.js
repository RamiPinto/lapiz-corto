import clientPromise from '../../lib/mongodb';

export default async (req, res) => {
        
        try {
            const client = await clientPromise;
            const db = client.db("lapizcorto");
            const { ObjectId } = require('mongodb');
    
            const { _id, text, written, owner } = req.body;
            
            const result = await db
                .collection("proverbs")
                .updateOne(
                    { _id: new ObjectId(_id) },
                    { $set: { 
                        text: text,
                        written: written,
                        owner: owner,
                        lastUpdateTimestamp: new Date()
                    }}
                );
                
            res.status(200).json(result);
    
        }
        catch (e){
            console.error(e);
            res.status(500).json({ error: 'Error adding proverbs' });
        }
    };