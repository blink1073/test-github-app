import { App } from "octokit";
import "process";
import * as fs from "node:fs";

const appId = process.env['APP_ID'];
const installID = process.env['INSTALL_ID'];
const privateKey = fs.readFileSync(process.env['PEM_PATH'], 'utf-8').toString().trim()
const app = new App({ appId, privateKey });

console.log(appId);
console.log(privateKey);
console.log(installID);
const octokit = await app.getInstallationOctokit(installID);
const resp = await octokit.request("GET /repos/{owner}/{repo}/issues", {
    owner: "blink1073",
    repo: "test-github-app",
    per_page: 2
  });
console.log(resp)

const {data: comment} = await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    owner: "blink1073",
    repo: "test-github-app",
    issue_number: 1,
    body: `Hello this is a test comment.`,
    headers: {
      "x-github-api-version": "2022-11-28",
    },
  });
console.log(comment.url)
