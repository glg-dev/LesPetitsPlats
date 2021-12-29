// DOM
const searchbarInput = document.getElementById("search"); // Input de la barre de recherche
const chevron = document.querySelectorAll(".fa-chevron-down"); // Chevrons des boutons
const searchCard = document.querySelectorAll(".search-card"); // Search-cards Ingrédients, Appareil, Ustensiles
const itemFilters = document.querySelectorAll(".item-filters"); // Div où apparaissent les items cliqués
const filters = document.getElementById("filters"); // Résultat de la recherche d'ingrédient
const filteredAppliance = document.getElementById("filtered-appliance"); // Résultat de la recherche d'appareils
const filteredUstensil = document.getElementById("filtered-ustensil"); // Résultat de la recherche d'ustensiles
const ingredientsInput = document.getElementById("ingredients"); // Input de la search-card "Ingredients"
const appliancesInput = document.getElementById("appareil"); // Input de la search-card "Appareil"
const ustensilsInput = document.getElementById("ustensiles"); // Input de la search-card "Ustensiles"
const listContainer = document.querySelectorAll(".list-container"); // Containers
const ingredientsUl = document.getElementById("ingredients-ul"); // Container des ingrédients
const appliancesUl = document.getElementById("appliances-ul"); // Container des appareils
const ustensilsUl = document.getElementById("ustensils-ul"); // Container des ustensiles
const recipesContainer = document.getElementById("recipes-container"); // Container des recettes

// Variables
let recipeArray = [] // Tableau contenant toutes les recettes
let recipeHTMLString = "" // Contenu de la liste des recettes
let ingredientsHTMLString = "" // Contenu de la liste d'ingrédients
let appliancesHTMLString = "" // Contenu de la liste d'appareils
let ustensilsHTMLString = "" // Contenu de la liste d'ustensiles
let selectedTags = [] // Tableau contenant tous les items cliqués
let ingredientsTags = [] // Tableau contenant les ingrédients cliqués
let appliancesTags = [] // Tableau contenant les appareils cliqués
let ustensilsTags = [] // Tableau contenant les ustensiles cliqués
let tagArray = [] // Tableau contenant la recherche par tags
let tagRecipes = []// Tableau contenant la recherche par tags correspondant aux recettes sélectionnées


// Récupération des recettes à partir du fichier JSON  
const recipesFile = async function() {
    let response = await fetch ("javascript/recipes.js")
    if (response.ok) {
        let recipes = await response.json()
        getRecipes(recipes) // Affichage des recettes sur la page
        addIngredientsList(recipes) // Affichage des ingrédients pour la search-card "Ingrédients"
        addAppliancesList(recipes) // Affichage des appareils dans la search-card "Appareils"
        addUstensilslist(recipes) // Affichage des ustensiles dans la search-card "Ustensiles"
    } else {
        console.error(`Retour du serveur :`, response.status);
    }
}
recipesFile()


// *********************************************************************
// ***************************** FONCTIONS *****************************
// *********************************************************************

searchbarInput.addEventListener("input", event => recipeFilter(event)) // Filtrage des recettes avec la search-bar

ingredientsInput.addEventListener("input", ingredientsFilter) //Filtrage des ingredients au remplissage de la search-card
addFilteredIngredient() // Affichage de l'ingrédient sélectionné

addFilteredAppliance() // Affichage de l'appareil sélectionné
appliancesInput.addEventListener("input", appliancesFilter) //Filtrage des appareils au remplissage de la search-card

addFilteredUstensil() // Affichage de l'ustensile sélectionné
ustensilsInput.addEventListener("input", ustensilsFilter) //Filtrage des ustensiles au remplissage de la search-card

chevron[0].addEventListener("click", showIngredientsList) // Affichage des ingrédients au clic sur le bouton
chevron[1].addEventListener("click", showAppliancesList) // Affichage des appareils au clic sur le bouton
chevron[2].addEventListener("click", showUstensilsList) // Affichage des ustensiles au clic sur le bouton

