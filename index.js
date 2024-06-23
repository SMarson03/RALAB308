async function initialLoad(){
   try{
    const response = await fetch(`${}breeds`);
    const breeds = await response.json ();

    const breedSelect = document.getElementById(`breedSelect`);

    breedSelect.innerHTML = ``;
    
    breeds.forEach(breed => {
        const option = document.createElement(`option`);
        option.value = breed.id;
        option.textContent = breed.name;
        breedSelect.appendChild(option);
    });
    
}   
}