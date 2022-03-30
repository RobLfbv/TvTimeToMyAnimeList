export default class Router {
	static titleElement;
	static contentElement;
	static routes = [];

	static #menuElement;

	static set menuElement(element) {
		this.#menuElement = element;
		const links = this.#menuElement.querySelectorAll('a');
		links.forEach(link =>
			link.addEventListener('click', event => {
				event.preventDefault();
				this.navigate(event.currentTarget.getAttribute('href'));
			})
		);
	}

	static navigate(path, pushState = true) {
		let route = this.routes.find(route => {
			return path.match(route.path) == path;
		});

		if (route) {
			if (route.title != '') {
				this.titleElement.innerHTML = `<h1>${route.title}</h1>`;
			} else {
				this.titleElement.innerHTML = '';
			}

			if (path.includes('/serie-')) {
				route.page.setId(path.split('-')[1]);
			}

			this.contentElement.innerHTML = route.page.render();
			route.page.mount?.(this.contentElement);

			const previousMenuLink = this.#menuElement.querySelector('.active'),
				newMenuLink = this.#menuElement.querySelector(`a[href="${path}"]`);
			previousMenuLink?.classList.remove('active');
			newMenuLink?.classList.add('active');

			if (pushState) {
				window.history.pushState(null, null, path);
			}
		}
	}
}
