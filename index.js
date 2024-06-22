const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

const uri = "mongodb+srv://prashu:prashu2001@userauth.yrbyfkq.mongodb.net/?retryWrites=true&w=majority&appName=UserAuth";
const mongoClient = new MongoClient(uri);

let db;

async function connectToDatabase() {
    try {
        await mongoClient.connect();
        console.log('Connected to MongoDB');
        db = mongoClient.db('ReleaseTestingReports');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

app.get('/', async(req, res) => {
    try {
        const collection = db.collection('script');
        const results = await collection.find().toArray();
        res.render('report', { results });
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).send('Error fetching results');
    }
});

app.get('/api/results', async(req, res) => {
    try {
        const collection = db.collection('script');
        const results = await collection.find().sort({ timestamp: -1 }).toArray();
        res.json(results);
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ error: 'Error fetching results' });
    }
});

app.delete('/api/delete-collection', async(req, res) => {
    try {
        await db.collection('script').drop();
        res.json({ message: 'Collection deleted successfully' });
    } catch (error) {
        console.error('Error deleting collection:', error);
        res.status(500).json({ error: 'Error deleting collection' });
    }
});

connectToDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
});

process.on('SIGINT', async() => {
    await mongoClient.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});