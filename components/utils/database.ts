import sendUserWiseUpdate from "../updateService/sendUserWiseUpdate";

const { Client, query: q } = require("faunadb");

const index = "subscribers_by_chat_id";

export function createDBClient() {
    return new Client({
        secret: process.env.TELEGRAM_FAUNA_KEY,
        domain: process.env.FAUNA_DOMAIN,
    });
}

export async function createSubscriber(id: number) {
    const client = createDBClient();

    try {
        // createOrUpdate: ["col", "index", "id", "pureData"]
        const x = await client.query(
            q.Call(q.Function("createOrUpdate"), [
                process.env.TELEGRAM_FAUNA_COLLECTION,
                index,
                id,
                { chat_id: id },
            ])
        );
        return Promise.resolve(true);
    } catch (err) {
        console.error(err);
        if (process.env.TELEGRAM_ADMIN)
            try {
                await sendUserWiseUpdate(
                    Number(process.env.TELEGRAM_ADMIN),
                    `Error in adding subscriber (id: ${id}) to DB: ${err.name}: ${err.description}`
                );
            } catch (err) {
                console.error("More errors: ", err);
            }
        Promise.resolve(false);
    }
}

export async function removeSubscriber(id: number) {
    const client = createDBClient();
    try {
        const x = await client.query(
            q.Delete(q.Select("ref", q.Get(q.Match(q.Index(index), id))))
        );
        return Promise.resolve(true);
    } catch (err) {
        if (
            (err.requestResult && err.requestResult.statusCode === 404) ||
            err.message === "instance not found"
        )
            return Promise.resolve(false);
    }
}
