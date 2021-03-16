let inputName = null;
let allPeopleList = null;
let matchPeople = [];

const usersList = document.querySelector('#usersList');
const usersLabel = document.querySelector('#usersLabel');
const statistics = document.querySelector('#statistics');
const statisticsLabel = document.querySelector('#statisticsLabel');
const button = document.querySelector('#button');

async function start() {
  const resource = await fetch('http://localhost:3001/users');
  const users = await resource.json();

  allPeopleList = users.map((person) => {
    const { name, picture, dob, gender } = person;
    return {
      fullName: name.first + ' ' + name.last,
      photo: picture.thumbnail,
      age: dob.age,
      gender,
    };
  });

  inputName = document.querySelector('#input');
  activateInput();
}

function activateInput() {
  inputName.addEventListener('keyup', (event) => {
    let hasText = !!event.target.value && event.target.value.trim() !== '';
    if (!hasText) {
      clearInput();
      renderUsers();
      return;
    }

    findName(event.target.value.toLowerCase());
    renderUsers();
  });
}

function findName(searchName) {
  matchPeople = allPeopleList
    .filter((person) => {
      return person.fullName.toLowerCase().includes(searchName);
    })
    .sort((a, b) => {
      return a.fullName.localeCompare(b.fullName);
    });
}

function renderUsers() {
  if (matchPeople.length !== 0) {
    let usersHTML = '<div>';

    matchPeople.forEach((person) => {
      const { photo, fullName, age } = person;

      const userHTML = `
    <div class='person'>
      <img src="${photo}" id="photo"> ${fullName}, ${age} anos
    </div>`;

      usersHTML += userHTML;
    });

    usersHTML += '</div>';
    usersList.innerHTML = usersHTML;

    let males = matchPeople.filter((person) => person.gender === 'male');
    let females = matchPeople.filter((person) => person.gender === 'female');
    let sumAges = matchPeople.reduce((acc, curr) => {
      return acc + curr.age;
    }, 0);
    let meanAges = sumAges / matchPeople.length;
    meanAges = Intl.NumberFormat('pt-BR').format(meanAges);

    usersLabel.innerHTML = `${matchPeople.length} usuário(s)
  encontrado(s)`;
    statisticsLabel.innerHTML = 'Estatísticas';
    statistics.innerHTML = `
    <ul>
      <li>Sexo masculino: ${males.length}</li>
      <li>Sexo feminino: ${females.length}</li>
      <li>Soma das idades: ${sumAges}</li>
      <li>Média das idades: ${meanAges}</li>
    </ul>`;
  } else {
    usersLabel.innerHTML = 'Nenhum usuário filtrado';
    usersList.innerHTML = '';
    statisticsLabel.innerHTML = 'Nada a ser exibido';
    statistics.innerHTML = '';
  }
}

function clearInput() {
  inputName.value = '';
  inputName.focus();
  matchPeople = [];
}

start();
