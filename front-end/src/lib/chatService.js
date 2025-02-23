import { getUserData } from "../../../back-end/utils/authUtils.js";
import { addDoc, collection, dbMessages, onSnapshot, orderBy, query, serverTimestamp, where } from "./firebaseConfig.js";

const sendMessage = async (message, chat) => {
    try {
        const userData = getUserData();
        const sender = userData.username;

        await addDoc(collection(dbMessages, "messages"), {
            sender,
            message,
            chat,
            timestamp: serverTimestamp(),
            userId: userData.id
        });

    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
    }
};

const getLastMessagesPerChat = (callback) => {
    let q = query(
        collection(dbMessages, "messages"),
        orderBy("timestamp", "desc")
    );

    onSnapshot(q, (snapshot) => {
        const lastMessages = {};

        snapshot.docs.forEach(doc => {
            const message = { id: doc.id, ...doc.data() };

            if (!lastMessages[message.chat]) {
                lastMessages[message.chat] = message;
            }
        });

        const lastMessagesArray = Object.values(lastMessages);

        callback(lastMessagesArray);
    });
};

const listenMessages = (chat, callback) => {
    const userData = getUserData();
    const userId = userData?.id;

    let q = query(
        collection(dbMessages, "messages"),
        where("chat", "==", chat),
        orderBy("timestamp", "asc")
    );

    if (chat !== "Geral") {
        q = query(q, where("userId", "==", userId));
    }

    onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(messages);
    });
};

const listenMessagesBetweenUsers = (chatUsers, callback) => {
    let q = query(
        collection(dbMessages, "messages"),
        where("chat", "==", chatUsers),
        orderBy("timestamp", "asc")
    );

    onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(messages);
    });
};

export { listenMessages, sendMessage, listenMessagesBetweenUsers, getLastMessagesPerChat };

