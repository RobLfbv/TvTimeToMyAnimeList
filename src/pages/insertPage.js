import Page from './Page';

export default class insertPage extends Page {
	saisie;
	json;
	index = 0;
	offset = 0;
	token;

	constructor() {
		super('insertPage');
	}

	render() {
		const html =
			/*html*/
			`
        <form class="inputHtml">
			<label>Token</label>
			<input type="text" name="token" required>
			<label>HTML</label>
            <input type="text" name="saisie" required>
            <input type="submit" value="submit">
        </form>`;
		return html;
	}

	mount(element) {
		super.mount(element);
		const form = document.querySelector('.inputHtml');
		this.saisie = form?.querySelector('input[name=saisie]');
		form.addEventListener('submit', event => {
			event.preventDefault();
			this.token = document.querySelector('input[name=token]').value;
			this.toJson();
			this.createValidate();
		});
	}

	toJson() {
		const parser = new DOMParser();
		const test = parser.parseFromString(this.saisie.value, 'text/html');
		const list = test.querySelectorAll('.show');
		let i = 1;
		let text = '[';
		list.forEach(show => {
			if (
				show
					.querySelector('.show-link > .image-crop > .progress > .progress-bar')
					.getAttribute('style') != 'width: 0%'
			) {
				let showName = show.querySelector(
					'.show > .poster-details > h2 > a'
				).innerHTML;
				showName = showName.replace(/\s/g, '');
				let showImage = show
					.querySelector('.show-link > .image-crop > img')
					.getAttribute('src');
				let watchTime = show.querySelector(
					'.show > .poster-details > h3'
				).innerHTML;
				let percentage = show
					.querySelector('.show-link > .image-crop > .progress > .progress-bar')
					.getAttribute('style')
					.split(' ')[1];
				if (i == list.length) {
					text += `{"name":"${String(showName)}", "image":"${String(
						showImage
					)}", "timeWatched":"${watchTime}", "percentage":"${percentage}"}`;
				} else {
					text += `{"name":"${String(showName)}", "image":"${String(
						showImage
					)}",  "timeWatched":"${watchTime}", "percentage":"${percentage}"},`;
				}
			}
			i++;
		});
		text += ']';

		this.json = JSON.parse(text);

		console.log(this.json);
	}

