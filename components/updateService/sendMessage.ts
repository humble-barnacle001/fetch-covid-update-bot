import fetchUpdate from "./fetchUpdate";
import sendUserWiseUpdate from "./sendUserWiseUpdate";
import { listStates, parseData, parseFullData } from "../utils/parser";
import { createSubscriber, removeSubscriber } from "../utils/database";
import fetchCommandList from "./fetchCommandList";
import { commandListFormatter } from "../utils/formatter";
import telegramUpdates from ".";

export async function sendMessage(
    id: number,
    name: string,
    command: string,
    query: string | undefined
) {
    if (
        ["/update", "/fullupdate", "/statelist", "/query"].find(
            (com) => com === command
        )
    )
        return sendMessageRequiringData(id, name, command, query);

    switch (command) {
        case "/start":
            return sendUserWiseUpdate(
                id,
                `Hello ${name}! Type /help for more help`
            );
        case "/help":
            const { data } = await fetchCommandList();
            return sendUserWiseUpdate(
                id,
                `Hello ${name}!\nThe list of commands are:\n\n${commandListFormatter(
                    data.result
                )}`
            );
        case "/subscribe":
            const sub_res = await createSubscriber(id);
            return sendUserWiseUpdate(
                id,
                `${
                    sub_res
                        ? `Hello ${name}! You are successfully subscribed for daily updates at 10:00am IST (+05:30GMT)`
                        : "There was some error, please try again later!!"
                }`
            );
        case "/unsubscribe":
            const unsub_res = await removeSubscriber(id);
            return sendUserWiseUpdate(
                id,
                `${
                    unsub_res
                        ? `Hello ${name}! You are successfully unsubscribed!! We are so sorry to see you go!!\n` +
                          `If you ever want to subscribe again just send /subscribe to start again!`
                        : "Cannot unsubscribe as you are not subscribed yet!!"
                }`
            );
        default:
            return Promise.resolve(0);
    }
}

async function sendMessageRequiringData(
    id: number,
    name: string,
    command: string,
    query: string | undefined
) {
    const response = await fetchUpdate();
    switch (command) {
        case "/update":
            return sendUserWiseUpdate(id, parseData(response));
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
    }
}

export async function sendDailyUpdate() {
    const response = await fetchUpdate();
    return telegramUpdates(
        `<b>Subscribed Update:</b>\n\n${parseData(response)}`
    );
}
