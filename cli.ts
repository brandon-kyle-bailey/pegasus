#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';

const templatesDir = path.join(__dirname, '..', 'templates');

const typePaths: {[key: string]: string} = {
    'dto': "src\\interface\\dtos",
    'controller': "src\\interface\\controller",
    'command': "src\\interface\\command",
    'query': "src\\interface\\query",
    'application-service': "src\\core\\application\\services",
    'domain-service': "src\\core\\domain\\services",
    'port': "src\\core\\application\\ports",
    'adapter': "src\\infrastructure\\adapters",
}

function convertToKebabCase(str: string): string {
    const kebabCase = str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    return kebabCase;
}

// Function to create a file from a template
function createFile(templateName: string, fileName: string, name: string) {
    const templatePath = path.join(templatesDir, `${templateName}.template`);
    const fileContent = fs.readFileSync(templatePath, 'utf-8');
    const replacedContent = fileContent.replace(/{{name}}/g, name); // Replace placeholders with actual name
    
    // Ensure directories exist
    const directory = dirname(fileName);
    fs.mkdirSync(directory, { recursive: true });

    // Write file
    fs.writeFileSync(fileName, replacedContent);
}


// CLI commands
yargs(hideBin(process.argv))
  .command('generate <type> <name>', 'Generate a component of specified type', (yargs) => {
    return yargs.positional('type', {
      type: 'string',
      choices: ['dto', 'controller', 'command', 'query', 'application-service', 'domain-service', 'port', 'adapter'],
      describe: 'the type of component to generate'
    }).positional('name', {
      type: 'string',
      describe: 'the name of the component'
    });
  }, function (argv) {
    const { type, name } = argv;
    const fileName = `${name}.${type}.ts`;

    const filePath = `${process.cwd()}/${typePaths[type!]}/${convertToKebabCase(name!)}/${convertToKebabCase(fileName)}`;
    console.log(filePath);
    // Call createFile with the correct parameters
    createFile(type!, filePath, name!);
  })
  .help()
  .argv;
