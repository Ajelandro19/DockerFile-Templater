// @ts-nocheck
import Yargs from 'yargs';
import { readFileSync, writeFileSync } from 'fs';
import { configure, render } from 'nunjucks';

type BuildJsonDockerfile = {
    InstallCommands: string[];
    PreInstallCommands: string[];
    PostInstallCommands: string[];
}; 

type BuildJson ={
    Dockerfile: BuildJsonDockerfile;
    ServiceName: string;
    ServiceType: string;
};

function main() {
    const argv = Yargs(process.argv.slice(2)).argv;

    const buildPath = argv["config"] as any; // @ts-ignore;
    
    const configuration = readFileSync(buildPath, 'utf8');


    const configurationData = JSON.parse(configuration) as BuildJson;

    configure("templates", { autoescape: false });

    const dockerfile = render("Dockerfile", configurationData)
    const circleci = render("circleci.yml", configurationData)
    writeFileSync("Dockerfile", dockerfile);
    writeFileSync(".circleci.yml", circleci);
}

main();