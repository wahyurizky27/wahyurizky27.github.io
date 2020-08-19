const URL_API = "https://api.football-data.org/v2/";
const API_TOKEN = "5a3a3b31536241b0b8f94d035efd98ca";
const ID_TEAM = 2019;
const nowStanding = `${URL_API}competitions/${ID_TEAM}/standings`;
const nowTim = `${URL_API}competitions/${ID_TEAM}/teams`;

const fetchAPI = url => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': API_TOKEN
        }
    })
        .then(res => {
            if (res.status !== 200) {
                console.log("Error: " + res.status);
                return Promise.reject(new Error(res.statusText))
            } else {
                return Promise.resolve(res)
            }
        })
        .then(res => res.json())
        .catch(err => {
            console.log(err)
        })
};


// Standings
function listStanding() {
    if ("caches" in window) {
        caches.match(nowStanding).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    getListstanding(data);
                })
            }
        })
    }

    fetchAPI(nowStanding)
        .then(data => {
            getListstanding(data);
        })
        .catch(error => {
            console.log(error)
        })
}

function getListstanding(data) {
    let standings = "";
    let standingElement =  document.getElementById("main-content");  
    data.standings[0].table.forEach(function (standing) {
        standings += `
                <tr>
                    <td>${standing.position}</td>
                    <td>
                    <img src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="50px" alt="badge"/>
                    </td>
                    <td>${standing.team.name}</td>
                    <td>${standing.playedGames}</td>
                    <td>${standing.won}</td>
                    <td>${standing.draw}</td>
                    <td>${standing.lost}</td>
                    <td>${standing.goalsFor}</td>
                    <td>${standing.goalsAgainst}</td>
                    <td>${standing.goalDifference}</td>
                    <td>${standing.points}</td>
                </tr>
        `;
    });

    standingElement.innerHTML = `
                <div class="row center-align">
                    <div class="col s12">
                          <div class="card shadow-none">
                            <table class="centered">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Logo Team</th>
                                        <th>Team Name</th>
                                        <th>Match</th>
                                        <th>W</th>
                                        <th>D</th>
                                        <th>L</th>
                                        <th>GF</th>
                                        <th>GD</th>
                                        <th>GF</th>
                                        <th>Total Pts</th>
                                    </tr>
                                </thead>
                                <tbody id="standings">
                                    ${standings}
                                </tbody>
                            </table>
                            </div>
          `;
}


// Teams
function listTeam() {
    if ("caches" in window) {
        caches.match(nowTim).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    getListteam(data);
                })
            }
        })
    }

    fetchAPI(nowTim)
        .then(data => {
            getListteam(data);
        })
        .catch(error => {
            console.log(error)
        })
}

function getListteam(data) {
    dataTeams = data;
    let teams = "";
    data.teams.forEach(function (team) {
        teams += `
        <div class="col s12">
        <div class="card">
        <div class="card-image"><img width="150" height="300" src="${team.crestUrl}"></div>
        <div class="card-content center-align">
                    <h6>${team.name}</h6>
                    <p>Founded: ${team.founded}</p>
                    <p>Venue: ${team.venue}</p>
                    <a href="${team.website}">${team.website}</a>
                </div>
          <div class="card-action center-align">
              <a class="waves-effect waves-light btn-small blue" 
              onclick="addFavoriteTeam(${team.id})">Favorite</a>
          </div>
        </div>
      </div>
        `;
    });
    document.getElementById('progress').style.display = 'none'
    document.getElementById("main-content").innerHTML = teams; 
    
}


let listFavorite = () => {
  let teams = showFavorite()
    teams.then(data => {
      dataTeams = data;
      let favorite = ' '
      favorite += '<div class="row">'
      data.forEach(team => {
        favorite += `
        <div class="col s12">
          <div class="card">
          <div class="card-image"><img width="150" height="300" src="${team.crestUrl}"></div>
          <div class="card-content center-align">
                      <h6>${team.name}</h6>
                      <p>Founded: ${team.founded}</p>
                      <p>Venue: ${team.venue}</p>
                      <a href="${team.website}">${team.website}</a>
                  </div>
            <div class="card-action center-align">
                <a class="waves-effect waves-light btn-small red" 
                onclick="delFavoriteTeam(${team.id})">Delete</a>
            </div>
          </div>
        </div>
      `
      })

      if(data.length == 0) favorite += '<h5>You dont have a favorite team!</h5>'
      let none = document.getElementById('main-content');
      none.innerHTML = favorite;
      
  })
}

// DB

let dbPromise = idb.open('saveteam', 1, upgradeDB => {
  if(!upgradeDB.objectStoreNames.contains('team')){
      upgradeDB.createObjectStore('team', { 'keyPath': 'id'})
  }
});


const addTeam = (team) => {
      dbPromise.then(db => {
        let tx = db.transaction('team', 'readwrite');
        let store = tx.objectStore('team')
        create = new Date().getTime()
        store.put(team)
        return tx.complete;
      }).then(() => {
        M.toast({ html: `${team.name} Success to Save!` })
        console.log('Success to Save Team');
      }).catch(err => {
        console.error('Failed to Save', err);
      });
}

const deleteTeam = (idTeam) => {
      dbPromise.then(db => {
        let tx = db.transaction('team', 'readwrite');
        let store = tx.objectStore('team');
        store.delete(idTeam);
        return tx.complete;
      }).then(() => {
        M.toast({ html: 'Team Deleted!' });
        listFavorite();
      }).catch(err => {
        console.error('Error: ', err);
      });
}

const showFavorite = () => {
    return dbPromise.then(db => {
      let tx = db.transaction('team', 'readonly');
      let store = tx.objectStore('team');
      return store.getAll();
    })
}


const addFavoriteTeam = idTeam => {
  let team = dataTeams.teams.filter(el => el.id == idTeam)[0]
  addTeam(team);
}

const delFavoriteTeam = idTeam => {
  let del = confirm("Sure to Delete ?")
  if (del == true) {
    deleteTeam(idTeam);
  }
}

