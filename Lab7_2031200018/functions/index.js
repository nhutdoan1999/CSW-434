const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

// 1. Nhúng file chìa khóa bảo mật bạn vừa tải về
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

// 2. Thêm { cors: true } để app điện thoại không bị chặn kết nối
exports.checkAndSendReminders = onRequest({ cors: true }, async (req, res) => {
    console.log("=== ĐANG QUÉT GHI CHÚ ĐẾN HẠN ===");
    const now = new Date();
    const notesRef = admin.firestore().collection('notes');

    try {
        const snapshot = await notesRef
            .where('reminderTime', '<=', now)
            .where('isNotified', '==', false)
            .get();

        if (snapshot.empty) {
            console.log('-> Không có gì đến hạn lúc này.');
            res.status(200).send('No reminders');
            return;
        }

        console.log(`-> TÌM THẤY ${snapshot.size} GHI CHÚ! Đang gửi thông báo...`);
        const promises = [];

        snapshot.forEach((doc) => {
            const note = doc.data();

            if (note.fcmToken) {
                const payload = {
                    notification: {
                        title: '🔔 Nhắc nhở: ' + (note.title || 'Công việc'),
                        body: note.description || 'Đã đến giờ thực hiện!',
                    },
                    token: note.fcmToken
                };

                const sendPromise = admin.messaging().send(payload)
                    .then(() => {
                        console.log('-> Đã gửi thành công cho:', note.title);
                        // Cập nhật trạng thái để không bị gửi trùng lặp
                        return doc.ref.update({ isNotified: true });
                    })
                    .catch((error) => console.error('-> Lỗi gửi FCM:', error));

                promises.push(sendPromise);
            }
        });

        await Promise.all(promises);
        console.log("=== HOÀN TẤT QUÉT VÀ GỬI ===");
        res.status(200).send('Success');

    } catch (error) {
        console.error('Lỗi backend:', error);
        res.status(500).send('Error');
    }
});