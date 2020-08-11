console.log('Hello')

const form = document.querySelector('form'); // document si riferisce alla UI aka il form sul frontend
const loadingElement = document.querySelector('.loading');
const mewsElement = document.querySelector('.mews');
const API_URL = 'http://localhost:5000/mews';

//show mews and hide loading gif
listAllMews();
loadingElement.style.display = 'none';

//listen for submit button press event and get the data from the form
form.addEventListener('submit', (event)=>{
    event.preventDefault(); //the default behaviour is to reload the page after the button is pressed, we need this disabled
    const formData = new FormData(form);//get the form

    //create the mew
    const name = formData.get('name');
    const content = formData.get('content');
    const mew = {
        name,
        content
    };

    //when form is submitted, hide the form and show the loading gif
    form.style.display = 'none';
    loadingElement.style.display = '';

    //send info to the backend server
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(mew),
        headers:{
            'content-type': 'application/json'
        }
    }).then(response => response.json())
        .then(createdMew => {
            form.reset();
            setTimeout(() => {
                form.style.display = '';
            }, 15000)
            
            listAllMews();
            loadingElement.style.display = 'none';
            
        });
});

function listAllMews(){
    mewsElement.innerHTML = ''
    fetch(API_URL)
        .then(response => response.json())
        .then(mews => {
            mews.reverse(); // reverse the list of mews to show the latest on top
            //showing all mews on UI
            mews.forEach(mew => {
                const div = document.createElement('div');

                const header = document.createElement('h3');
                header.textContent = mew.name; //use textContent to ensure that if anyone inserts valid html code it doesn't get rendered

                const contents = document.createElement('p');
                contents.textContent = mew.content;

                const date = document.createElement('small');
                date.textContent = new Date(mew.created);

                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date)

                mewsElement.appendChild(div);
            });
        });
}