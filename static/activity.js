let abracadabra = [];
let chunk = 0;

async function init(id = 1){
  loading()
  const data = await activityData(id);
  if (data.length == 0) {
    $('#previous').setAttribute('disabled', '')
    $('#next').setAttribute('disabled', '')
    return $('#table-body').innerHTML = `
      <tr>
        <td colspan="3" class="bg-white border-b border-gray-200 p-5 text-lg">
          <p class="flex justify-center items-center gap-2 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
            </svg>
            Empty
          </p>
        </td>
      </tr>
    `;
  }
  const chunkData = parseChunk(data);
  $('#maxChunk').textContent = chunkData.length;
  abracadabra = chunkData;
  display()
  paginationButton()
}


/* Create new activity modal */
const openModal = () => {
  $("#newactivity-modal").classList.remove('hidden');
  
  const today = new Date().toISOString().split('T')[0];
  $("#date").value = today;
}
const closeModal = () => $("#newactivity-modal").classList.add('hidden');
async function newActivity(){
  const category = $("#category").value;
  const date = $("#date").value;
  const title = $("#title").value;
  const description = $("#description").value;
  const subject = $("#subject").value;
  try{
    const respo = await fetch(`/admin/api/create-activity`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        category: category,
        description: description,
        subject_id: subject,
        date: date
      })
    })
    const res = await respo.json();
    if (res?.error_message){
      // TODO: error message here
    }else{
      // TODO: not error message here
    }
  }
}

/* Deleting activity method */
const deleteActivity = async (id) => {
  const btn = $(`#rm-${id}`);
  btn.setAttribute('disabled', '')
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 animate-spin">
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>`;
  try{
    const res = await fetch(`/admin/api/delete-activity?id=${id}`);
    const data = await res.json();
    if (data.status === 'success'){
      $(`#activity-${id}`).remove()//classList.add('hidden')
      init($("#subject").value)
    }else{
      alert(data.message)
    }
  }catch(err){
    console.log("ERROR (deleteActivity): ", err.message)
  }finally{
    btn.removeAttribute('disabled')
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>`;
  }
}

/*
  Codes below is for pagination buttons and
  fetching data from database
*/
const nextChunk = () => {
  loading()
  ++chunk;
  display()
  paginationButton()
}
const previousChunk = () => {
  loading()
  --chunk;
  display()
  paginationButton()
}

$('#subject').onchange = async () => await init($("#subject").value);
window.onload = async () => await init();

function loading(){
  $('#table-body').innerHTML = `
      <tr>
        <td colspan="3" class="bg-white border-b border-gray-200 p-5 text-lg">
          <p class="flex justify-center items-center gap-2 text-emerald-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 animate-spin">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Loading
          </p>
        </td>
      </tr>
  `;
}
function display(){
  let tbody = "";
  abracadabra[chunk].forEach(ele => {
    tbody += tableTR(ele);
  })
  $('#table-body').innerHTML = tbody
}
function parseChunk(arr) { 
  let result = [];
  for (let i = 0; i < arr.length; i += 15) {
    result.push(arr.slice(i, i + 15));
  }
  return result;
}
async function activityData(subject_id){
  try{
    const respo = await fetch(`/admin/api/data/activities?subject_id=${subject_id}`);
    const data = await respo.json()
    if (data?.status === 'success') return data.data;
    if (data?.status === 'error') {console.log(data.message);}
    return [];
  }catch(err){
    console.error("ERROR: ", err.message)
  }
}
function tableTR({ title, date, id }){
  return `
  <tr id="activity-${id}" class="bg-white border-b border-gray-200 hover:bg-gray-100">
    <td class="px-6 py-4">${title}</td>
    <td class="px-6 py-4">${date}</td>
    <td class="px-6 py-4">
     <button id='rm-${id}' onclick="deleteActivity(${id})" class="bg-red-600 p-2 rounded-lg text-white hover:bg-red-700 disabled:bg-red-100 disabled:text-red-200">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
     </button>
    </td>
  </tr>`;
}
function paginationButton(){
  const prev = $('#previous');
  const next = $('#next');
  
  $('#pagi').value = chunk + 1;
  $('#currentChunk').textContent = chunk + 1;
  
  if (chunk === 0){
    prev.setAttribute('disabled', '')
  }else{
    prev.removeAttribute('disabled')
  }
  
  if (chunk === (abracadabra.length - 1)){
    next.setAttribute('disabled', '')
  }else{
    next.removeAttribute('disabled')
  }
}