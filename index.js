'use strict';
const core = require('@actions/core');
const {Octokit} = require('@octokit/rest');
const path = require('path');
const fs = require('fs');

const owner = core.getInput('owner');
const repo = core.getInput('repo');
const downloadPath = core.getInput('repo');
const overrideFileName = core.getInput('fileName');
const octokit = new Octokit();

async function downloadZip (releaseInfo, downloadPath) {
    const fileName = overrideFileName || `${releaseInfo.data.name.replace(/[^a-z0-9]/gi, '_')}.zip`;

    const zipBallResponse = await octokit.rest.repos.downloadZipballArchive({
        owner,
        repo,
        ref: releaseInfo.data.tag_name,
    });
    const data = Buffer.from(zipBallResponse.data);

    fs.mkdirSync(path.resolve(downloadPath), {recursive: true}, err => {
        if (err) {
            console.error(err);
            throw new Error('no release available');
        }
    });

    fs.writeFile(path.resolve(downloadPath, fileName), data, 'binary', err => {
        if (err) {
            console.error(err);
            throw new Error('problem writing release zip');
        } else {
            return fileName;
        }
    });
}

async function getLatestRelease () {
    try {
        const latestRelease = await octokit.rest.repos.getLatestRelease({
            owner,
            repo,
        });

        if (latestRelease) {
            return latestRelease;
        } else {
            throw new Error('no release available');
        }
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

async function run () {
    try {
        const releaseInfo = await getLatestRelease();
        await downloadZip(releaseInfo, downloadPath);
    } catch (error) {
        console.error(error);
        core.setFailed('failed to download latest release');
    }
}

run();
