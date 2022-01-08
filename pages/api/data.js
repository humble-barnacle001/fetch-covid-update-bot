import fetchUpdate from "../../components/updateService/fetchUpdate"
import { parseAsEndpoint } from "../../components/utils/parser"

export async function handler(req, res) {
    const response = await fetchUpdate();
    return res.json(parseAsEndpoint(response));
}