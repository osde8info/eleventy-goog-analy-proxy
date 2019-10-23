const admin = require('firebase-admin');
require('dotenv').config()

const serviceAccount = {
  "type": process.env.FIRESTORE_SERVICE_ACCOUNT,
  "project_id": process.env.FIRESTORE_PROJECT_ID,
  "private_key_id": process.env.FIRESTORE_PRIVATE_KEY_ID,
  "private_key": process.env.FIRESTORE_PRIVATE_KEY,
  "client_email": process.env.FIRESTORE_CLIENT_EMAIL,
  "client_id": process.env.FIRESTORE_CLIENT_ID,
  "auth_uri": process.env.FIRESTORE_AUTH_URI,
  "token_uri": process.env.FIRESTORE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIRESTORE_AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.FIRESTORE_CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dhagemeiercom-analytics.firebaseio.com"
});

let db = admin.firestore();

exports.handler = async (event, context) => {
  const data = JSON.parse(event.body);

  return db.collection('pageviews').add(data).then(ref => {
    console.log('Added document with ID: ', ref.id);
    return {
      statusCode: 200,
      body: 'Added document with ID: ' + ref.id
    }
  });
};