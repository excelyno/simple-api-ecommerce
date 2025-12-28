const admin = require('firebase-admin');
const serviceAccount = require('../../ikanhiu.json'); // Pastikan path-nya benar

// Cek agar tidak inisialisasi ganda
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    // Jika nanti pakai Realtime Database, tambahkan databaseURL di sini
  });
}

const db = admin.firestore();

module.exports = { db, admin };