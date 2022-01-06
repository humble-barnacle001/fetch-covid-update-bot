import fetchUpdate from "../updateService/fetchUpdate";
import sendUserWiseUpdate from "../updateService/sendUserWiseUpdate";
import { listStates, parseData, parseFullData } from "./parser";

export default async function sendMessage(
    id: number,
    name: string,
    command: string,
    query: string | undefined
) {
    let response;
    if (command in ["/update", "/fullupdate", "/query", "/statelist"])
        response = await fetchUpdate();
    switch (command) {
        case "/start":
            return sendUserWiseUpdate(
                id,
                `Hello ${name}! Type /help for more help`
            );
        // case "/help":
        //     return sendUserWiseUpdate(
        //         id,
        //         `Hello ${name}!\nThe list of commands are:`
        //     );
        case "/update":
            return sendUserWiseUpdate(id, parseData(response));
        // case "/subscribe":
        //     return sendUserWiseUpdate(
        //         id,
        //         `Hello ${name}! You are successfully subscribed for daily updates at 10:00am IST (+05:30GMT)`
        //     );
        case "/fullupdate":
            return sendUserWiseUpdate(id, parseFullData(response));
        case "/statelist":
            return sendUserWiseUpdate(
                id,
                `Hello ${name}!\nThe list of states with corresponding query number are:\n` +
                    listStates(response) +
                    `\nWrite as /query no for the corresponding state data`
            );
        case "/query":
            return sendUserWiseUpdate(id, parseData(response, query));
        // case "/unsubscribe":
        //     return sendUserWiseUpdate(
        //         id,
        //         `Hello ${name}! You are successfully unsubscribed!! We are so sorry to see you go!!\nIf you ever want to subscribe again just send /subscribe to start again!`
        //     );
        default:
            return Promise.resolve(0);
    }
}
