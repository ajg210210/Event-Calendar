
let token; let loggedIn;


// logging in
function loginAjax(event) {
    event.preventDefault();
    const username = document.getElementById("username").value; // Get the username from the form
    const password = document.getElementById("password").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    fetch("login_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json'}
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`);
            if(data.success){
                updateCalendar();
                hideLogin();
                get_token();
                loggedIn = true;
            }
        })
        .catch(error => console.error('Error:',error));
}
document.getElementById("login_btn").addEventListener("click", loginAjax, false); // Bind the AJAX call to button click



//logging out
function logoutAjax(event){
    event.preventDefault();

    fetch("logout.php", {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.success ? "Logged out successfully!" : 'You were not logged out');
            showLogin();
            updateCalendar();
            loggedIn = false;
        })
        .catch(error => console.error('Error:',error));
}
document.getElementById("logout_btn").addEventListener("click", logoutAjax, false); // Bind the AJAX call to button click




//registering the user
function registerAjax(event){
    event.preventDefault();
    const username = document.getElementById("username_register").value; 
    const password = document.getElementById("password_register").value;

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password,  };

    fetch("register_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.success ? "New account successfully created" : `New account not created : ${data.message}`);
            if(data.success){
                token = data.token;
                hideLogin();
                get_token();
                loggedIn = true;
            }
        })
        .catch(error => console.error('Error:',error));
}
document.getElementById("register_btn").addEventListener("click", registerAjax, false); 



// getting token
function get_token(){
    fetch("make_Token.php", {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        token=data.token;
    })
    .catch(error => console.error('Error:',error));
}


function ajax_get_event(month, date, year){
    const data = { 'month': month, 'date': date, 'year': year, 'priority': priority};
    return fetch("get_event.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => console.error('Error:',error));
}

function check_login(){
    fetch("check_login.php", {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        if(data.loggedIn){
            hideLogin();
            get_token();
            loggedIn = true;
        } else {
            showLogin();
            loggedIn = false;
        }
    })
    .catch(error => console.error('Error:',error));
}
check_login(); //check_login when refreshing the page


function hideLogin(){
    document.getElementById("logout_btn").hidden = false;
    document.getElementById("create_event").hidden = false;
    //document.getElementById("send_events").hidden = false;
    document.getElementById("login_form").hidden = true;
    document.getElementById("register_form").hidden = true;
}
function showLogin(){
    document.getElementById("logout_btn").hidden = true;
    document.getElementById("create_event").hidden = true;
    document.getElementById("edit_event").hidden = true;
    //document.getElementById("send_events").hidden = true;
    document.getElementById("login_form").hidden = false;
    document.getElementById("register_form").hidden = false;
    document.getElementById("login_form").reset();
    document.getElementById("register_form").reset();
}

//creating event
function createEvent(event){
    event.preventDefault();
    const title = document.getElementById('title_input').value;
    const date = document.getElementById('date_input').value;
    const time = document.getElementById('time_input').value;
    const priority = document.getElementById('priority').value;

    if(title.length == 0 || date.length == 0 || time.length == 0){
        document.getElementById('invalid_format').hidden = false;
    } else {
        document.getElementById('invalid_format').hidden = true;
        
        const data = {'title': title, 'date': date, 'time': time, 'priority':priority, 'token': token};

        fetch("create_event.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json'}
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            updateCalendar();
        })
        .catch(error => console.error('Error:',error));
    }   
}
document.getElementById("submit_event").addEventListener("click", createEvent, false);







//editing event
function edit_event(event){
    event.preventDefault();
    const eventId = event.target.eventId;

    const data = { 'eventId': eventId, 'token': token};

    fetch("edit_event.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json'}
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                
                document.getElementById("create_event").hidden = true;
                document.getElementById("edit_event").hidden = false;
                document.getElementById("edit_title_input").value = data.title;
                document.getElementById("edit_date_input").value = data.date;
                document.getElementById("edit_time_input").value = data.time;
                document.getElementById("edit_priority_input").value = data.priority;
                document.getElementById("edit_eventId").value = eventId;
                
            }
        })
        .catch(error => console.error('Error:',error));
}

//submitting the editing event
function event_edit(event){
    event.preventDefault();
    document.getElementById("create_event").hidden = false;
    document.getElementById("edit_event").hidden = true;

    const title = document.getElementById('edit_title_input').value;
    const date = document.getElementById('edit_date_input').value;
    const time = document.getElementById('edit_time_input').value;
    const eventId = document.getElementById("edit_eventId").value;
    const priority = document.getElementById("edit_priority_input").value;

    if(title.length == 0 || date.length == 0 || time.length == 0){
        document.getElementById('invalid_format').hidden = false;
    } else {
        document.getElementById('invalid_format').hidden = true;
        
        const data = {'title': title, 'date': date, 'time': time,  'eventId': eventId, 'priority': priority, 'token': token};

        fetch("update_event.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json'}
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            updateCalendar();
        })
        .catch(error => console.error('Error:',error));
    }
}
document.getElementById("update_event").addEventListener("click", event_edit, false);




//deleting event
function delete_event(event){
    event.preventDefault();
    const eventId = event.target.eventId;

    const data = {'eventId': eventId, 'token': token};

    fetch("delete_event.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json'}
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                updateCalendar();
            }
        })
        .catch(error => console.error('Error:',error));
}

//sharing event
function share_event(event){
    
      const eventId = event.target.eventId;
      document.getElementById("create_event").hidden = true;
      document.getElementById("share_event").hidden = false;

      document.getElementById("share_eventId").value = eventId;
      
    
    
    
}

function submit_send_event(event){
    event.preventDefault();
    
    const eventId = document.getElementById("share_eventId").value;
    const data = { 'eventId': eventId, 'token': token};

    let title1;
    let date1;
    let time1;
    let priority1;
    fetch("edit_event.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json'}
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                
                
                
              
              title1 = data.title;
              date1 = data.date;
              time1 = data.time;
              priority1 = data.priority;
              send_helper(title1, date1, time1, priority1);
              
            }
        })
        .catch(error => console.error('Error:',error));
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    
}
document.getElementById("send_event").addEventListener("click", submit_send_event, false);

function send_helper(title1, date1, time1, priority1){

  document.getElementById("create_event").hidden = false;
  document.getElementById("share_event").hidden = true;

    const username = document.getElementById('username_send_input').value;
    
    
    if(username.length == 0){
        document.getElementById('invalid_format').hidden = false;
    } else {
        document.getElementById('invalid_format').hidden = true;
        
        const data = {'username':username, 'title': title1, 'date': date1, 'time': time1, 'priority': priority1};

        fetch("share_event.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json'}
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            alert("sent");
            updateCalendar();
        })
        .catch(error => console.error('Error:',error));
    }
}