const submitInfo = document.querySelector(".login-form");
export let userToken = 0;
submitInfo.addEventListener("submit", async function (event) {
	event.preventDefault();
	const login = {
		email: event.target.querySelector("[name=email").value,
		password: event.target.querySelector("[name=pass]").value,
	};
	const reponse = await fetch("http://localhost:5678/api/users/login", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(login),
	});
	if (reponse.status === 200) {
		const reponseObj = await reponse.json();
		userToken = reponseObj.token;
		window.localStorage.setItem("token", userToken);
		location.href = "index.html";
	} else {
		alert("mauvais email ou mot de passe");
	}
});
