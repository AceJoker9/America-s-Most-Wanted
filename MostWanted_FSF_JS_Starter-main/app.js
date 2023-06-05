
function app(people) {
    displayWelcome();
    runSearchAndMenu(people);
    return exitOrRestart(people);
}

function displayWelcome() {
    alert('Hello and welcome to the Most Wanted search application!');
}

function runSearchAndMenu(people) {
    const searchResults = searchPeopleDataSet(people);

    if (searchResults.length > 1) {
        displayPeople('Search Results', searchResults);
    }
    else if (searchResults.length === 1) {
        const person = searchResults[0];
        mainMenu(person, people);
    }
    else {
        alert('No one was found in the search.');
    }
}

function searchSpecificPeopleDataSet(people) {

    const id = validatedPrompt(
        'Please enter in what type of search you would like to perform.',
        ['id', 'name', 'traits']
    );

    const person = searchById(people,id);
    if (!person){
        console.log('person with ID ${ID}not found');
        return
    }
    const info = validatedPrompt('Pleae enter the information you want to retrieve(first name, last name, etc): ',['firstName', 'lastName']);
    let result;
    
    switch (info) {
        case 'first name':
            result = person.firstName;
            break;
        case 'last name':
            result = person.lastName;
            break;
        default:
            console.log('Invalid Information: ${info}');
            return;
    }
            
            
            
        
            
    

    console.log('${info}: ${result}');
}



function searchById(people) {
    const idToSearchForString = prompt('Please enter the id of the person you are searching for.');
    const idToSearchForInt = parseInt(idToSearchForString);
    const idFilterResults = people.filter(person => person.id === idToSearchForInt);
    return idFilterResults;
}

function searchByName(people) {
    const firstNameToSearchFor = prompt('Please enter the the first name of the person you are searching for.');
    const lastNameToSearchFor = prompt('Please enter the the last name of the person you are searching for.');
    const fullNameSearchResults = people.filter(person => (person.firstName.toLowerCase() === firstNameToSearchFor.toLowerCase() && person.lastName.toLowerCase() === lastNameToSearchFor.toLowerCase()));
    return fullNameSearchResults;
}

function mainMenu(person, people) {

    const mainMenuUserActionChoice = validatedPrompt(
        `Person: ${person.firstName} ${person.lastName}\n\nDo you want to know their full information, family, or descendants?`,
        ['info', 'family', 'descendants', 'quit']
    );

    switch (mainMenuUserActionChoice) {
        case "info":
            //! TODO
            // displayPersonInfo(person);
            break;
        case "family":
            let family =[];
            if (person.parents.length > 0) {
                family = family.concat(people.filter(p => person.parents.includes(p.id)));
            }
            if (person.currentSpouse) {
                family.push(people.find(p =>p.id === person.currentSpouse));
            }
            const children = people.filter(p => p.parents.includes(person.id));
            if (children.length > 0) {
                family = family.concat(children);
            }
            displayPeople('Immediate Family', family);
            
            
            break;
        case "descendants":
            let personDescendants = findPersonDecendants(person, people);
            if (personDescendants.length === 0) {
                alert('${person.firstName} ${person.lastName} has no descendants.');
            } else {
                displayPeople('Descendants', personDescendants);
            }
            
            
            break;
        case "trait":
            const trait = validatedPrompt('please enter a trait to search by:');
            const traitResults = searchByTrait(trait, people);
            displayPeople('Please with ${trait}: ${traitResults.length}', traitResults);
            break;
        case "quit":
            return;
        default:
            alert('Invalid input. Please try again.');
    }

    return mainMenu(person, people);
}

function displayPeople(displayTitle, peopleToDisplay) {
    const formatedPeopleDisplayText = peopleToDisplay.map(person => `${person.firstName} ${person.lastName}`).join('\n');
    alert(`${displayTitle}\n\n${formatedPeopleDisplayText}`);
}

function validatedPrompt(message, acceptableAnswers) {
    acceptableAnswers = acceptableAnswers.map(aa => aa.toLowerCase());

    const builtPromptWithAcceptableAnswers = `${message} \nAcceptable Answers: ${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')}`;

    const userResponse = prompt(builtPromptWithAcceptableAnswers).toLowerCase();

    if (acceptableAnswers.includes(userResponse)) {
        return userResponse;
    }
    else {
        alert(`"${userResponse}" is not an acceptable response. The acceptable responses include:\n${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')} \n\nPlease try again.`);
        return validatedPrompt(message, acceptableAnswers);
    }
}

function exitOrRestart(people) {
    const userExitOrRestartChoice = validatedPrompt(
        'Would you like to exit or restart?',
        ['exit', 'restart']
    );

    switch (userExitOrRestartChoice) {
        case 'exit':
            return;
        case 'restart':
            return app(people);
        default:
            alert('Invalid input. Please try again.');
            return exitOrRestart(people);
    }

}