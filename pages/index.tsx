import { readFileSync } from "fs";
import { dateTimeFormatter } from "../components/utils/formatter";
import { DateTime } from "luxon";

export default function Index({ page }) {
    return <div dangerouslySetInnerHTML={page}></div>;
}

// This function gets called at build time
export async function getStaticProps() {
    const indexData = readFileSync(`${process.cwd()}/README.md`, "utf8");
    const updateTime = dateTimeFormatter(DateTime.now().toHTTP());

    if (process.env.NODE_ENV === "production")
        try {
            console.log("Set webhook URL");
            await fetch(
                `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/setWebhook?url=https://${process.env.API_USERNAME}:${process.env.API_PASSWORD}@${process.env.DEPLOY_DOMAIN}/api/getUpdates`
            );
            console.log("Webhook set successfully!!");
        } catch (error) {
            console.warn("Could not set the webhook please check");
            console.log(error);
        }

    const res = await fetch("https://api.github.com/markdown", {
            method: "POST",
            headers: {
                Accept: "application/vnd.github.v3+json",
            },
            body: JSON.stringify({
                text: `${indexData}\n\n---\n\nLast Updated: ${updateTime}`,
                mode: "gfm",
                context: process.env.REPO_ID,
            }),
        }),
        res_blob = await res.blob(),
        res_text = await res_blob.text();

    const pageHTML = res_text;
    //.replaceAll(
    //  `<span aria-hidden="true" class="octicon octicon-link"></span>`,
    // `<svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg>`
    // );

    // console.log("pagehtml", pageHTML);

    const page = { __html: pageHTML };

    return {
        props: {
            page,
        },
    };
}
