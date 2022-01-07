const axios = require("axios");

export default async function fetchCommandList() {
    return axios.get(
        `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/getMyCommands`
    );
}
