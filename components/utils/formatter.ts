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
