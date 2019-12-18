let calUl = document.querySelector("#calories-list");
let form = document.querySelector("#new-calorie-form");
let updateForm = document.querySelector("#edit-calorie-form");

let progressBar = document.querySelector("progress.uk-progress");
let totalCalorie = 0;

let bmrForm = document.querySelector("#bmr-calulator");

let spanMin = document.querySelector("#lower-bmr-range");
let spanMax = document.querySelector("#higher-bmr-range");


bmrForm.addEventListener("submit", (e) => {
    e.preventDefault();
    

    let inputs = e.target.querySelectorAll(".uk-input");

    let height = parseInt(inputs[0].value);
    let weight = parseInt(inputs[1].value);
    let age = parseInt(inputs[2].value);

    let minNum = Math.round(655 + (4.35 * weight) + (4.7 * height) - (4.7 * age));
    let maxNum = Math.round(66 + (6.23 * weight) + (12.7 * height) - (6.8 * age));

    spanMin.innerText = minNum;
    spanMax.innerText = maxNum;

    e.target.reset();
});


//get all calories
fetch("http://localhost:3000/api/v1/calorie_entries")
    .then(resp => resp.json())
    .then(data => {
        data.forEach((obj) => {
            turnObjToHtml(obj)
        });
    });

//turn object to html format
function turnObjToHtml(calObj) {

    totalCalorie += calObj.calorie;
    progressBar.value = totalCalorie;

    //create element list
    let calLi = document.createElement("li");
    calLi.classList.add("calories-list-item");

    //put everything in list
    calLi.innerHTML = `
        <div class="uk-grid">
            <div class="uk-width-1-6">
                <strong id="${calObj.id}-strong">${calObj.calorie}</strong>
                <span>kcal</span>
            </div>
            <div class="uk-width-4-5">
                <em class="uk-text-meta" id="${calObj.id}-em">${calObj.note}</em>
            </div>
        </div>
        <div class="list-item-menu">
            <a class="edit-button" uk-icon="icon: pencil" uk-toggle="target: #edit-form-container"></a>
            <a class="delete-button" uk-icon="icon: trash"></a>
        </div>
    `;

    calUl.append(calLi);
    
    let deleteBtn = calLi.querySelector(".delete-button");
    let updateBtn = calLi.querySelector(".edit-button");

    //delete button
    deleteBtn.addEventListener('click', () => {
        
        //delete does not require headers and body;
        fetch(`http://localhost:3000/api/v1/calorie_entries/${calObj.id}`, {
            method: "DELETE"
        })
        .then(resp => resp.json())
        .then(() => calLi.remove());
    });

    //update button
    updateBtn.addEventListener('click', () => {
        //target update form input
        let updateInput = updateForm.querySelector(".uk-input");
        //assign input with data-id
        updateInput.dataset.id = calObj.id;        
    });

}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.target.reset();
    
    let parentDivs = e.target.querySelectorAll(".uk-margin-small");
    let inputVal = parentDivs[0].firstElementChild.value;
    let textVal = parentDivs[1].firstElementChild.value;

    fetch("http://localhost:3000/api/v1/calorie_entries", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            calorie: parseFloat(inputVal),
            note: textVal
        })
    })
    .then(res => res.json())
    .then((newObj) => {
        turnObjToHtml(newObj);
    });
});

updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let parentDivs = e.target.querySelectorAll(".uk-margin-small");
    let input = parentDivs[0].firstElementChild;
    let textarea = parentDivs[1].firstElementChild;
    
    let inputVal = input.value;
    let textVal = textarea.value;
    let id = input.dataset.id
    
    fetch(`http://localhost:3000/api/v1/calorie_entries/${id}`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            calorie: inputVal,
            note: textVal
        })
    })
    .then(res => res.json())
    .then(updatedObj => {

        let strongTag = document.getElementById(`${updatedObj.id}-strong`);
        let emTag = document.getElementById(`${updatedObj.id}-em`);

        strongTag.innerText = updatedObj.calorie;
        emTag.innerText = updatedObj.note;
    });
    
});




