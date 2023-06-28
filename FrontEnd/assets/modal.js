import { genererWork, getWorks } from "./script.js";
const dialBox = document.querySelector(".modal1");
const dialBox2 = document.querySelector(".modal2");
const returnBtn = document.querySelector(".adialog__return");
const adialogdivContent = document.querySelector(".adialog__div").innerHTML;
const body = document.querySelector("body");
let works = 0;
let workArray = 0;
let modal1Opened = 0;
let addPhotoBtn = 0;
let imgFile = 0;

const sendButton = document.querySelector(".adialog__add");
const submitBtn = document.querySelector(".adialog__add");

/* Fonction permettant de gérer l'affichage et le comportement de la première modale */
export function modalExec() {
	const buttondial = document.querySelector(".edit-div-title");
	addPhotoBtn = document.querySelector(".dialog__add");
	dialBox.remove();
	dialBox2.remove();
	buttondial.addEventListener("click", async () => {
		modal1Opened = 0;
		body.appendChild(dialBox);
		dialBox.showModal();
		loopDelete();
		closeModal();
		modal1Opened++;
	});
}
/* Fonction permettant de gérer l'affichage et le comportement de la seconde modale */
export function modal2Exec() {
	addPhotoBtn.addEventListener("click", () => {
		if (modal1Opened === 1) {
			dialBox.close();
			dialBox.remove();
			body.appendChild(dialBox2);
			dialBox2.close();
			dialBox2.showModal();
			disableformReset();
			imgPreview();
			closeModal2();
			submitIfComplete();
		}

		modalBack();
		submitBtn.addEventListener("click", sendOnclick);
	});
}

/* Fonction générant les aperçus des travaux existants dans la modale */

async function genererWorkModal() {
	const reponse = await fetch("http://localhost:5678/api/works");
	const worksModal = await reponse.json();

	const gallery = document.querySelector(".dialog__div");
	gallery.innerHTML = "";
	for (let i = 0; i < worksModal.length; i++) {
		const work = worksModal[i];

		const figureElement = document.createElement("figure");
		figureElement.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
		const imageElement = document.createElement("img");
		imageElement.src = work.imageUrl;
		imageElement.alt = work.title;
		const figcaptionElement = document.createElement("figcaption");
		figcaptionElement.innerHTML = "éditer";
		figureElement.appendChild(imageElement);
		figureElement.appendChild(figcaptionElement);
		gallery.appendChild(figureElement);
	}
	return await worksModal;
}

/* Fonction permettant le retour à la première modale depuis la seconde */
function modalBack() {
	returnBtn.addEventListener("click", () => {
		imgClean();
		dialBox.close();
		dialBox2.close();
		dialBox2.remove();
		body.appendChild(dialBox);
		dialBox.showModal();
	});
}

/* Fonctions relatives à l'ajout de l'image dans la seconde modale */

function imgPreview() {
	if (document.querySelector(".adialog__div img") === null) {
		console.log("here");
		const addPhotoBtn = document.querySelector(".addPhotoBtn");
		addPhotoBtn.removeEventListener("click", addphotograph);
		addPhotoBtn.addEventListener("click", addphotograph);
	}
}
function addphotograph() {
	const addPhoto = document.querySelector("#photo");
	addPhoto.addEventListener("change", () => {
		imgFile = addPhoto.files[0];
		const imgdiv = document.querySelector(".adialog__div");
		if (imgFile.size > 4194304) {
			const imgParagraph = document.querySelector(".adialog__div p");
			imgParagraph.innerText =
				"La taille du fichier excède la taille maximale de 4 Mo";
		} else {
			imgdiv.innerHTML = "";
			const previewImg = document.createElement("img");
			const previewBlob = window.URL.createObjectURL(addPhoto.files[0]);
			previewImg.src = previewBlob;
			imgdiv.appendChild(previewImg);
		}
	});
}
function imgClean() {
	if (document.querySelector(".adialog__div img") !== null) {
		imgFile = 0;
		const imgdiv = document.querySelector(".adialog__div");
		imgdiv.innerHTML = adialogdivContent;
		const resetForm = document.querySelector("#add-img");
		resetForm.reset();
	}
}

/* fonctions relatives à la fermeture des modales */

function closeModal() {
	imgClean();
	const closeBtn = document.querySelector(".dialog__close");
	closeBtn.addEventListener("click", () => {
		dialBox.remove();
		dialBox.close();
	});
	dialBox.addEventListener("click", function (event) {
		let rect = dialBox.getBoundingClientRect();
		let isInDialog =
			rect.top <= event.clientY &&
			event.clientY <= rect.top + rect.height &&
			rect.left <= event.clientX &&
			event.clientX <= rect.left + rect.width;
		if (!isInDialog) {
			dialBox.remove();
			dialBox.close();
		}
	});
}
function closeModal2() {
	console.log("hey");
	const closeModal2 = document.querySelector(".adialog__close");
	closeModal2.addEventListener("click", () => {
		imgClean();
		dialBox2.remove();
		dialBox2.close();
	});
	dialBox2.addEventListener("click", function (event) {
		let rect = dialBox2.getBoundingClientRect();
		let isInDialog =
			rect.top <= event.clientY &&
			event.clientY <= rect.top + rect.height &&
			rect.left <= event.clientX &&
			event.clientX <= rect.left + rect.width;
		if (!isInDialog) {
			imgClean();
			dialBox2.remove();
			dialBox2.close();
		}
	});
}

/* Fonctions relatives à l'ajout d'une nouvelle entrée dans la DB */
function disableformReset() {
	sendButton.className = "adialog__add";
	sendButton.disabled = true;
}

function submitIfComplete() {
	const formSelector = document.querySelector("#add-img");
	const imgInput = document.querySelector("#photo");
	const titleInput = document.querySelector("#titre");

	formSelector.addEventListener("change", () => {
		if (imgFile === 0 || titleInput.value === "") {
			sendButton.className = "adialog__add";
			sendButton.disabled = true;
		} else {
			sendButton.className = "adialog__add adialog__add--valid";
			console.log("toggl");
			sendButton.disabled = false;
		}
	});
}

async function sendOnclick(event) {
	event.preventDefault();
	submitBtn.removeEventListener("click", sendOnclick);
	var formData = new FormData();
	formData.append("image", imgFile);
	formData.append("title", document.querySelector("#titre").value);
	formData.append("category", document.querySelector("#categorie").value);
	await fetch("http://localhost:5678/api/works", {
		method: "POST",
		headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}` },
		body: formData,
	});
	imgClean();
	dialBox2.remove();
	dialBox2.close();
	works = await getWorks();
	genererWork(works);
}
/* Fonctions relatives à la suppression d'une entrée dans la DB */

async function loopDelete() {
	workArray = await genererWorkModal();
	deleteWork();
	works = await getWorks();
	genererWork(works);
}

async function deleteWork() {
	const deleteBtn = document.querySelectorAll("dialog figure i");

	for (let i = 0; i < deleteBtn.length; i++) {
		const element = deleteBtn[i];
		const elementId = workArray[i].id;
		element.addEventListener("click", async () => {
			console.log(`deleted id :${elementId} `);
			const deleteReq = await fetch(
				`http://localhost:5678/api/works/${elementId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${window.localStorage.getItem("token")}`,
					},
				}
			);

			loopDelete();
		});
	}
}
