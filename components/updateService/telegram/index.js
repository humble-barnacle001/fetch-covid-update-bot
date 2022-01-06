import sendUserWiseUpdate from "./sendUserWiseUpdate";
import { formatter } from "../../utils/formatter";

const faunadb = require("faunadb"),
    q = faunadb.query;

const telegramUpdates = async (
    from = "Test",
    to = "",
    subject = "",
    date = new Date().toISOString(),
    plain = "",
    attachmentCount = 0
) => {
    const client = new faunadb.Client({
        secret: process.env.TELEGRAM_FAUNA_KEY,
        domain: process.env.FAUNA_DOMAIN,
    });

    const x = await client.query(
        q.Map(
            q.Paginate(
                q.Documents(q.Collection(process.env.TELEGRAM_FAUNA_COLLECTION))
            ),
            q.Lambda((x) => q.Get(x))
        )
    );
    const subscriberList = x.data.map((ob) => ob.data.chat_id);

    const text = formatter(subject, date, plain, attachmentCount);

    return Promise.all(
        subscriberList.map((chat_id) => sendUserWiseUpdate(chat_id, text))
    );
};

export default telegramUpdates;
