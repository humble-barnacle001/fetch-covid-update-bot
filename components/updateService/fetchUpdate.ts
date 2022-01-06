const axios = require("axios");

export default async function fetchUpdate() {
    return axios.get(process.env.UPDATE_API_URL);
}
