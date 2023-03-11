import domready from 'domready';
import { init } from 'Models/utils/app';
import { dispatch } from 'Models/utils/event-bus';
import 'Bootstrap';
import { async } from 'regenerator-runtime';

domready(() => {
	dispatch('domready');
	init();
	loadCrewHtml();
	addEventListener();
});

export function addEventListener () {
	document.getElementById('getAll').addEventListener('click', filtered);
	document.getElementById('getTrim').addEventListener('click', filtered);
	document.getElementById('getTactic').addEventListener('click', filtered);
	document.getElementById('getHelmsman').addEventListener('click', filtered);

	document.getElementById('rowFour').addEventListener('click', filtered);
	document.getElementById('rowFive').addEventListener('click', filtered);
	document.getElementById('rowSix').addEventListener('click', filtered);

	document.getElementById('rowOne').addEventListener('click', filtered);
	document.getElementById('rowTwo').addEventListener('click', filtered);

	const crewButton = document.getElementsByClassName('crew-button-event');
	crewButton[0].setAttribute('id', 'loadMoreButton');

	document.getElementById('loadMoreButton').addEventListener('click', filtered);
}

async function loadCrew (filterInfo) {
	let url = '';
	if (filterInfo === undefined) {
		url = 'https://challenge-api.view.agentur-loop.com/api/';
	} else {
		url = 'https://challenge-api.view.agentur-loop.com/api/' + filterInfo;
	}

	const headers = { Authorization: 'Bearer 0123456789' };
	const response = await fetch(url, {
		method: 'GET',
		mode: 'cors',
		headers,
	});

	return response.json();
}

export function filtered (event) {
	const htmlContainer = document.getElementById('crew__inner');
	const numberToLoad = htmlContainer.children.length + 5;

	switch (event.target.id) {
	case 'getAll':
		removeAllChildNodes(htmlContainer);
		loadCrewHtml('?limit=100');
		break;
	case 'getTrim':
		removeAllChildNodes(htmlContainer);
		loadCrewHtml('?duty=trim&limit=100');
		break;
	case 'getTactic':
		removeAllChildNodes(htmlContainer);
		loadCrewHtml('?duty=tactic&limit=100');
		break;
	case 'getHelmsman':
		removeAllChildNodes(htmlContainer);
		loadCrewHtml('?duty=helmsman&limit=100');
		break;
	case 'rowOne':
		changeElementsPerRow(100);
		break;
	case 'rowTwo':
		changeElementsPerRow(50);
		break;
	case 'rowFour':
		changeElementsPerRow(25);
		break;
	case 'rowFive':
		changeElementsPerRow(20);
		break;
	case 'rowSix':
		changeElementsPerRow(16.66);
		break;
	case 'loadMoreButton':
		removeAllChildNodes(htmlContainer);
		loadCrewHtml('?limit=' + numberToLoad);
		break;
	}
}

function loadCrewHtml (filterInfo) {
	loadCrew(filterInfo).then((crew) => {
		const crewObjectsValues = Object.values(crew.data);

		const htmlContainer = document.getElementById('crew__inner');

		crewObjectsValues[0].forEach(function (member) {
			const memberHtmlContainer = document.createElement('div');
			memberHtmlContainer.classList.add('crew__container');
			const memberHtmlImage = Object.assign(
				document.createElement('img'),
				{ src: member.image });

			memberHtmlImage.classList.add('crew__image');

			const memberHtmlInfo = document.createElement('div');
			memberHtmlInfo.classList.add('crew__info');
			const memberHtmlInfoTitle = Object.assign(
				document.createElement('div'),
				{ innerText: member.name });
			memberHtmlInfoTitle.classList.add('crew__info-title');

			const memberHtmlInfoSubtitle = Object.assign(
				document.createElement('div'),
				{ innerText: member.duties });

			memberHtmlInfoSubtitle.classList.add('crew__info-subtitle');

			memberHtmlInfo.appendChild(memberHtmlInfoTitle);
			memberHtmlInfo.appendChild(memberHtmlInfoSubtitle);
			memberHtmlContainer.appendChild(memberHtmlImage);
			memberHtmlContainer.appendChild(memberHtmlInfo);
			htmlContainer.appendChild(memberHtmlContainer);

			changeElementsPerRow(20);
		});
	},
	);
}

function changeElementsPerRow (rowNumber) {
	const crewContainer = document.querySelectorAll('.crew__container');

	if (rowNumber) {
		crewContainer.forEach(memberContainer => {
			memberContainer.style.flexBasis = rowNumber + '%';
			switch (rowNumber) {
			case 100:
				memberContainer.lastChild.setAttribute('class', 'crew__info');
				memberContainer.lastChild.classList.add('crew__info-rowOne');
				break;
			case 50:
				memberContainer.lastChild.setAttribute('class', 'crew__info');
				memberContainer.lastChild.classList.add('crew__info-rowTwo');
				break;
			case 25:
				memberContainer.lastChild.setAttribute('class', 'crew__info');
				memberContainer.lastChild.classList.add('crew__info-rowFour');
				break;
			case 20:
				memberContainer.lastChild.setAttribute('class', 'crew__info');
				memberContainer.lastChild.classList.add('crew__info-rowFive');
				break;
			case 16.66:
				memberContainer.lastChild.setAttribute('class', 'crew__info');
				memberContainer.lastChild.classList.add('crew__info-rowSix');
				break;
			}
		});
	}
}

function removeAllChildNodes (parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}