/*
//recipeConstructor(recipes)
function recipeConstructor(param) {
    let constructorArray = []
    param.forEach(element => {
        let unitArray = []
        this.id = element.id
        this.name = element.name
        this.ingredients = element.ingredients.map(ingredientConstructor)
        this.appliance = element.appliance
        this.ustensils = element.ustensils
        unitArray.push(this.id, this.name, this.ingredients, this.appliance, this.ustensils)
        constructorArray.push(unitArray)
    })
return constructorArray
} */

// **********************************************************************
// ****************************** RECETTES ******************************
// **********************************************************************

//Affichage des recettes sur la page    
function getRecipes(recipes) {    
    recipeArray = recipes.map( recipe => { 
        return { recipe: recipe, ingredients: recipe.ingredients.map(ingredientConstructor), appliance: recipe.appliance, ustensils: recipe.ustensils, html: `
        <div class="recipe-card" data-id="${recipe.id}">
            <div class="recipe-img"></div>
            <div class="recipe-text">
                <div class="recipe-head">
                    <h1>${recipe.name}</h1>
                    <span class="time"><i class="far fa-clock"></i> ${recipe.time} min</span>
                </div>
                <div class="recipe-instructions">
                    <aside>${recipe.ingredients.map(getIngredients).join(" ")}</aside>
                    <article class="description">${recipe.description.substring(0,181)}${recipe.description.length > 181 ? "...":""}</article> 
                </div>
            </div>
        </div>
        `
        }
    })
    recipeArray.forEach((recipe) => {
        tagArray.push(recipe.html)
        tagRecipes.push(recipe)
        recipeHTMLString += recipe.html
    })
    recipesContainer.innerHTML = recipeHTMLString
    
    /* recipeArray = []
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        recipeArray.push({ 
            recipe: recipe, 
            ingredients: for (let i = 0; i < recipe.ingredients.length; i++) {
                const item = recipe.ingredients[i]
                return `${item.ingredient}`
            } , 
            appliance: recipe.appliance, 
            ustensils: recipe.ustensils, 
            html: `
                <div class="recipe-card" data-id="${recipe.id}">
                    <div class="recipe-img"></div>
                    <div class="recipe-text">
                        <div class="recipe-head">
                            <h1>${recipe.name}</h1>
                            <span class="time"><i class="far fa-clock"></i> ${recipe.time} min</span>
                        </div>
                        <div class="recipe-instructions">
                            <aside>${recipe.ingredients.map(getIngredients).join(" ")}</aside>
                            <article class="description">${recipe.description.substring(0,181)}${recipe.description.length > 181 ? "...":""}</article> 
                        </div>
                    </div>
                </div>
                `
        }) 
    }

    for (let i = 0; i < recipeArray.length; i++) {
        const recipe = recipeArray[i];
        recipeHTMLString += recipe.html
    }
    recipesContainer.innerHTML = recipeHTMLString */
    return tagArray, tagRecipes
}

function ingredientConstructor(item) {
    return `${item.ingredient}`
}

// Affichage des ingrédients dans la card recette
function getIngredients(item) {
    return `<span class="ingredient">${item.ingredient}</span>: ${item.quantity || ""} ${item.unit || ""} <br>`;
}


// **********************************************************************
// *************************** INGRÉDIENTS ******************************
// **********************************************************************

// Affichage des ingrédients pour la search-card "Ingrédients"
function addIngredientsList(array) {
    ingredientsUl.innerHTML = ""
    const ingredientsArray = array.reduce((ingredientsArray, recipe)=>{
        return [...ingredientsArray, ...recipe.ingredients.map(getIngredientsList)]
    }, [])
    ingredientsFilteredArray = ingredientsArray.filter((e,i)=>ingredientsArray.indexOf(e) == i) // Supprime les doublons
    ingredientsHTMLString = ingredientsFilteredArray.join("") // Renvoie une chaîne de caractères à partir du tableau
    ingredientsUl.innerHTML = ingredientsHTMLString || ""
    addFilteredIngredient() // Affiche un ingrédient lorsque l'on clique dessus
}

