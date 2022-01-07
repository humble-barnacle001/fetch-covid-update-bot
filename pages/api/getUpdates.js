import { sendDailyUpdate } from "../../components/updateService/sendMessage";
import sendUserWiseUpdate from "../../components/updateService/sendUserWiseUpdate";
import { arrayFlatten } from "../../components/utils/formatter";
import { updateParser } from "../../components/utils/parser";

export default async function handler(req, res) {
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
                    process.env.TELEGRAM_ADMIN,
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
            try {
                await sendUserWiseUpdate(
                    process.env.TELEGRAM_ADMIN,
                    `Illegal CRONJOB trigger attempt to server: ${req.rawHeaders}`
                );
            } catch (err) {
                console.error("More errors: ", err);
            }
            res.writeHead(401, { "content-type": "text/plain" });
            res.end("Unauthorized!");
        } else
            try {
                const x = await sendDailyUpdate();
                return res.json({
                    success: true,
                    description: `Successfully sent updates to ${
                        arrayFlatten(x).length - 1
                    } subscribers`,
                });
            } catch (err) {
                console.dir(err);
                try {
                    await sendUserWiseUpdate(
                        process.env.TELEGRAM_ADMIN,
                        `Error occured in server: ${err.message}`
                    );
                } catch (err) {
                    console.error("More errors: ", err);
                }
                res.writeHead(500, { "content-type": "text/plain" });
                res.end("Error occured");
            }
    }
}
