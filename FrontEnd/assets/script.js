

const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();
console.log(works[0]);

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
}
genererWork(works);

function buttonClassReset() {
	const allButton = document.querySelectorAll(".button");
	allButton.forEach((element) => {
		element.classList.remove("button_activated");
		console.log(element.classList);
	});
}

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
    const workFilterObj = works.filter(function(work){
        return work.categoryId == 1;
    })
	genererWork(workFilterObj);
});

const appartementsFiltre = document.querySelector(".btn-appartements");
appartementsFiltre.addEventListener("click", function () {
	buttonClassReset();

	appartementsFiltre.classList.add("button_activated");
	const workFilterObj = works.filter(function(work){
        return work.categoryId == 2;
    })
	genererWork(workFilterObj);
});

const hotresFiltre = document.querySelector(".btn-hotres");

hotresFiltre.addEventListener("click", function () {
	buttonClassReset();
	hotresFiltre.classList.add("button_activated");
	const workFilterObj = works.filter(function(work){
        return work.categoryId == 3;
    })
	genererWork(workFilterObj);
});

const submitInfo = document.querySelector(".login-form")
submitInfo.addEventListener("submit", function (event) {
    console.log('yo')
    event.preventDefault()
    const login = {
        email: event.target.querySelector("name=email").value,
        password: event.target.querySelector("name=pass").value
    }
    const sendLogin = fetch('http://localhost:5678/api/users/login', {
    method: "POST",
    headers: {"content-type": "application/json"},
    body:JSON.stringify(login)
})
console.log(sendLogin)
})
