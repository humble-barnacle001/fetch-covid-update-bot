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

// From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#reduce_concat_isarray_recursivity
export function arrayFlatten(arr: any[], d = Infinity): any[] {
    return d > 0
        ? arr.reduce(
              (acc, val) =>
                  acc.concat(
                      Array.isArray(val) ? arrayFlatten(val, d - 1) : val
                  ),
              []
          )
        : arr.slice();
}

export function badgeFormatterShieldsIO(
    label: string,
    message: string,
    color: string = "lightgrey",
    labelColor: string = "grey",
    isError: boolean = false,
    namedLogo: string = "telegram",
    style: string = "flat",
    // Set badge in production to be cached for two hours
    cacheSeconds: number = process.env.NODE_ENV === "production" ? 7200 : 300
) {
    return {
        schemaVersion: 1,
        label,
        message,
        color,
        labelColor,
        isError,
        namedLogo,
        style,
        cacheSeconds,
    };
}
