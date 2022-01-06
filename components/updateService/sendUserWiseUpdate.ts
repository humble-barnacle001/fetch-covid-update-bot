const axios = require("axios");

const sendUserWiseUpdate = async (chat_id: Number, textContent: String) => {
    try {
        await axios.post(
            `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
            {
                chat_id,
                text: textContent
            }
        );
    } catch (error) {
        console.error("Error while sending: ", error.toJSON());
        return Promise.resolve(403);
    }
    return Promise.resolve(1);
};

export default sendUserWiseUpdate;
