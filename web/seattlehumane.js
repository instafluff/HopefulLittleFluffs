async function getRandomFluffFromSeattleHumane( species ) {
  const data = {
    nonce: "cca1b3544d",
    action: "petpoint_show_pets",
    location: "",
    type: species,
    count: 10000,
    order: "name",
    ids: ""
  };
  const formData = Object.keys(data).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
  }).join('&');
  const result = document.createElement('div');
  const r = await fetch( "https://cors-anywhere.herokuapp.com/https://www.seattlehumane.org/wp-admin/admin-ajax.php", {
    method: "POST",
    // mode: "no-cors",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formData
  } ).then( r => r.json() );
  result.innerHTML = r.html;
  let pets = result.querySelectorAll( ".pet:not(.pending)" );
  // console.log( pets );
  let p = pets[ Math.floor( pets.length * Math.random() ) ];
  let name = p.querySelector( ".name" ).innerText;
  let description = p.querySelector( ".description" ).innerText;
  let link = p.querySelector( ".button" ).getAttribute( "href" );
  // console.log( name, description, link );
  let info = await getSeattleHumanePetInfo( link );
  return info;
};

async function getSeattleHumanePetInfo( petLink ) {
  const result = document.createElement('div');
  result.innerHTML = await fetch( `https://cors-anywhere.herokuapp.com/${petLink}` )
    .then( r => r.text() );
  return Object.assign({
    name: getMeta( result, "name" ),
    description: getMeta( result, "description" ),
    image: getMeta( result, "image" ),
    url: petLink
  }, getPetInfo( result ) );
}

const cleanAttributeName = (value) => value.replace(/ |\//, '_').toLowerCase();
function getPetInfo(element) {
  const infoRows = element.querySelectorAll('table.info tr');
  const info = {};
  infoRows.forEach(row => {
    const attribute = cleanAttributeName(row.querySelector('th').textContent.trim());
    const valueElement = row.querySelector('td');
    if (attribute === 'spayed_neutered') {
      info[attribute] = valueElement.innerHTML.includes('fa-check');
    } else {
      info[attribute] = valueElement.textContent.trim();
    }
  });
  return info;
}