function newIngredientsList(array) {
    ingredientsUl.innerHTML = ""
    ingredientsArray = array.reduce((ingredientsArray, recipe)=>{
        return [...ingredientsArray, ...recipe.ingredients]
    }, [])
    ingredientsFilteredArray = ingredientsArray.filter((e,i)=>ingredientsArray.indexOf(e) == i) // Supprime les doublons
    createIngredientsList(ingredientsFilteredArray)
    return ingredientsFilteredArray
}

function createIngredientsList(array) {
    ingredientsHTMLString = array.map(item => {
        return `<li class="ingredients-result">${item}</li>`
    }).join(" ")
    ingredientsUl.innerHTML = ingredientsHTMLString || ""
    addFilteredIngredient()
    return array
}

function getIngredientsList(item) {
    return `<li class="ingredients-result">${item.ingredient}</li>`
}

//Filtrage des ingredients
function ingredientsFilter() {
    if (ingredientsInput.value.length >= 3) { // À partir de 3 caractères
        if (!searchCard[0].classList.contains("active")) { // Si la liste n'est pas affichée
            searchCard[0].classList.add("active") // Ouvre la liste
        }
        let research = ingredientsInput.value.toLowerCase() // Récupère le résultat de la recherche
        ingredientsFilteredArray = ingredientsFilteredArray.filter(ingredient => ingredient.toLowerCase().includes(research))
        createIngredientsList(ingredientsFilteredArray)
    } else { // Si la recherche comprend moins de 3 caractères
        ingredientsUl.innerHTML = ingredientsHTMLString || "" // Affichage complet de la liste
    }
    addFilteredIngredient()
}

// Affichage de l'ingrédient sélectionné
function addFilteredIngredient() {
    const ingredientsResult = document.querySelectorAll(".ingredients-result") // Ingrédients de la liste
    /* for (let i = 0; i < ingredientsResult.length; i++) {
        ingredientsResult[i].addEventListener("click", addItem)
        function addItem(ingredient) {
            itemFilters[0].classList.add("active")
            let itemString = ingredient.target.innerText
            filters.innerHTML = itemString
            closeCard(searchCard[0])
        }
    } */
    ingredientsResult.forEach(element => {
        element.removeEventListener("click", addIngredient)
        element.addEventListener("click", addIngredient)
    })
}

function addIngredient(eventIngredient) {
    let itemString = eventIngredient.target.innerText // Crée une variable contenant le texte de l'item cliqué
    let ingredientsFilter = document.createElement("div") // Crée la div du filtre
    ingredientsFilter.classList.add("item-filters") // Ajoute les classes
    ingredientsFilter.classList.add("ingredients-filter")
    ingredientsFilter.classList.add("active")
    ingredientsFilter.innerHTML = `
    <div class="filtered-item">${itemString}</div>
    <i class="far fa-times-circle close-button"></i>
    `
    filters.appendChild(ingredientsFilter) // Insère le filtre dans sa div
    selectedTags.push(itemString) // Insère l'élément dans le tableau "selectedTags"
    ingredientsTags.push(itemString) // Insère l'élément dans le tableau "ingredientsTags"
    recipeFilter(eventIngredient, "tag")
    ingredientsFilteredArray = newIngredientsList(tagRecipes)
    ingredientsFilteredArray = ingredientsFilteredArray.filter(ingredient => ingredient != itemString) // Supprime l'item de la liste des ingrédients 
    createIngredientsList(ingredientsFilteredArray)
    addAppliancesList(tagRecipes) // Actualise la liste des appareils
    addUstensilslist(tagRecipes) // Actualise la liste des ustensiles   
    closeFilter()
    closeCard(searchCard[0]) // Ferme la searchcard
    ingredientsInput.placeholder = `Ingrédients`
    return itemString
}

// *********************************************************************
// ***************************** APPAREILS *****************************
// *********************************************************************

