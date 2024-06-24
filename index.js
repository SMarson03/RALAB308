const catAPIUrl = 'https://api.thecatapi.com/v1/'
//Create an async function "initialLoad" that does the following:
async function initialLoad(){
   try{
    const response = await fetch(`${thecatapi}breeds`);
    const breeds = await response.json ();

    const breedSelect = document.getElementById(`breedSelect`);

    breedSelect.innerHTML = ``;
    
    breeds.forEach(breed => {
        const option = document.createElement(`option`);
        option.value = breed.id;
        option.textContent = breed.name;
        breedSelect.appendChild(option);
    });
    //call th event handler for breedselect to populate carousel and inforDump for the initial breed
breedSelect.addEventListener(`change` , breedSelectHandler);
breedSelect.dispatchEvent(new Event(`change`));
}   catch (error) {
    console.error(`Error fetchig breeds:` , error);
}
}
console.log(initialLoad())