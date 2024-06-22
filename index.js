const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

const uri = "mongodb+srv://prashu:prashu2001@userauth.yrbyfkq.mongodb.net/?retryWrites=true&w=majority&appName=UserAuth";
const mongoClient = new MongoClient(uri);

app.get('/', async(req, res) => {
    try {
        await mongoClient.connect();
        const db = mongoClient.db('ReleaseTestingReports');
        const collection = db.collection('script');
        const results = await collection.find().toArray();
        res.render('report', { results });
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).send('Error fetching results');
    } finally {
        await mongoClient.close();
    }
});

app.get('/api/results', async(req, res) => {
    try {
        await mongoClient.connect();
        const db = mongoClient.db('ReleaseTestingReports');
        const collection = db.collection('script');
        const results = await collection.find().sort({ timestamp: -1 }).toArray();
        res.json(results);
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ error: 'Error fetching results' });
    } finally {
        await mongoClient.close();
    }
});

app.delete('/api/delete-collection', async(req, res) => {
    try {
        await mongoClient.connect();
        const db = mongoClient.db('ReleaseTestingReports');
        await db.collection('script').drop();
        res.json({ message: 'Collection deleted successfully' });
    } catch (error) {
        console.error('Error deleting collection:', error);
        res.status(500).json({ error: 'Error deleting collection' });
    } finally {
        await mongoClient.close();
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});