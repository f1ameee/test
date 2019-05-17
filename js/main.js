;(function(){
	'use strict';
	    
function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
}

	let searchForm = document.querySelector('.ba-search-form');


	let itunesAjax = new XMLHttpRequest();

	let tuneTmpl = document.getElementById('tune-tmpl').innerHTML;

	const tunesList = document.querySelector('.ba-tunes-list');
	// Get request from server and show in tunes list
	itunesAjax.onload = function () {
		if(itunesAjax.status !== 200) {
			return;
		}
		//Make object from string
		let tunes = JSON.parse(itunesAjax.responseText);

		console.log(tunes.result);
		

		tunes.result.forEach( tune => {
			let duration = msToTime(tune.trackTimeMillis);
			let goodImg = tune.artworkUrl100.replace('100x100', '600x600');
			let tuneHtml = tuneTmpl
			
							.replace(/{{songName}}/ig, tune.trackName)
							.replace(/{{artrist}}/ig, tune.artistName)
							.replace(/{{albumName}}/ig, tune.collectionName)
							.replace(/{{genre}}/ig, tune.primaryGenreName)
							.replace(/{{price}}/ig, tune.collectionPrice)
							.replace(/{{images}}/ig, goodImg)
							.replace(/{{collectionUrl}}/ig, tune.collectionViewUrl)
							.replace(/{{duration}}/ig, duration);
			tunesList.innerHTML += tuneHtml;

		});
		
	};
	searchForm.addEventListener('submit', function(e){
		e.preventDefault();
		let query = document.getElementById('search-query');

		query = query.value;
		tunesList.innerHTML = '';

		let itunesUrl = `https://itunes.apple.com/search?term=${query}&limit=10`;

		itunesAjax.open('GET', itunesUrl);
		itunesAjax.send();
	});
})();