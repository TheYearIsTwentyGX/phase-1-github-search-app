let searchBar;
let submit;
let userList;

const values = {
    "Description" : "description",
    "Language": "language",
    "Watchers": "watchers_count",
    "Open Issues": "open_issues_count",
    "Creation Date": "created_at",
    "Updated at": "updated_date"
}

document.addEventListener("DOMContentLoaded", () => {
    submit = document.querySelector('input[type=submit]');
    searchBar = document.querySelector('#search');
    userList = document.querySelector('#user-list');
    appendNewChild(userList, 'h2', {"text": "Users:"});
    submit.addEventListener('click', (e) => {e.preventDefault(); showUsers();});
})

async function showUsers() {
    userList.innerHTML = '<h2>Users:</h2>';
    let items = await getData(`https://api.github.com/search/users?q=${searchBar.value}`).then(i => i.items);
    for (let item of items) {
        const li = appendNewChild(userList, 'li', {"style": "padding:7px;"});
        const mdiv = appendNewChild(li, 'div', {"style": "border:1px solid black", "user":item['login']});
        const ndiv = appendNewChild(mdiv, 'div');
        appendNewChild(ndiv, 'img', {'src': item['avatar_url'], "style": "width:50; height:50; padding:7px; float:left", "user":item['login'], "event": { "type": "click", "callback": showRepos}});
        appendNewChild(ndiv, 'a', {'text': item['login'], "href": item['html_url'], "style": `display:table-cell;padding:22px;width:${223-105}px`});
        //appendNewChild(ndiv, 'h2', {'text': '+',  "style": "display:table-cell;padding-top:22px;", });
    }
}

async function showRepos(e) {
    let selectedUser = e.target.getAttribute('user');
    let repos = await getData(`https://api.github.com/users/${selectedUser}/repos`);
    const ndiv = appendNewChild(document.querySelector(`div[user='${selectedUser}']`), 'div');
    appendNewChild(ndiv, 'h3', {"text": "Repositories:"});
    for (let repo of repos) {
        appendNewChild(ndiv, 'h4', {"style": "margin-left:7px"}).innerHTML = `<a href=${repo['html_url']}>${repo['name']}</a>`;
        const ul = appendNewChild(ndiv, 'ul');
        for (const val in values) {
            appendNewChild(ul, 'li', {'text': `${val}: ${repo[values[val]]}`});
        }
    }
}

async function getData(url) {
    const resp = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Awesome-Octocat-App"
        }
    }).catch(err => console.error(err));
    const data = await resp.json().catch(err => console.error(err));
    return data;
}


function appendNewChild(parent, tag, attr) {
    const ne = newElement(tag, attr);
    parent.appendChild(ne);
    return ne;
}
  
  function newElement(tag, attr) {
    let ne = document.createElement(tag);
    if (attr != null)
        Object.keys(attr).forEach(k => {
            if (k === "text")
                ne.textContent = attr[k];
            else if (k === "event")
                ne.addEventListener(attr[k]['type'], attr[k]['callback']);
            else
                ne.setAttribute(k, attr[k]);
        });
    return ne;
  }