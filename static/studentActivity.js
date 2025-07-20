const yes = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-green-700"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`;
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
        <li id="ariesTae-${item.id}" onclick="clicked(${item.id})" class="bg-white p-3 border overflow-auto flex">
          <div class="pl-1 pr-3 flex items-center justify-center" id="icon-data">
            <span id="icon-${item.id}">${item.status==='complete'?yes:no}</span>
            <input id="checker-${item.id}" ${item.status==='complete'?'checked':''} type="checkbox" class="checker hidden">
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
  loadCheckerize()
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

let changed = [];
const loadCheckerize = () => {
  const inputs = document.querySelectorAll('.checker');// input[type=checkbox]
  inputs.forEach(input => {
    input.onchange = function(){
      const id = input.id.split('-')[1];
      if (changed.includes(id)){
        const index = changed.indexOf(id);
        if(index!==-1){
          changed.splice(index, 1);
          $("#icon-"+id).innerHTML = no
        }
      }else{
        $("#icon-"+id).innerHTML = yes
        if(!changed.includes(id))changed.push(id)
      }
      if (changed.length > 0){
        $("#save-changes").removeAttribute('disabled');
      }else{
        $("#save-changes").setAttribute('disabled', '');
      }
    }
  })
}

async function init(){
  const data = await getActivities($("#sid").value, $("#filterSubjects").value);
  // TODO: if error return or None
  const parseData = parseByCategory(data);
  display(parseData);
  displayEmpty(parseData)
  //loadCheckerize()
  offloading()
}


window.onload = async () => await init();