// Affichage des appareils dans la search-card "Appareils"
function addAppliancesList(recipes) {
    appliancesUl.innerHTML = ""
    const appliancesArray = recipes.map(recipe =>{
        // return `<li class="appliances-result">${recipe.appliance}</li>`
        return recipe.appliance
    })
    let appliancesFilteredArray = appliancesArray.filter((e,i)=>appliancesArray.indexOf(e) == i)
    createAppliancesList(appliancesFilteredArray)
    return appliancesFilteredArray
}  

function createAppliancesList(array) {
    appliancesHTMLString = array.map(item => {
        return `<li class="appliances-result">${item}</li>`
    })
    appliancesUl.innerHTML = appliancesHTMLString.join(" ") || ""  
    addFilteredAppliance()  
    return array
}
    
//Filtrage des appareils
function appliancesFilter() {
    if (appliancesInput.value.length >= 3) { // À partir de 3 caractères
        if (!searchCard[1].classList.contains("active")) { // Si la liste n'est pas affichée
            searchCard[1].classList.add("active") // Ouvre la liste
        }
        let appliancesFilteredArray = addAppliancesList(recipeArray)
        /* let newAppliancesFilterArray = []
        for (let i = 0; i < appliancesFilteredArray.length; i++) { // Boucle sur les éléments du tableau des appareils
            const element = appliancesFilteredArray[i]; // Pour chaque élément
            let research = appliancesInput.value.toLowerCase() // Mot-clé de la recherche
            if (element.toLowerCase().includes(research)) { // Isole l'élément correspondant à la recherche
                newAppliancesFilterArray.push(element) // Insère l'élément dans le tableau
            }
        } */
        let research = appliancesInput.value.toLowerCase() // Mot-clé de la recherche
        appliancesFilteredArray = appliancesFilteredArray.filter(appliance => appliance.toLowerCase().includes(research))
        createAppliancesList(appliancesFilteredArray)
    } else { // Si la recherche comprend moins de 3 caractères
        recipes = recipesFile()
        //appliancesHTMLString = addAppliancesList(recipeArray)
        appliancesUl.innerHTML = appliancesHTMLString || "" // Affichage complet de la liste
    }
    addFilteredAppliance()
}

// Affichage de l'appareil sélectionné
function addFilteredAppliance() {
    const appliancesResult = document.querySelectorAll(".appliances-result") // Appareils de la liste
    /* for (let i = 0; i < appliancesResult.length; i++) {
        appliancesResult[i].addEventListener("click", addItem)
        function addItem(appliance) {
            itemFilters[1].classList.add("active")
            let itemString = appliance.target.innerText
            filteredAppliance.innerHTML = itemString
            closeCard(searchCard[1])
        }
    } */
    appliancesResult.forEach(element => {
        element.removeEventListener("click", addAppliance)
        element.addEventListener("click", addAppliance)
    })
}

function addAppliance(eventAppliance) {
    let itemString = eventAppliance.target.innerText // Crée une variable contenant le texte de l'item cliqué
    let appliancesFilter = document.createElement("div") // Crée la div du filtre
    appliancesFilter.classList.add("item-filters") // Ajoute les classes
    appliancesFilter.classList.add("appliances-filter")
    appliancesFilter.classList.add("active")
    appliancesFilter.innerHTML = `
    <div class="filtered-item">${itemString}</div>
    <i class="far fa-times-circle close-button"></i>
    `
    filters.appendChild(appliancesFilter) // Insère le filtre dans sa div
    selectedTags.push(itemString)
    appliancesTags.push(itemString)
    recipeFilter(eventAppliance, "tag")
    appliancesFilteredArray = addAppliancesList(tagRecipes)
    appliancesFilteredArray = appliancesFilteredArray.filter(appliance => appliance != itemString) // Supprime l'item de la liste des appareils
    newIngredientsList(tagRecipes)
    createAppliancesList(appliancesFilteredArray)
    addUstensilslist(tagRecipes)    
    closeFilter()
    closeCard(searchCard[1])
    appliancesInput.placeholder = `Appareils`
}


