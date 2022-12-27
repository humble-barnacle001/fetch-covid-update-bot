import type { NextApiRequest, NextApiResponse } from "next";
import fetchUpdate from "../../components/updateService/fetchUpdate";
import { parseAsEndpoint } from "../../components/utils/parser";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method == "OPTIONS") {
        res.setHeader(
            "Access-Control-Allow-Methods",
            "PUT, POST, PATCH, DELETE, GET"
        );
        return res.status(200).end();
    }

    const response = await fetchUpdate();
    return res.json(parseAsEndpoint(response));
}
