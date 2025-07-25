const yes = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-green-700"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" /></svg>`;
const no = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-400"><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`;

async function getActivities(student_id, subject_id){
  try{
    const respo = await fetch(`/api/data/subject-activity?subid=${subject_id}&id=${student_id}&allow=yes`);
    if (respo.ok){
      const data = await respo.json();
      return data;
    }else{
      return {}
    }
  }catch(err){
    console.error(err)
    return {}
  }
}

const parseByCategory = (data) => {
  let Activity = [], Assignment = [], PETA = [];

  const put = (item, status) => {
    item.status = status;
    switch (item.category) {
      case 'Activity':
        Activity.push(item);
        break;
      case 'Assignment':
        Assignment.push(item);
        break;
      case 'PETA':
        PETA.push(item);
        break;
    }
  };

  data?.complete?.forEach(item => put(item, 'complete'));
  data?.incomplete?.forEach(item => put(item, 'incomplete'));

  [Activity, Assignment, PETA].forEach(arr => {
    if (arr.length > 0) {
      arr.sort((a, b) => a.status.localeCompare(b.status));
    }
  });

  return { Activity, Assignment, PETA };
};


const display = (data) => {
  for(category in data){
    const ulID = `#${category==='PETA'?category:category.toLocaleLowerCase()}-list`;
    $(ulID).innerHTML = "";
    data[category].forEach(item => {
      $(ulID).innerHTML += `
        <li id="ariesTae-${item.id}" onclick="clicked(${item.id})" class="bg-white p-3 overflow-auto flex border hover:bg-gray-200">
          <div class="pl-1 pr-3 flex items-center justify-center" id="icon-data">
            <span id="icon-${item.id}">${item.status==='complete'?yes:no}</span>
            <input data-category="${category}" id="checker-${item.id}" ${item.status==='complete'?'checked':''} type="checkbox" class="checker hidden">
          </div>
          <div>
            <p class="text-gray-800">${item.title}</p>
            <p class="text-xs text-gray-400">${item.date}</p>
          </div>
        </li>
      `;
    })
  }
}

const clicked = (id) => {
  const check = $("#checker-" + id);
  check.click()
}

const offloading = () => {
  $("#loading").classList.add('hidden');
  $("#data-items").classList.remove('hidden');
}

const displayEmpty = ({ Activity, Assignment, PETA}) => {
  const empty = `
  <li class="border-2 border-dashed border-gray-300 rounded-xl py-4 text-center">
    <p class="flex items-center justify-center text-lg gap-2 text-gray-300">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
      </svg>
      Empty
    </p>
  </li>`;
  if (Activity.length < 1) $("#activity-list").innerHTML = empty;
  if (Assignment.length < 1) $("#assignment-list").innerHTML = empty;
  if (PETA.length < 1) $("#PETA-list").innerHTML = empty;
}

let changed = {};
const originalStates = {};

const loadCheckerize = () => {
  const inputs = document.querySelectorAll('.checker');
  inputs.forEach(input => {
    const id = parseInt(input.id.split('-')[1]);
    originalStates[id] = input.checked;
    input.onchange = function () {
      const id = parseInt(input.id.split('-')[1]);
      const currentChecked = input.checked;
      const wasChecked = originalStates[id];
    
      console.log(`[ID ${id}] Original: ${wasChecked}, Now: ${currentChecked}`);
    
      if (currentChecked !== wasChecked) {
        changed[id] = {
          id: id,
          setto: currentChecked ? 'complete' : 'incomplete' // this is correct!
        };
        $("#icon-" + id).innerHTML = currentChecked ? yes : no;
        console.log(`[ID ${id}] Marked as changed`);
      } else {
        delete changed[id];
        $("#icon-" + id).innerHTML = wasChecked ? yes : no;
        console.log(`[ID ${id}] Reverted to original`);
      }
      if (Object.keys(changed).length > 0) {
        $("#save-changes").removeAttribute('disabled');
      } else {
        $("#save-changes").setAttribute('disabled', '');
      }
    };
  });
};



async function saveChanges(){
  $("#save-changes").classList.replace('disabled:bg-gray-200', 'disabled:bg-blue-400');
  $("#save-changes").innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 animate-spin">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg> Loading`;
  try{
    const res = await fetch(`/admin/api/set/subject-activity`, {
      method: 'POST',
      headers: {"Content-Type": 'application/json'},
      body: JSON.stringify({
        student_id: $("#sid").value,
        subject_id: $("#filterSubjects").value,
        data: changed
      })
    })
    const data = await res.json()
  }catch(err){
    console.error("[120]: ", err)
    return
  }
  location.reload()
}

async function init(){
  const data = await getActivities($("#sid").value, $("#filterSubjects").value);
  // TODO: if error return or None
  const parseData = parseByCategory(data);
  display(parseData);
  displayEmpty(parseData)
  loadCheckerize(parseData)
  offloading()
}

$("#filterSubjects").onchange = async () => await init();
window.onload = async () => await init();