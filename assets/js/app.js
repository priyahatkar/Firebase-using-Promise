const cl = console.log;

const postForm =document.getElementById('postForm');
const submitBtn =document.getElementById('submitBtn');
const updateBtn =document.getElementById('updateBtn');
const titleControl =document.getElementById('title');
const contentControl =document.getElementById('content');



let baseUrl= `https://firbase-xhr-default-rtdb.asia-southeast1.firebasedatabase.app/`

let postUrl =`${baseUrl}/post.json`

// let singleUrl =`${baseUrl}/post/${editId}.json`

// let singlesUrl =`${baseUrl}/${editId}/post.json`

let postArray =[];

const templating =(arr) =>{
    let result = "";

    arr.forEach((str) =>{
        result +=`
                <div class="card mt-5" id="${str.id}">
                    <div class="card-header">
                    <h3>${str.title}</h3>
                    </div>
                    <div class="card-body">
                    <p> ${str.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary" onclick="onEdit(this)">
                            Edit
                        </button>
                        <button class="btn btn-danger" onclick="onDelete(this)">
                            Delete
                        </button>
                    </div>
                </div>
        
                `
    })
    postContainer.innerHTML = result;
}



const makeApiCall =(methodName, apiUrl, body)=>{
    return new Promise ((resolve, reject)=>{
        let xhr = new XMLHttpRequest();

        xhr.open(methodName, apiUrl)

        xhr.onload = function () {
            if(xhr.status >= 200 || xhr.status <= 300){
                resolve(xhr.response)
            }else{
                reject("something went wrong")
            }
        }
        xhr.send(JSON.stringify(body));
    })
}

makeApiCall("GET", postUrl)
.then((res)=>{
    // cl(res)
    let data =JSON.parse(res)
    for(let k in data){
        let obj ={
            ... data[k],
            id:k
        }
        postArray.push(obj)
    }
    templating(postArray)
})
.catch((err)=>{
    cl(err)
})

postForm.addEventListener("submit",(eve)=>{
    eve.preventDefault();

    let obj ={
        title: titleControl.value,
        body : contentControl.value,
    }
    makeApiCall("POST", postUrl, obj)
        .then((res)=>{
            // cl(res)
            let postData = JSON.parse(res)
            let card = document.createElement("div");
            card.id = postData.name;
            cl(card)
            card.className= "card mb-4"
            let result = `
                        <div class="card-header">
                            <h3>${obj.title}</h3>
                        </div>
                        <div class="card-body">
                            <p> ${obj.body}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-primary" onclick="onEdit(this)">
                                Edit
                            </button>
                            <button class="btn btn-danger" onclick="onDelete(this)">
                                Delete
                            </button>
                        </div>
                    `
                    card.innerHTML = result;
                    postContainer.append(card)
                    postForm.reset()
        })
        .catch((err)=>{
            cl(err)
        })
})

const onEdit = (e)=>{
    let editId = e.closest('.card').id;
    // cl(editId)
    localStorage.setItem('editId',editId);
    let editUrl =`${baseUrl}/post/${editId}.json`
    // cl(editUrl)

    makeApiCall("GET", editUrl)
        .then((res)=>{
            let editData =JSON.parse(res);
            titleControl.value = editData.title,
            contentControl.value = editData.body

        })
        .catch(cl)
        .finally(()=>{
            submitBtn.classList.add('d-none')
            updateBtn.classList.remove('d-none')
        })
}

updateBtn.addEventListener("click",(eve)=>{
    let updateId = localStorage.getItem("editId");
    // cl(updateId)

    let updateUrl = `${baseUrl}/post/${updateId}.json`
    // cl(updateUrl)

    let obj ={
        title : titleControl.value,
        body : contentControl.value
    }

    makeApiCall("PATCH", updateUrl, obj)
        .then((res)=>{
            let card = [...document.getElementById(updateId).children];
            // cl(card)
            card[0].innerHTML = `<h3>${obj.title}</h3>`;
            card[1].innerHTML = `<p> ${obj.body}</p>`;
        })
        .catch(cl)
        .finally(()=>{
            submitBtn.classList.remove('d-none')
            updateBtn.classList.add('d-none')
            postForm.reset()
        })
})



const onDelete = (ele) =>{
    let deleteId = ele.closest('.card').id;
    let deleteUrl =`${baseUrl}/post/${deleteId}.json`

    makeApiCall("DELETE", deleteUrl)
    .then(res =>{
        // cl(res)
        let deleteId1 = document.getElementById(deleteId)
        deleteId1.remove()
        // cl(deleteId1)
    })
    .catch(cl)
}