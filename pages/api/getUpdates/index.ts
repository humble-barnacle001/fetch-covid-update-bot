import { sendDailyUpdate } from "../../../components/updateService/sendMessage";
import sendUserWiseUpdate from "../../../components/updateService/sendUserWiseUpdate";
import { arrayFlatten } from "../../../components/utils/formatter";
import { updateParser } from "../../../components/utils/parser";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let tAdmin = 0;
    try {
        tAdmin = Number(process.env.TELEGRAM_ADMIN);
    } catch (error) {
        res.writeHead(500, { "content-type": "text/plain" });
        res.end("Error occured");
    }
    if (req.method === "POST") {
        try {
            const updateBody = req.body;
            if (process.env.NODE_ENV !== "production") {
                console.log(req.body);
            }
            await updateParser(updateBody);

            res.writeHead(202, { "content-type": "text/plain" });
            res.end("Message Received. Thanks!\r\n");
        } catch (err) {
            console.dir(err);
            try {
                await sendUserWiseUpdate(
                    tAdmin,
                    `Error occured in server: ${err.message}`
                );
            } catch (err) {
                console.error("More errors: ", err);
            }
            res.writeHead(500, { "content-type": "text/plain" });
            res.end("Error occured");
        }
    } else if (req.method === "GET") {
        const { key } = req.query;
        if (key !== process.env.CRON_JOB_KEY) {
            if (process.env.NODE_ENV === "production")
                try {
                    await sendUserWiseUpdate(
                        tAdmin,
                        `Illegal CRONJOB trigger attempt to server: ${req.rawHeaders}`
                    );
                } catch (err) {
                    console.error("More errors: ", err);
                }
            return res.status(401).json({
                success: false,
                description: `Unauthorized`,
            });
        } else if (process.env.NODE_ENV === "production")
            try {
                const x = await sendDailyUpdate();
                return res.json({
                    success: true,
                    description: `Successfully sent updates to ${
                        arrayFlatten(x).length - 1
                    } subscribers`,
                    time: new Date().getTime(),
                });
            } catch (err) {
                console.dir(err);
                try {
                    await sendUserWiseUpdate(
                        tAdmin,
                        `Error occured in server: ${err.message}`
                    );
                } catch (err) {
                    console.error("More errors: ", err);
                }
                return res.json({
                    success: false,
                    description: `Failed: ${err.message}`,
                });
            }
        else
            return res.json({
                success: false,
                description: `Development server ok!`,
            });
    }
}
