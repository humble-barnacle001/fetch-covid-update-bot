import sendUserWiseUpdate from "../../components/updateService/sendUserWiseUpdate";
import { updateParser } from "../../components/utils/parser";

export default async function handler(req, res) {
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
}