// **********************************************************************
// ***************************** USTENSILES *****************************
// **********************************************************************

// Affichage des ustensiles dans la search-card "Ustensiles"
function addUstensilslist(array) {
    ustensilsUl.innerHTML = ""
    const ustensilsArray = array.reduce((ustensilsArray, recipe)=>{
        return [...ustensilsArray, ...recipe.ustensils]
    }, [])
    let ustensilsFilteredArray = ustensilsArray.filter((e,i)=>ustensilsArray.indexOf(e) == i)
    createUstensilsList(ustensilsFilteredArray)
    return ustensilsFilteredArray 
}

function createUstensilsList(array) {
    let ustensilsHTMLString = array.map(item =>{
        return `<li class="ustensils-result">${item}</li>`
    })
    ustensilsUl.innerHTML = ustensilsHTMLString.join(" ") || ""
    addFilteredUstensil()
    return array 
}

//Filtrage des ustensiles
function ustensilsFilter() {
    if (ustensilsInput.value.length >= 3) { // À partir de 3 caractères
        if (!searchCard[2].classList.contains("active")) { // Si la liste n'est pas affichée
            searchCard[2].classList.add("active") // Ouvre la liste
        }
        let ustensilsFilteredArray = addUstensilslist(recipeArray)
        /* let newUstensilsFilterArray = []
        for (let i = 0; i < ustensilsFilteredArray.length; i++) { // Boucle sur les éléments du tableau des ustensiles
            const element = ustensilsFilteredArray[i]; // Pour chaque élément
            let research = ustensilsInput.value.toLowerCase() // Mot-clé de la recherche
            if (element.toLowerCase().includes(research)) { // Isole l'élément correspondant à la recherche
                newUstensilsFilterArray.push(element) // Insère l'élément dans le tableau
            }
        } */
        let research = ustensilsInput.value.toLowerCase() // Mot-clé de la recherche
        ustensilsFilteredArray = ustensilsFilteredArray.filter(ustensil => ustensil.toLowerCase().includes(research))
        createUstensilsList(ustensilsFilteredArray)
    } else { // Si la recherche comprend moins de 3 caractères
        recipes = recipesFile()
        const ustensilsHTMLString = addUstensilslist(recipeArray)
        ustensilsUl.innerHTML = ustensilsHTMLString.join(" ") || ""  // Affichage complet de la liste
    }
    addFilteredUstensil()
}


// Affichage de l'ustensile sélectionné
function addFilteredUstensil() {
    const ustensilsResult = document.querySelectorAll(".ustensils-result") //Ustensiles de la liste
    /* for (let i = 0; i < ustensilsResult.length; i++) {
        ustensilsResult[i].addEventListener("click", addItem)
        function addItem(ustensil) {
            itemFilters[2].classList.add("active")
            let itemString = ustensil.target.innerText
            filteredUstensil.innerHTML = itemString
            closeCard(searchCard[2])
        }
    } */
    ustensilsResult.forEach(element => {
        element.removeEventListener("click", addUstensil)
        element.addEventListener("click", addUstensil)
    })
}

function addUstensil(eventUstensil) {
    let itemString = eventUstensil.target.innerText // Crée une variable contenant le texte de l'item cliqué
    let ustensilsFilter = document.createElement("div") // Crée la div du filtre
    ustensilsFilter.classList.add("item-filters") // Ajoute les classes
    ustensilsFilter.classList.add("ustensils-filter")
    ustensilsFilter.classList.add("active")
    ustensilsFilter.innerHTML = `
    <div class="filtered-item">${itemString}</div>
    <i class="far fa-times-circle close-button"></i>
    `
    filters.appendChild(ustensilsFilter) // Insère le filtre dans sa div
    selectedTags.push(itemString)
    ustensilsTags.push(itemString)
    recipeFilter(eventUstensil, "tag")
    ustensilsFilteredArray = addUstensilslist(tagRecipes)
    ustensilsFilteredArray = ustensilsFilteredArray.filter(ustensil => ustensil != itemString) // Supprime l'item de la liste des ustensiles 
    newIngredientsList(tagRecipes)
    addAppliancesList(tagRecipes)
    createUstensilsList(ustensilsFilteredArray)    
    closeFilter()
    closeCard(searchCard[2]) // Ferme la searchcard
    ustensilsInput.placeholder = `Ustensiles`
}

