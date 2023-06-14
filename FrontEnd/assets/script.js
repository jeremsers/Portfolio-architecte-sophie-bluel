import { modalExec, modal2Exec } from "./modal.js";
let works = 0;

if (window.localStorage.getItem("token") !== null) {
	SetAdminLayout();
	addEditButton();
	logoutFunction();
	removeFilter();
	works = await getWorks()
	genererWork(works);
	modalExec();
	modal2Exec()
} else {
	works = await getWorks()
	genererWork(works);
	generateFilters();
}

/* generation du contenu du portfolio */
async function getWorks(){
	const reponse = await fetch("http://localhost:5678/api/works");
	works = await reponse.json();
	return works
}
function genererWork(works) {
	const gallery = document.querySelector(".gallery");
	gallery.innerHTML = "";
	for (let i = 0; i < works.length; i++) {
		const work = works[i];

		const figureElement = document.createElement("figure");
		const imageElement = document.createElement("img");
		imageElement.src = work.imageUrl;
		imageElement.alt = work.title;
		const figcaptionElement = document.createElement("figcaption");
		figcaptionElement.innerHTML = work.title;
		figureElement.appendChild(imageElement);
		figureElement.appendChild(figcaptionElement);
		gallery.appendChild(figureElement);
	}
	return works
}

/* Mise en place du mode admin */

function addEditButton() {
	//creation de la div contenat l'icone et le texte
	const editDiv = document.createElement("div");
	editDiv.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
	const editText = document.createElement("p");
	editText.innerText = "modifier";
	editDiv.appendChild(editText);
	//ajout de la div aux endroits nécessaires
	const Parent1 = document.querySelector(".figure-accueil");
	const editdivPhoto = editDiv.cloneNode(true);
	editdivPhoto.className = "edit-div-photo";
	Parent1.append(editdivPhoto);
	editDiv.className = "edit-div-title open-modal";
	const Parent2 = document.querySelector("#portfolio");
	Parent2.prepend(editDiv);
}
function SetAdminLayout() {
	const adminParent = document.querySelector("body");
	const adminElement = document.createElement("aside");
	adminElement.className = "admin-div";
	adminParent.prepend(adminElement);
	const editDivEvelement = document.createElement("div");
	editDivEvelement.className = "admin-div__editdiv";
	editDivEvelement.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
	const editText = document.createElement("p");
	editDivEvelement.appendChild(editText);
	editText.innerText = "Mode édition";
	const buttonElement = document.createElement("button");
	buttonElement.className = "admin-div__button";
	buttonElement.innerText = "publier les changements";
	adminElement.appendChild(editDivEvelement);
	adminElement.appendChild(buttonElement);
}

function logoutFunction() {
	const logoutBtn = document.querySelector(".login-btn");
	logoutBtn.innerHTML = "logout";
	logoutBtn.addEventListener("click", function (event) {
		event.preventDefault();
		window.localStorage.removeItem("token");
		location.reload();
	});
}

/* generation des filtres */

function buttonClassReset() {
	const allButton = document.querySelectorAll(".button");
	allButton.forEach((element) => {
		element.classList.remove("button_activated");
	});
}
function generateFilters() {
	const allFiltre = document.querySelector(".btn-all");
	allFiltre.addEventListener("click", function () {
		buttonClassReset();
		allFiltre.classList.add("button_activated");
		genererWork(works);
	});

	const objFiltre = document.querySelector(".btn-obj");
	objFiltre.addEventListener("click", function () {
		buttonClassReset();
		objFiltre.classList.add("button_activated");
		const workFilterObj = works.filter(function (work) {
			return work.categoryId == 1;
		});
		genererWork(workFilterObj);
	});

	const appartementsFiltre = document.querySelector(".btn-appartements");
	appartementsFiltre.addEventListener("click", function () {
		buttonClassReset();

		appartementsFiltre.classList.add("button_activated");
		const workFilterObj = works.filter(function (work) {
			return work.categoryId == 2;
		});
		genererWork(workFilterObj);
	});

	const hotresFiltre = document.querySelector(".btn-hotres");
	hotresFiltre.addEventListener("click", function () {
		buttonClassReset();
		hotresFiltre.classList.add("button_activated");
		const workFilterObj = works.filter(function (work) {
			return work.categoryId == 3;
		});
		genererWork(workFilterObj);
	});
}
/* Suppression des filtres en mode Admin */
function removeFilter() {
	const filterDiv = document.querySelector(".button-div");
	filterDiv.remove();
	const projetTitre = document.querySelector(".titre-projet");
	projetTitre.classList.add("titre-projet--admin");
}
