// get user input and print it out
const date = document.querySelector(".cont-date");
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const d = new Date();
date.textContent = `
${weekday[d.getDay()]} - 
${d.getDate()}/${d.getMonth() < 9 ? "0" + d.getMonth() : d.getMonth()}/${d.getFullYear()}`;
const form = document.querySelector(".form");
const input = document.querySelector(".form-input");
const ul = document.querySelector(".cont-list");
// set a custom event with details needed
const evItemUpdate = new CustomEvent("itemUpdate");

// update taskList to localStorage, if no item set to empty array
let taskList = mirrorLocalStorage() ? mirrorLocalStorage() : [];
loadTask();

function loadTask() {
	taskList.forEach(t => printTask(t));
}

function handleClick(e) {
	const name = e.target.localName;
	if (name === "button") {
		const id = e.target.closest("li").getAttribute("value");
		delItem(id);
	}
	if (name === "input") {
		const id = e.target.closest("li").getAttribute("value");
		checkItem(id);
	}
}

function handleSubmit(e) {
	e.preventDefault();
	// create a new task
	const task = {
		task: input.value,
		id: Date.now().toString(),
		completed: false,
	};
	// push task to taskList
	taskList.push(task);

	// dispatch the event
	ul.dispatchEvent(evItemUpdate);
	e.target.reset();
}

// TODO FUNCTION: create a template fragment
function printTask() {
	const docFrag = document.createDocumentFragment();
	taskList.forEach(item => {
		const temp = document.querySelector("#template");
		const template = temp.content.cloneNode(true);
		const li = template.querySelector(".list-item");
		const span = template.querySelector(".list-item span");
		const input = template.querySelector(".list-item input");
		// set value of li to id
		li.setAttribute("value", item.id);
		// set task name to SPAN
		span.textContent = item.task;
		// set checked value to input
		input.checked = item.completed ? true : false;
		// append to Fragment
		docFrag.appendChild(li);
		// ul to print all
	});
	ul.textContent = "";
	ul.appendChild(docFrag);
}

// TODO FUNCTION: push it to localStorage
function updateLocalStorage() {
	localStorage.setItem("advanced-todo", JSON.stringify(taskList));
}

// TODO FUNCTION: mirror to localStorage
function mirrorLocalStorage() {
	return (list = JSON.parse(localStorage.getItem("advanced-todo")));
}

// TODO FUNCTION: delete item
function delItem(id) {
	taskList = taskList.filter(e => e.id !== id);
	ul.dispatchEvent(evItemUpdate);
}

// TODO FUNCTION: check item
function checkItem(id) {
	const whichId = taskList.find(e => e.id === id);
	whichId.completed = !whichId.completed;
	ul.dispatchEvent(evItemUpdate);
}

form.addEventListener("submit", handleSubmit);
ul.addEventListener("click", handleClick);
// ! custom event to update item
ul.addEventListener("itemUpdate", updateLocalStorage);
ul.addEventListener("itemUpdate", printTask);
