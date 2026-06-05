const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
console.log("Watching 'notes' collection...");

db.collection('notes').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
            const note = change.doc.data();

            const message = {
                notification: {
                    title: 'New Note Added',
                    body: note.text,
                },
                topic: 'notes',
            };

            try {
                const response = await admin.messaging().send(message);
                console.log('Successfully sent message:', response);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    });
});