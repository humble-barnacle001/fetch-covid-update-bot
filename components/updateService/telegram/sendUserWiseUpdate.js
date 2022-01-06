const axios = require("axios");

const sendUserWiseUpdate = async (chat_id, textContent) => {
    return axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
        {
            chat_id,
            text: textContent,
        }
    );
};

export default sendUserWiseUpdate;
