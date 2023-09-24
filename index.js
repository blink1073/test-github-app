import { App } from "octokit";
import "process";
import * as fs from "node:fs";

const appId = process.env['APP_ID'];
const installID = process.env['INSTALL_ID'];
const privateKey = fs.readFileSync(process.env['PEM_PATH'], 'utf-8');

const app = new App({ appId, privateKey });
const octokit = await app.getInstallationOctokit(installID);

// These will be inputs.
const owner = "blink1073";
const repo = "test-github-app";
const issue_number = 2;
const match = `Hello this is a test comment.`;
const body = "Hello this is a new updated comment";

const headers =  {
    "x-github-api-version": "2022-11-28",
};

const resp = await octokit.request("GET /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    owner,
    repo,
    issue_number,
    headers
});
var found = false
resp.data.forEach(async (comment) => {
    if (comment.body.includes(match)) {
        if (found) {
            return
        }
        found = true;
        await octokit.request("PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}", {
            owner,
            repo,
            body,
            comment_id: comment.id,
            headers
        });
    }
})

if (!found) {
    await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
        owner,
        repo,
        issue_number,
        body,
        headers
    });
}