// *********************************************************************
// ***************************** RECHERCHE *****************************
// *********************************************************************

// Filtrage des recettes avec la search-bar
function recipeFilter(event, mode = "search") {
    if (mode == "search") { // À partir de la barre de recherche
        searchbarResearch(searchbarInput)
    } else if (mode == "tag") { // À partir des tags
        if (selectedTags.length != 0) { // Si des tags ont été sélectionnés
            tagResearch(recipeArray) // Recherche à partir de toutes les recettes
            if (tagArray.length === 0) { // Si aucune recette n'a été mise dans le tableau
                recipesContainer.innerHTML = `Aucune recette ne correspond à votre critère... Vous pouvez chercher  « tarte aux pommes », « poisson », etc.`;
            } else { // Sinon (si au moins une recette correspond)
                filteredTagArray = tagArray.filter((e,i)=>tagArray.indexOf(e) == i) // Supprime les doublons
                recipesContainer.innerHTML = filteredTagArray.join(" ")
                return filteredTagArray
            }
            newIngredientsList(tagRecipes)
            addAppliancesList(tagRecipes)
            addUstensilslist(tagRecipes)
        } else { // Si aucun tag n'a été sélectionné
            searchbarResearch(searchbarInput) // Recherche à partir de la barre de recherche
            newIngredientsList(recipeArray)
            addAppliancesList(recipeArray)
            addUstensilslist(recipeArray)    
        }
    }
    addFilteredIngredient()
    addFilteredAppliance()
    addFilteredUstensil()
}    

function searchbarResearch(searchbarInput) {
    let inputValue = searchbarInput.value
    if (inputValue.length >= 3) { // À partir de 3 caractères
        if (tagRecipes.length > 0) { // Si une recherche par tag a été faite
            recipeResearch(tagRecipes, inputValue) // Recherche à partir des recettes filtrées par tag
        } else { // Si aucun filtrage
            recipeResearch(recipeArray, inputValue) // Recherche à partir de toutes les recettes
        }
        if (tagArray.length === 0) { // Si aucune recette n'a été mise dans le tableau
            recipesContainer.innerHTML = `Aucune recette ne correspond à votre critère... Vous pouvez chercher  « tarte aux pommes », « poisson », etc.`;
        } else { // Sinon (si au moins une recette correspond)
            filteredTagArray = tagArray.filter((e,i)=>tagArray.indexOf(e) == i) // Supprime les doublons
            recipesContainer.innerHTML = filteredTagArray.join(" ")
        }
        newIngredientsList(tagRecipes)
        addAppliancesList(tagRecipes)
        addUstensilslist(tagRecipes)
    } else if (inputValue.length > 0 && inputValue.length < 3) {
       
    } else if (filteredTagArray = undefined){ 
        recipesContainer.innerHTML = recipeHTMLString // Affichage de toutes les recettes
        newIngredientsList(recipeArray)
        addAppliancesList(recipeArray)
        addUstensilslist(recipeArray)
    } else { // Si l'input comprend moins de 3 caractères
        recipesContainer.innerHTML = recipeHTMLString // Affichage de toutes les recettes
        newIngredientsList(recipeArray)
        addAppliancesList(recipeArray)
        addUstensilslist(recipeArray)
    }
}

function recipeResearch(array, inputValue) {
    array.forEach(element => {
    let research = inputValue.toLowerCase()
    if (!element.html.toLowerCase().includes(research)) {
        tagArray = tagArray.filter(item => item != element.html)
        tagRecipes = tagRecipes.filter(item => item != element)
    }
    })
}

