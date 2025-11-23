const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const userDataBasePath = './data/users';

fetch(`${userDataBasePath}/${username}.json`)
    .then(response => response.json())
    .then(data => setUserProfileData(data))
    .catch(error => window.location = './404');

window.onresize = function(event) {
    normalizePlayerStatCardsHeight();
};

function setUserProfileData(data) {
    setHtmlElementAttribute('player-avatar', 'src', `https://mc-heads.net/avatar/${data.uuid}/100`);
    setHtmlElementAttribute('player-name', 'innerText', data.username);
    if (data.color !== 'none') {
        setHtmlElementAttribute('player-name', 'style', `color:${data.color}`);
    }
    addBadges(data.badges);

    setHtmlElementAttribute('player-playtime', 'innerText', getTimeOnlineFormatted(data.time_online));
    setHtmlElementAttribute('player-joins', 'innerText', data.joins);
    setHtmlElementAttribute('player-joined', 'innerText', moment.unix(data.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a"));
    setHtmlElementAttribute('player-credits', 'innerText', data.credits);

    setHtmlElementAttribute('player-kills', 'innerText', data.total_kills);
    setHtmlElementAttribute('player-deaths', 'innerText', data.total_deaths);
    setHtmlElementAttribute('player-pvp-deaths', 'innerText', data.total_pvp_deaths);
    setHtmlElementAttribute('player-kd', 'innerText', toFixed((data.total_kills / data.total_deaths), 2));

    setHtmlElementAttribute('player-punishments', 'innerText', data.punishments_received);
    setHtmlElementAttribute('player-punishments-given', 'innerText', data.punishments_issued);

    setHtmlElementAttribute('player-monuments', 'innerText', data.objective_data.Monument ?? 0);
    setHtmlElementAttribute('player-wools', 'innerText', data.objective_data.Wool ?? 0);
    setHtmlElementAttribute('player-leaks', 'innerText', data.objective_data.Leakable ?? 0);
    setHtmlElementAttribute('player-hills', 'innerText', data.objective_data.Hill ?? 0);

    setHtmlElementAttribute('player-about', 'innerHTML', (data.about ?? 'Nothing here'));

    setHtmlElementAttribute('player-friends', 'innerText', data.friends.join(', '));
    setHtmlElementAttribute('player-interests', 'innerText', data.interests || 'No interests');
    setHtmlElementAttribute('player-teams', 'innerText', data.teams.join(', ') || 'No teams joined');

    normalizePlayerStatCardsHeight();
}

function addBadges(badges) {
    let badgesDiv = document.getElementById('player-badges');

    for (const badge of badges) {
        let badgeElement = document.createElement('span');
        badgeElement.className = 'player-badge';
        badgeElement.style = `color:${badge.text_color};background-color:${badge.color};margin-left:0.75rem;`;
        badgeElement.innerText = badge.text;
        badgesDiv.appendChild(badgeElement);
    }
}

function setHtmlElementAttribute(elementId, attr, value) {
    document.getElementById(elementId)[attr] = value;
}

function getTimeOnlineFormatted(timeOnline) {
    const d = Math.floor(timeOnline / (3600*24));
    const h = Math.floor(timeOnline % (3600*24) / 3600);
    const m = Math.floor(timeOnline % 3600 / 60);


    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";

    return (dDisplay + hDisplay + mDisplay).replace(/,\s*$/, "");
}

function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

// This kinda sucks, but there is no way to set min-height on the player-stat-card divs because the grid is responsive. Therefore, the row doesn't have a set height
//    to calculate min-height: 100% from.
function normalizePlayerStatCardsHeight() {
    let maxHeight = 0;
    let statCards = document.getElementsByClassName('player-stat-card');

    for (const card of statCards) {
        card.style = '';
        if (card.offsetHeight > maxHeight) {
            maxHeight = card.offsetHeight;
        }
    }

    for (const card of statCards) {
        card.style.height = `${maxHeight + 5}px`;
    }
}
