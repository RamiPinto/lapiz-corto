import clientPromise from '../../lib/mongodb';

export default async (req, res) => {
        
        try {
            const client = await clientPromise;
            const db = client.db("lapizcorto");
            const { ObjectId } = require('mongodb');
    
            const { _id, text } = req.body;
            
            const result = await db
                .collection("proverbs")
                .updateOne(
                    { _id: new ObjectId(_id) },
                    { $set: { text: text }}
                );
                
            res.status(200).json(result);
    
        }
        catch (e){
            console.error(e);
            res.status(500).json({ error: 'Error adding proverbs' });
        }
    };