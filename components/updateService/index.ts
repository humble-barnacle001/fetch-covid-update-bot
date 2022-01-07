import sendUserWiseUpdate from "./sendUserWiseUpdate";
import { createDBClient } from "../utils/database";

const { query: q } = require("faunadb");

const telegramUpdates = async (textContent: string, after = []) => {
    const client = createDBClient();

    // // "getCollectionField":  ["col", "field", "size", "after"]
    const x = await client.query(
        q.Call(q.Function("getCollectionField"), [
            process.env.TELEGRAM_FAUNA_COLLECTION,
            "chat_id",
            100,
            after,
        ])
    );

    const subscriberList: number[] = x.data.map((ob) => ob.field);

    return Promise.all(
        [
            x.after
                ? telegramUpdates(textContent, x.after)
                : Promise.resolve(1),
        ].concat(
            subscriberList.map((chat_id) =>
                sendUserWiseUpdate(chat_id, textContent, "HTML")
            )
        )
    );
};

export default telegramUpdates;
