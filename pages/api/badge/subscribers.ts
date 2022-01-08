import type { NextApiRequest, NextApiResponse } from "next";
import { countSubscribers } from "../../../components/utils/database";
import { badgeFormatterShieldsIO } from "../../../components/utils/formatter";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const x = await countSubscribers();
        return res.json(
            badgeFormatterShieldsIO(
                "subscribers",
                `${x ? x : 0}`,
                "success",
                "blue",
                !x
            )
        );
    } catch (err) {
        console.log(err);
        return res.json(
            badgeFormatterShieldsIO("subscribers", `error`, "red", "blue", true)
        );
    }
}