	createValidate() {
		const container = document.querySelector('.pageContent');
		let html = '';
		html += /*html*/ `
        <section class="acceptSerie">
            <h2>${this.json[this.index].name}</h2>
            <img src="${this.json[this.index].image}"/>
			<h4>You've watched ${this.json[this.index].timeWatched}</h4> 
			<h4>Completion : ${this.json[this.index].percentage}</h4>
			<h4>Approximately : ${this.calculateEp(
				this.json[this.index].timeWatched
			)} Episodes (With: 24 min per episode and Time on TvTime but it's approximate)</h4>
			<button id="passButton"> Not an Anime ? Or Don't want to Add ?</button>
            <form class="validate">
        `;

		fetch(
			`http://localhost:8080/https://api.myanimelist.net/v2/anime?q=${
				this.json[this.index].name
			}&limit=5&fields=id,title,main_picture,alternative_titles,synopsis,num_episodes,average_episode_duration`,
			{
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + this.token,
				},
			}
		)
			.then(response => response.json())
			.then(data => {
				data.data.forEach(showSearched => {
					html +=
						/*html*/
						`<section class="showR">
                            <h3>${showSearched.node.title} : ${
							showSearched.node.num_episodes
						} Episodes</h3>
							<h3>${showSearched.node.average_episode_duration / 60} minutes per episode</h3>
                            <img src="${showSearched.node.main_picture.large}"/>
							<label>Add the anime ?</label>
                            <input type="checkbox" name="checkbox_to_add" value="${
															showSearched.node.id
														}"/>
							<label>Status</label>
								<select id="status${showSearched.node.id}" name="status" size="5" >
 									<option value="watching">Watching</option>
									<option value="completed" selected="selected">Completed</option>
									<option value="on_hold">On Hold</option>
									<option value="dropped">Dropped</option>
									<option value="plan_to_watch">Plan To Watch</option>
								</select>
								<label>Is Rewatching</label>
								<input type="checkbox" name="is_rewatching" id="is_rewatching${
									showSearched.node.id
								}">
								<label>Score</label>
								<input type="number" name="score" id="score${showSearched.node.id}" value="0">
								<label>Num Watched Episodes</label>
								<input type="number" name="num_watched_episodes" id="num_watched_episodes${
									showSearched.node.id
								}" value="0">
								<label>Num Times Rewatched</label>
								<input type="number" name="num_times_rewatched" id="num_times_rewatched${
									showSearched.node.id
								}" value="0">
								<p>${showSearched.node.synopsis}</p>
                        </section>`;
				});
			})
			.then(() => {
				html +=
					/*html*/
					`<span id="addAnime"></span>
					<input type="submit" value="submit">
                	</form>
					<button id="notEnough">Not Enough ? Add 5 anime</button>
					</section>`;
				container.innerHTML = html;
				this.offset++;
			})
			.then(() => {
				const formValidate = document.querySelector('.validate');
				document
					.getElementById('passButton')
					.addEventListener('click', event => {
						event.preventDefault();
						this.index++;
						container.innerHTML = '';
						this.createValidate();
					});

				document
					.getElementById('notEnough')
					.addEventListener('click', event => {
						event.preventDefault();
						let htmlAdd = '';
						fetch(
							`http://localhost:8080/https://api.myanimelist.net/v2/anime?offset=${
								this.offset * 5
							}&q=${
								this.json[this.index].name
							}&limit=5&fields=id,title,main_picture,alternative_titles,synopsis,num_episodes,average_episode_duration`,
							{
								method: 'GET',
								headers: {
									Authorization: 'Bearer ' + this.token,
								},
							}
						)
							.then(response => response.json())
							.then(data => {
								data.data.forEach(showSearched => {
									htmlAdd +=
										/*html*/
										`<section class="showR">
										<h3>${showSearched.node.title} : ${showSearched.node.num_episodes} Episodes</h3>
										<h3>${showSearched.node.average_episode_duration / 60} minutes per episode</h3>
										<img src="${showSearched.node.main_picture.large}"/>
											<label>Add the anime ?</label>
											<input type="checkbox" name="checkbox_to_add" value="${showSearched.node.id}"/>
											<label>Status</label>
												<select id="status${showSearched.node.id}" name="status" size="5" >
													 <option value="watching">Watching</option>
													<option value="completed" selected="selected">Completed</option>
													<option value="on_hold">On Hold</option>
													<option value="dropped">Dropped</option>
													<option value="plan_to_watch">Plan To Watch</option>
												</select>
												<label>Is Rewatching</label>
												<input type="checkbox" name="is_rewatching" id="is_rewatching${
													showSearched.node.id
												}">
												<label>Score</label>
												<input type="number" name="score" id="score${showSearched.node.id}" value="0">
												<label>Num Watched Episodes</label>
												<input type="number" name="num_watched_episodes" id="num_watched_episodes${
													showSearched.node.id
												}" value="0">
												<label>Num Times Rewatched</label>
												<input type="number" name="num_times_rewatched" id="num_times_rewatched${
													showSearched.node.id
												}" value="0">
												<p>${showSearched.node.synopsis}</p>
										</section>`;
								});
							})
							.then(() => {
								document.getElementById('addAnime').innerHTML += htmlAdd;
								this.offset++;
							});
					});
				formValidate.addEventListener('submit', event => {
					event.preventDefault();
					const checked = document.querySelectorAll(
						'input[name=checkbox_to_add]'
					);
					let counter = 0;
					checked.forEach(element => {
						if (element.checked) {
							let formdata = '';
							formdata += `status=${
								document.getElementById(
									`status${element.getAttribute('value')}`
								).value
							}`;
							formdata += '&';
							formdata += `score=${
								document.getElementById(`score${element.getAttribute('value')}`)
									.value
							}`;
							formdata += '&';
							formdata += `num_watched_episodes=${
								document.getElementById(
									`num_watched_episodes${element.getAttribute('value')}`
								).value
							}`;
							formdata += '&';
							formdata += `num_times_rewatched=${
								document.getElementById(
									`num_times_rewatched${element.getAttribute('value')}`
								).value
							}`;
							fetch(
								`http://localhost:8080/https://api.myanimelist.net/v2/anime/${element.getAttribute(
									'value'
								)}/my_list_status`,
								{
									method: 'PATCH',
									headers: {
										'Content-Type': 'application/x-www-form-urlencoded',
										Authorization: 'Bearer ' + this.token,
									},
									body: formdata,
								}
							);
						}
						counter++;
						if (counter == checked.length) {
							this.index++;
							this.createValidate();
						}
					});
				});
			});
	}
	calculateEp(time) {
		const tabTime = time.split(' ');
		let days;
		let hours;
		let minutes;
		for (let i = 0; i < tabTime.length; i++) {
			if (tabTime[i] === 'days') {
				days = tabTime[i - 1];
			}
			if (tabTime[i] === 'hours') {
				hours = tabTime[i - 1];
			}
			if (tabTime[i] === 'minutes') {
				minutes = tabTime[i - 1];
			}
		}
		let result = 0;
		if (days != undefined) result += (days * 1440) / 24;
		if (hours != undefined) result += (hours * 60) / 24;
		if (minutes != undefined) result += minutes / 24;
		return result;
	}
}