function tagResearch(array) {
    array.forEach(element => {
        if (element.recipe != undefined) {
            if (selectedTags.length > 1) {
                selectedTags.forEach(tag => {
                    if (element.ingredients.indexOf(tag) === -1 && element.appliance.indexOf(tag) === -1 && element.ustensils.indexOf(tag) === -1) {
                        tagArray = tagArray.filter(item => item != element.html)
                        tagRecipes = tagRecipes.filter(recipe => recipe != element)
                    }
                    else {

                    }
                })
            } else {
                if (ingredientsTags.length > 0 && !element.ingredients.join("").toLowerCase().includes(ingredientsTags.join("").toLowerCase())) {
                    tagArray = tagArray.filter(recipe => recipe != element.html)
                    tagRecipes = tagRecipes.filter(recipe => recipe != element)
                }
                if (appliancesTags.length > 0 && element.appliance.toLowerCase().includes(appliancesTags.join("").toLowerCase())) {
                    tagArray = tagArray.filter(recipe => recipe != element.html)
                    tagRecipes = tagRecipes.filter(recipe => recipe != element)
                }
                if (ustensilsTags.length > 0 && element.ustensils.join("").toLowerCase().includes(ustensilsTags.join("").toLowerCase())) {
                    tagArray = tagArray.filter(recipe => recipe != element.html)
                    tagRecipes = tagRecipes.filter(recipe => recipe != element)
                }
            }
        }
    })
    return array
}

// **********************************************************************
// ************************* FILTRES ET BOUTONS *************************
// **********************************************************************

function closeFilter() {
    // Fermeture des div des items filtrés
    const closeButton = document.querySelectorAll(".close-button"); // Croix de fermeture des items filtrés
    closeButton.forEach(element => {
        element.addEventListener("click", removeActive)
    })
}

function removeActive(button) {
    let icon = button.target
    icon.parentElement.classList.remove("active") 
    let item = icon.previousElementSibling.innerHTML
    selectedTags = selectedTags.filter(tag => tag != item)
    console.log(selectedTags);
    recipeFilter(event, mode = "tag")
}

// Affichage des ingrédients au clic sur le bouton
function showIngredientsList() {
    if (searchCard[0].classList.contains("active")) {
        ingredientsInput.placeholder = `Ingrédients`
    } else {
        ingredientsInput.placeholder = `Rechercher un ingrédient`
    }
    openCard(searchCard[0])
    closeCard(searchCard[1])
    appliancesInput.placeholder = `Appareil`
    closeCard(searchCard[2])
    ustensilsInput.placeholder = `Ustensiles`
}
    
// Affichage des appareils au clic sur le bouton
function showAppliancesList() {
    if (searchCard[1].classList.contains("active")) {
        appliancesInput.placeholder = `Appareil`
    } else {
        appliancesInput.placeholder = `Rechercher un appareil`
    }
    openCard(searchCard[1]) 
    closeCard(searchCard[0])
    ingredientsInput.placeholder = `Ingrédients`
    closeCard(searchCard[2])
    ustensilsInput.placeholder = `Ustensiles`
}

// Affichage des ustensiles au clic sur le bouton
function showUstensilsList() {
    if (searchCard[2].classList.contains("active")) {
        ustensilsInput.placeholder = `Ustensiles`
    } else {
        ustensilsInput.placeholder = `Rechercher un ustensile`
    }
    openCard(searchCard[2]) 
    closeCard(searchCard[0])
    ingredientsInput.placeholder = `Ingrédients`
    closeCard(searchCard[1])
    appliancesInput.placeholder = `Appareil`
}

// Ouverture de la searchCard + retournement chevron
function openCard(searchCard) {
    searchCard.classList.toggle("active")
}

// Fermeture des cards ouvertes
function closeCard(searchCard) {
    if (searchCard.classList.contains("active")) {
        searchCard.classList.remove("active")
    }
}
