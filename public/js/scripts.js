$('#generate-pallet').click(generateColors);
$('.color-window').click(lockColor);
$('.existing-projects').click('.delete-pallet-icon', (event) => deletePallet(event.target.id));
$('#create-new-project').click(postProject);
$('#save-pallet').click(postPallet);


var safeColors = ['00', '33', '66', '99', 'cc', 'ff'];
var rand = function() {
  return Math.floor(Math.random() * 6);
};
var randomColor = function() {
  var r = safeColors[rand()];
  var g = safeColors[rand()];
  var b = safeColors[rand()];

  return "#" + r + g + b;
};

function generateColors() {
  const windows = [$('#window-one'), $('#window-two'), $('#window-three'), $('#window-four'), $('#window-five')];

  windows.forEach(window => {
    if (!window.hasClass('locked')) {
      const random = randomColor();

      window.css('background', random);
      window.text(random.toUpperCase())
    }
  })
}

function lockColor() {
  $(this).toggleClass('locked')

  if ($(this).text() == $(this).data("text-swap")) {
    $(this).text($(this).data("text-original"));
  } else {
    $(this).data("text-original", $(this).text());
    $(this).text($(this).data("text-swap"));
  }
}

$(document).ready(function() {
  generateColors();
  getExistingProjects();
});

async function getExistingProjects() {
  $('.existing-projects').empty();
  const projects = await fetchProjects();
  renderProjects(projects);
  updateProjectSelect(projects);
  const pallets = await fetchPallets();
  renderPallets(pallets);
}

async function fetchProjects () {
  const url = '/api/v1/projects'
  try {
    const response = await fetch(url);
    const projects = await response.json();
    return projects;
  } catch (error) {
    alert('This happened: ' + error.message);
  }
};

function renderProjects(projects) {
  projects.forEach(project => {
    const singleProject = $(`
    <article class="project-wrapper" id="project-${project.id}">
      <h2 class="project-name">${project.name}</h2>
    </article>
  `);
  $('.existing-projects').append(singleProject);
  });
};

function updateProjectSelect(projects) {
  $('#select-project').empty().append('<option>Select a Project</option>');
  projects.forEach(project => {
    $('#select-project').append(`<option id="${project.id}">${project.name}</option>`)
  });
};


async function fetchPallets () {
  const url = '/api/v1/pallets'
  try {
    const response = await fetch(url);
    const pallets = await response.json();
    return pallets;
  } catch (error) {
    alert('This happened: ' + error.message);
  }
};

function renderPallets(pallets) {
  pallets.forEach(pallet => {
    const singlePallet = $(`
      <div id="pallet-${pallet.id}" class="pallet-wrapper">
        <h3 class="pallet-name">${pallet.name}: </h3>
        <div class="pallet-color" style="background-color:${pallet.color1}"></div>
        <div class="pallet-color" style="background-color:${pallet.color2}"></div>
        <div class="pallet-color" style="background-color:${pallet.color3}"></div>
        <div class="pallet-color" style="background-color:${pallet.color4}"></div>
        <div class="pallet-color" style="background-color:${pallet.color5}"></div>
        <img src="/images/trashcan.png" alt="delete icon" id="${pallet.id}" class="delete-pallet-icon" />
      </div>
    `)
    $("#project-" + pallet.pallet_id).append(singlePallet);
  })
}


async function postProject() {
  event.preventDefault();
  const name = $('#project-name').val();
  
  try {
    url = '/api/v1/projects/';
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name})
    })
  } catch (error) {
    alert('This happened: ' + error.message);
  }
  await getExistingProjects();
}

async function postPallet() {
    const name = $('#pallet-name').val();
    const color1 = $('#window-one').css('background-color');
    const color2 = $('#window-two').css('background-color');
    const color3 = $('#window-three').css('background-color');
    const color4 = $('#window-four').css('background-color');
    const color5 = $('#window-five').css('background-color');
    const pallet_id = $('#select-project').children(":selected").attr("id");
    
    const pallet = { name, color1, color2, color3, color4, color5, pallet_id}
    
    try {
      url = '/api/v1/pallets/';
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pallet)
      })
    } catch (error) {
      console.log(error)
      alert('This happened while posting to /pallets: ' + error);
    }
};


async function deletePallet(id) {
  const url = `/api/v1/pallets/${id}`
  await fetch(url, {
    method: 'DELETE'
  })
  $(`#pallet-${id}`).remove();
};