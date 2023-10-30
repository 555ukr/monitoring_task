const express = require('express')
const app = express()
const mongoose = require('mongoose');
const { Client } = require('@elastic/elasticsearch');
const port = 4000

const esClient = new Client({ node: 'http://elasticsearch:9200'}, );

mongoose.connect('mongodb://root:example@mongo:27017/', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// async function createIndex() {
//     const indexName = 'your_index_name';
//
//     try {
//       const response = await esClient.indices.create({
//         index: indexName,
//       });
//
//       console.log(`Index created: ${response.body.index}`);
//     } catch (error) {
//       console.error(`Error creating index: ${error}`);
//     }
//   }
//
//   createIndex();

const Document = mongoose.model('Document', {
    content: String,
    timestamp: { type: Date, default: Date.now },
  });
  
  // 4. Function to create and save a new document
  const createAndSaveDocument = async () => {
    const content = `Document created at ${new Date()}`;
    const newDocument = new Document({ content });
  
    try {
      const savedDocument = await newDocument.save();
      console.log(`Saved document with ID ${savedDocument._id}`);

      const dataToPush = {
        index: 'some-data', // Replace with your Elasticsearch index
        // id: savedDocument._id, // Use the MongoDB document's _id as the Elasticsearch document ID
        body: {
          content,
        },
      };

      const response = await esClient.index(dataToPush);
      console.log(`Document indexed successfully in Elasticsearch. Document ID: ${response?._id}`);


      return {mongo: savedDocument._id, elastic: response?._id}
    } catch (err) {
      console.error('Error saving document:', err);
      return null
    };
  };

app.get('/', async (req, res) => {
  const resSave = await createAndSaveDocument()
  res.send(`Mongo ID:${resSave.mongo}\n Elastic: ${resSave.elastic}`);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
