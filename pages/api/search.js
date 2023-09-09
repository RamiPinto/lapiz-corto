import clientPromise from '../../lib/mongodb';

export default async (req, res) => {
    
    const searchQuery = req.query.q;

    if (!searchQuery) {
        res.status(400).json({ error: 'Search query is required' });
        return;
    }

    try {
        const client = await clientPromise;
        const db = client.db("lapizcorto");

        const agg = [
            {
                $search: {
                    index: 'search',
                    text: {
                        query: searchQuery,
                        path: {
                            wildcard: '*',
                        },
                        fuzzy: {
                            maxEdits: 2, // Adjust the number of maximum edits for typo-tolerance
                        }
                    }
                }
            },
            {
                $project: {
                  text: 1,
                  score: { $meta: 'searchScore' }, // you are already adding the field here.
                 },
            }
        ];
        
        const result = await db
            .collection("proverbs")
            .aggregate(agg)
            .toArray();

        res.status(200).json(result);

    }
    catch (e){
        console.error(e);
        res.status(500).json({ error: 'Error searching proverbs' });
    }
};