let section = document.querySelector("section");
let add = document.querySelector("form button");
// console.log(add);
add.addEventListener("click", e => {
    e.preventDefault();

let form = e.target.parentElement;
let todoText = form.children[0].value;
let todoYear = form.children[1].value;
let todoMonth = form.children[2].value;
let todoDate = form.children[3].value;
// console.log(todoText, todoYear, todoMonth, todoDate);
//提示未輸入資料
if (todoText === "") {
    alert("請輸入事項");
    return;
}

//新增div.todo
let todo = document.createElement("div");
todo.classList.add("todo");

//新增p class='todo-text'
let text = document.createElement("p");
text.classList.add("todo-text");
text.innerText = todoText;
//新增p class='todo-time'
let time = document.createElement("p");
time.classList.add("todo-time");
time.innerText = todoYear + "/" + todoMonth + "/" + todoDate;

todo.appendChild(text);
todo.appendChild(time);

//設定按鈕圖示-打勾按鈕
let completeButton = document.createElement("button");
completeButton.classList.add("complete");
completeButton.innerHTML = '<i class="fas fa-check"></i>'
//事項完成時標示記號
completeButton.addEventListener("click", e => {
    // console.log(e.target);
    let todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");
});

//設定按鈕圖示-垃圾桶按鈕
let trashButton = document.createElement("button");
trashButton.classList.add("trash");
trashButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
//設定移除動畫與特效
trashButton.addEventListener("click", e => {
    let todoItem = e.target.parentElement;

    todoItem.addEventListener("animationend", () => {
        todoItem.remove();
    })

    todoItem.style.animation = "scaleDown 0.3s forwards";
});

todo.appendChild(completeButton);
todo.appendChild(trashButton);

//新增事項時彈出動畫
todo.style.animation = "scaleUp 0.3s forwards";


// form.children[0].value = "";
// form.children[1].value = "";
// form.children[2].value = "";
// form.children[3].value = "";

//將資料以陣列方式存入localStorage
let myTodo = {
    todoText: todoText,
    todoYear: todoYear,
    todoMonth: todoMonth,
    todoDate: todoDate,
};

let myList = localStorage.getItem("list");
if (myList == null) {
    localStorage.setItem("list", JSON.stringify([myTodo]))
}else{
    let myListArray = JSON.parse(myList);
    myListArray.push(myTodo);
    localStorage.setItem("list", JSON.stringify(myListArray));
};
console.log(JSON.parse(localStorage.getItem("list")));

//按下新增事項按鈕後清空輸入框
form.children[0].value = "";
form.children[1].value = "";
form.children[2].value = "";
form.children[3].value = "";

section.appendChild(todo);
});

loadData();
function loadData(){

    //重新開啟網頁時讀取localStorage資料//
    let myList = localStorage.getItem("list");
    if (myList !== null){
    let myListArray = JSON.parse(myList);
    myListArray.forEach(item =>{

    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = item.todoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = item.todoYear + "/" + item.todoMonth + "/" + item.todoDate;


    todo.appendChild(text);
    todo.appendChild(time);

    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completeButton.addEventListener("click" , e=>{
    let todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");
    });

    let trashButton = document.createElement("Button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fas fa-trash-alt"></i>';


    trashButton.addEventListener("click", e=>{
    let todoItem = e.target.parentElement;
    todoItem.addEventListener("animationend" , () =>{
    //刪除localStorage資料//
    let text = todoItem.children[0].innerText;
    let myListArray = JSON.parse(localStorage.getItem("list"));
    myListArray.forEach((item, index) =>{
        if(item.todoText == text) {
        myListArray.splice(index, 1);
        localStorage.setItem("list" , JSON.stringify(myListArray));
    }
    })
    todoItem.remove();
    })
    todoItem.style.animation = "scaleDown 0.5s forwards";
    });


    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    todo.style.animation = "scaleUp 1s forwards";

    section.appendChild(todo);

        })
    }
}
 
//時間排序,比較函式 //
function mergeTime(arr1, arr2){
    let result = [];
    let i = 0;
    let j = 0;
    while (i< arr1.length && j < arr2.length) {
        if(Number(arr1[i].todoYear) > Number(arr2[j].todoYear)){
            result.push(arr2[j]);
            j++;
        }else if (Number(arr1[i].todoYear) < Number(arr2[j].todoYear)){
            result.push(arr1[i]);
            i++;
        }else if (Number(arr1[i].todoYear) == Number(arr2[j].todoYear)){
            if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)){
                result.push(arr2[j]);
                j++;
            }else if(Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)){
                result.push(arr1[i]);
                i++;
                }else if(Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)){
                    if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)){
                        result.push(arr2[j]);
                        j++;
                    }else{
                    result.push(arr1[i]);
                    i++;
                }
            }
        }
    }
    while (i < arr1.length){
    result.push(arr1[i]);
    i++;
    }
    while (j < arr2.length){
    result.push(arr2[j]);
    j++;
    }
    return result;

}

function mergeSort(arr) {
    if (arr.length === 1) {
        return arr;
    }else {
        let middle = Math.floor(arr.length / 2 );
        let right = arr.slice(0, middle);
        let left = arr.slice(middle, arr.length);
        return mergeTime(mergeSort(right), mergeSort(left));
    }
}
console.log(mergeSort(JSON.parse(localStorage.getItem("list"))));

//建立按鈕功能
let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {

    let sortedArry = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArry));

    let len = section.children.length;
    for (let i= 0; i< len; i++){
        section.children[0].remove();
    }
    loadData();
});

