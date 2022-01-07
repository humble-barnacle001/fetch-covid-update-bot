import { DateTime } from "luxon";

export function nullableStrings(str: string, defaultStr: string = "") {
    return str ? str : defaultStr;
}

export function dateTimeFormatter(str: string): string {
    return DateTime.fromHTTP(str)
        .setZone("Asia/Kolkata")
        .setLocale("en-IN")
        .toLocaleString(DateTime.DATETIME_FULL);
}

interface Command {
    command: string;
    description: string;
}

export function commandListFormatter(commands: Command[]) {
    return commands
        .map((command) => `/${command.command} - ${command.description}`)
        .join("\n");
}
