import Page from './Page';

export default class GetTokenPage extends Page {
	saisie;
	json;
	index = 0;
	offset = 0;

	constructor() {
		super('insertPage');
	}

	render() {
		const html =
			/*html*/
			`
            <H1>Hello ! :) Welcome on my website ! Here, you have a simplifed way to add your TvTime show list in your MyAnimeList anime list ! </h1>
            <h2> First of all go on this link</h2> `;
		return html;
	}

	mount(element) {
		super.mount(element);
		let public_api_key;
		let private_api_key;
		let code_challenge;
		fetch('../api_id.json')
			.then(response => response.json())
			.then(data => {
				public_api_key = data.PUBLIC_API_KEY;
				private_api_key = data.PRIVATE_API_KEY;
				code_challenge = data.CODE_CHALLENGE;
			})
			.then(
				() =>
					(document.querySelector(
						'.pageContent'
					).innerHTML += `<a href="https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${public_api_key}&code_challenge=${code_challenge}">Link to allow and obtain token</a>`)
			);
	}
}
