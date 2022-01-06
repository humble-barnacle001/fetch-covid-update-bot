import { DateTime } from "luxon";

export function formatter(
    subject: String,
    date: any,
    plain: String,
    attachmentCount: Number
) {
    return `Date: ${date}\n\nSubject: ${subject}
    ---------------------------------------\n${plain}
    ---------------------------------------\nAttachment Count: ${attachmentCount}`;
}

export function adminFormatter(
    from: String,
    to: String,
    formattedData: String
) {
    return `From: ${from}\nTo: ${to}\n${formattedData}`;
}

export function nullableStrings(str: string, defaultStr: string = "") {
    return str ? str : defaultStr;
}

export function dateTimeFormatter(str: string): string {
    return DateTime.fromHTTP(str)
        .setLocale("en-IN")
        .toLocaleString(DateTime.DATETIME_FULL);
}
