import telegramUpdates from "../../../components/updateService/telegram";
import sendUserWiseUpdate from "../../../components/updateService/telegram/sendUserWiseUpdate";

export default async function handler(req, res) {
    try {
        const {
            envelope: { from, to },
            headers: { subject, date },
            plain,
            attachments,
        } = req.body;
        if (process.env.NODE_ENV !== "production") {
            console.log(req.body);
            console.log(from, subject, date, plain, attachments.length);
        }
        await Promise.all([
            telegramUpdates(
                from,
                to,
                subject,
                date,
                plain,
                attachments ? attachments.length : 0
            ),
        ]);
        res.writeHead(201, { "content-type": "text/plain" });
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
