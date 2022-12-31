link = "https://api.github.com/users/";
function getFavLanguage(res) {
    //in bellow link, github docs, explains that if you want to fetch all repositories of a user
    //just send a get request to https://api.github.com/users/USERNAME/repos
    //where USERNAME is user's username!
    //then we can sort by pushed_at property
    //and then get language from language property
    //https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28


    var username = document.getElementById('username').value;
    var notification = document.getElementById('notification');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var res2 = JSON.parse(xhttp.responseText);
            //save data to localstorage
            //set data in html
            //setData(res2);
            var sort = res2.sort(c => c.pushed_at);
            var last5 = [];

            for (var i = 0; i < sort.length; i++) {
                if (i > 4) {
                    break;
                }
                //if lnaguage is null
                if (!sort[i].language) {
                    continue;
                }
                var e = last5.find(c => c.name == sort[i].language)
                if (e) {
                    e.count = e.count + 1
                }
                else {
                    last5.push({ name: sort[i].language, count: 1 })
                }
            }
            last5 = last5.sort(c=>c.count)
            res.languages = "";
            for (var i = 0; i < last5.length; i++) {
                res.languages = res.languages + last5[i].name + ",";
            }
            notification.innerText = 'successfull';
            notification.style.backgroundColor = 'forestgreen';
            localStorage.setItem('data_' + username, JSON.stringify(res));
            setData(res)

        }
        else if (this.readyState == 4 && this.status != 200) {
            notification.innerText = 'error ' + this.status
            notification.style.backgroundColor = 'red'
        }
    };
    xhttp.open("GET", "https://api.github.com/users/" + username + "/repos", true);
    xhttp.send();
}

function getData() {
    //get user name from input
    var username = document.getElementById('username').value;
    var notification = document.getElementById('notification');

    if (!username) {//error if username is not valid
        notification.innerText = 'username can not be empty';
        notification.style.backgroundColor = 'red'
    }
    //check if localstorage has data
    else if (localStorage.getItem('data_' + username)) {
        setData(JSON.parse(localStorage.getItem('data_' + username)));
        notification.innerText = 'get from localstorage';
        notification.style.backgroundColor = 'orange'
    }
    else {//call github api
        var xhttp = new XMLHttpRequest();
        /* ###### */
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //parse respone to json
                var res = JSON.parse(xhttp.responseText);
                console.log(res);
                getFavLanguage(res);
            }
            else if (this.readyState == 4 && this.status != 200) {
                //if error or internet connection lost
                var error = "";
                if (xhttp.responseText) {
                    var res = JSON.parse(xhttp.responseText);
                    error = res.message;
                }
                else {
                    error = "There is a problem in internet connection"
                }
                notification.innerText = 'error ' + this.status + ": " + error;
                notification.style.backgroundColor = 'red'
            }
        };
        //call request
        xhttp.open("GET", link + username);
        //after line bellow, xhttp.onreadystatechange  will change and then the method in ###### section will run
        xhttp.send();
    }











}
//set data in html 
function setData(data) {
    //set image src
    document.getElementById('image').setAttribute('src', data.avatar_url);

    //set text for bellow sections:
    var bio = document.getElementById('bio');
    var blog = document.getElementById('blog');
    var name = document.getElementById('name');
    var location = document.getElementById('location');
    var languages = document.getElementById('location');

    name.innerText = data.name;
    blog.innerText = data.blog;
    blog.setAttribute('href', data.blog);
    bio.innerText = data.bio;
    location.innerText = data.location;
    //if languages has valu
    if (data.languages)
    languages.innerText = "favorite languages: " + data.languages;
}