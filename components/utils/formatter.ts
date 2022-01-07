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
