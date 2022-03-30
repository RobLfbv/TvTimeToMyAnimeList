import Router from './Router';
import InsertPage from './pages/insertPage';
import GetTokenPage from './pages/getTokenPage';

const insertPage = new InsertPage(),
	getTokenPage = new GetTokenPage();
Router.routes = [
	{ path: '/Adding', page: insertPage, title: 'Add your anime !' },
	{ path: '/', page: getTokenPage, title: 'Your Token !' },
];

Router.titleElement = document.querySelector('.pageTitle');
Router.contentElement = document.querySelector('.pageContent');
Router.menuElement = document.querySelector('.mainMenu');

window.onpopstate = () => {
	Router.navigate(document.location.pathname, false);
};
Router.navigate(document.location.pathname);
