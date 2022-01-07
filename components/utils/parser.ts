import { sendMessage } from "../updateService/sendMessage";
import { dateTimeFormatter, nullableStrings } from "./formatter";

export async function updateParser(update) {
    if (update["message"] && update["message"]["text"]) {
        const {
            message: { chat, text },
        } = update as { message: { chat: any; text: String } };
        const [command, query] = text.toLowerCase().split(" ");
        const {
            id,
            first_name: fn,
            last_name: ln,
        } = chat as {
            id: number;
            first_name: string | undefined;
            last_name: string | undefined;
        };

        const name = `${nullableStrings(fn)} ${nullableStrings(ln)}`;

        return sendMessage(id, name, command, query);
    } else return Promise.resolve(0);
}

interface State {
    sno: string;
    state_name: string;
    active: string;
    positive: string;
    cured: string;
    death: string;
    new_active: string;
    new_positive: string;
    new_cured: string;
    new_death: string;
    state_code: string;
}

export function parseData(response, type: string = "", omit_modified = false) {
    const { data, headers } = response as { data: State[]; headers: any };
    const currentState = data.filter(
        (state) => Number(state.state_code) === Number(type)
    );
    if (currentState.length != 1)
        return `You entered a wrong query! Please see /statelist to obtain a full list of the query number to send for a particular state`;
    const {
        state_name,
        active,
        positive,
        cured,
        death,
        new_active,
        new_positive,
        new_cured,
        new_death,
    } = currentState[0];

    const state = type === "" ? "India" : state_name,
        del_positive = Number(new_positive) - Number(positive),
        del_active = Number(new_active) - Number(active),
        del_cured = Number(new_cured) - Number(cured),
        del_dead = Number(new_death) - Number(death),
        modified = dateTimeFormatter(headers["last-modified"]);

    return (
        `Details of ${state}` +
        `${!omit_modified && modified ? ` as on ${modified}` : ""}:\n` +
        `New cases: ${del_positive}\n` +
        `${omit_modified ? "" : `Growth in active cases: ${del_active}\n`}` +
        `Cured cases: ${del_cured}\n` +
        `Deaths occurred: ${del_dead}\n`
    );
}

export function parseFullData(response) {
    const { data, headers } = response as { data: State[]; headers: any };
    return (
        data
            .map(
                (state) =>
                    `${nullableStrings(state.state_name, "India")}: ${
                        Number(state.new_positive) - Number(state.positive)
                    }`
            )
            .join("\n------\n") +
        `${
            headers["last-modified"]
                ? `\n\n\nLast Modified: ${dateTimeFormatter(
                      headers["last-modified"]
                  )}`
                : ""
        }`
    );
}

export function listStates(response) {
    const { data, headers } = response as { data: State[]; headers: any };
    return data
        .filter((state) => state.state_code !== "")
        .sort((a, b) => Number(a.state_code) - Number(b.state_code))
        .map((state) => `${state.state_code}: ${state.state_name}`)
        .join("\n\n");
}
