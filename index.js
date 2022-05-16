#!/user/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import pkg from 'nanospinner';
const { createSpinner } = pkg;

import fetch from 'node-fetch';
import fs from "fs";




let response = { githubApiKeyBool: false, githubApiKey: "", githubUser: "" };
let json = [];

const sleep = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));

async function welcome() {
	console.log(chalk.green('Welcome to the GR-CSV CLI !'));
	console.log(chalk.blue('Retrieve all repositories by name with url on csv !'));
}

async function askGithubUser() {
	const questions = await inquirer.prompt({
		type: 'input',
		name: 'githubUser',
		message: 'Enter your github username:',
		validate: function (value) {
			if (!value)
				return 'Please enter your github username';
			else {
				response.githubUser = value;
				return true;
			}

		}
	});
}

async function askGithubApiKey() {
	const questions = await inquirer.prompt({
		type: 'list',
		name: 'githubApiKey',
		message: 'Do you have a github API key ?',
		choices: [
			{
				name: 'Yes',
				value: true
			},
			{
				name: 'No',
				value: false
			}
		],
		default: false
	});
	if (questions.githubApiKey) {
		response.githubApiKeyBool = true;
		const questions = await inquirer.prompt({
			type: 'input',
			name: 'githubApiKey',
			message: 'Enter your github API key:',
			validate: function (value) {
				if (!value)
					return 'Please enter your github API key';
				else {
					response.githubApiKey = value;
					return true;
				}
			}
		});
	}
}

async function fetchGithubRepo() {
	//fetch github api
	const spinner = createSpinner('Fetching github repos...').start();
	const url = `https://api.github.com/users/${response.githubUser}/repos?per_page=10000&page=11"`;
	const headers = {
		'Content-Type': 'application/json',
		'Accept': 'application/vnd.github.v3+json',
	};
	if (response.githubApiKeyBool) {
		headers.Authorization = `token ${response.githubApiKey}`;
	}
	let githubApiResponse = {};
	try {
		githubApiResponse = await fetch(url, {
			method: 'GET',
			headers: headers
		});
	} catch (error) {
		console.log(chalk.red(error));
	}
	const githubApiResponseJson = await githubApiResponse.json();
	if(githubApiResponseJson.length > 0){
		let i = 0;
		githubApiResponseJson.forEach(repo => {
			i++;
			json.push({"repo": repo.name,"url": repo.html_url});
		});
		spinner.success({text: `${i} repositories found` })
	}
	else{
		spinner.error({text: `No repositories found` })
		process.exit(1);
	}
}

async function convertJsonToCsv() {
	const spinner = createSpinner('Convert to csv...').start();
	let csv = json.map(function (obj) {
		return Object.keys(obj).map(function (key) {
			return obj[key];
		}).join(',');
	}).join('\n');
	//write csv
	fs.writeFile(`${response.githubUser}.csv`, csv, function (err) {
		if (err) throw err;
		spinner.success({text: `CSV file has been saved !` })
	});
}



await welcome();
await askGithubUser();
await fetchGithubRepo();
await convertJsonToCsv();