let COMPLETE, INCOMPLETE = [];

async function init(){
  const subject_id = $("#subject_id").value;
  try{
    const response = await fetch(`/api/data/subject-activity?subid=${subject_id}`);
    const data = await response.json();
    if (data?.complete){
      COMPLETE = data.complete;
      INCOMPLETE = data.incomplete;
      console.log(INCOMPLETE)
      displayActivities()
    }else{
      console.log("ERROR: ", data)
    }
  }catch(error){
    console.log("[ERROR]: ", error)
  }
}

function displayActivities(){
  const category = $("#filterCategory").value;
  const div_complete = $("#list-complete");
  const div_incomplete = $("#list-incomplete");
  
  COMPLETE.filter(items => items.category===category).forEach(item => LIST(item, div_complete));
  INCOMPLETE.filter(items => items.category===category).forEach(item => LIST(item, div_incomplete));
  checkEmpy()
}

/*
  Check if the ul tag is empty and sisplay the empty list
  
  args:
    C: li#list-complete
    I: li#list-incomplete
  return:
    None/Void
*/
function checkEmpy(){
  const empty = `
  <li class="border-2 border-dashed border-gray-300 rounded-xl py-4 text-center">
    <p class="flex items-center justify-center text-lg gap-2 text-gray-300">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
      </svg>
      Empty
    </p>
  </li>`
  const CC = document.querySelector("#list-complete");
  const KK = document.querySelector("#list-incomplete");
  if (!$("#list-complete > li")){
    document.getElementById("list-complete").innerHTML = empty
  }
  /*if (!KK.querySelector('li')){
    KK.innerHTML = empty
  }*/
}

const LIST = (activity, ul) => {
  const icons = {
    Activity: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" /></svg>`,
    Assignment: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>`,
    PETA: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5"><path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>`
  }

  const li = document.createElement('li');
  li.classList.add('listahan');

  const iconWrapper = document.createElement('div');
  iconWrapper.classList.add('p-2');

  const icon = document.createElement('div');
  icon.classList.add('aykon');
  icon.innerHTML = icons[activity.category];

  iconWrapper.appendChild(icon);
  li.appendChild(iconWrapper);

  const textWrapper = document.createElement('div');
  textWrapper.classList.add('flex-1');

  const title = document.createElement('p');
  title.textContent = activity.title;

  const date = document.createElement('p');
  date.classList.add('text-xs', 'text-gray-600');
  date.textContent = activity.date;

  textWrapper.appendChild(title);
  textWrapper.appendChild(date);

  li.appendChild(textWrapper);
  ul.appendChild(li);
}


window.onload = () => {
  init();
  
  // Turn off loading
  $("#activities-loading").classList.add('hidden');
  $("#activities-data").classList.remove('hidden');
}