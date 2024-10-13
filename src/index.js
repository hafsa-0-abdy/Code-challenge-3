// This waits for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
  const movieEndpoint = 'http://localhost:3000/films';


  // Decrease ticket count and update API
  function decreaseTicket(movieId) {
    const ticketNumElement = document.getElementById("ticket-num");
    let ticketsRemaining = parseInt(ticketNumElement.textContent);
    if (ticketsRemaining > 0) {
      ticketsRemaining--;
      ticketNumElement.textContent = ticketsRemaining;


      // Check if tickets are available
      fetch(`${movieEndpoint}/${movieId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          tickets_sold: ticketsRemaining
        })

      })
      
    } 
    else {
      document.getElementById("buy-ticket").textContent = "Sold Out";
      document.getElementById("buy-ticket").disabled = true;
    }
  }


 
    // This displays movie info on the page
  function updateMovieInfo(movieData) {
    document.getElementById("poster").src = movieData.poster;
    document.getElementById("title").textContent = movieData.title;
    document.getElementById("runtime").textContent = `${movieData.runtime} minutes`;
    document.getElementById("film-info").textContent = movieData.description;
    document.getElementById("showtime").textContent = movieData.showtime;
    document.getElementById("ticket-num").textContent = movieData.tickets_sold;
    document.getElementById("film-id").textContent = movieData.id; 
  }


  // Add event listener to the "Buy Ticket" button that decrements the ticket number each time its clicked
  document.getElementById("buy-ticket").addEventListener("click", function () {decreaseTicket();});


  //This for deleting movie from the api and list
  function deleteMovie(movieId) {
    fetch(`${movieEndpoint}/${movieId}`, {
      method: 'DELETE',
    })

    .then(response => {
      if (!response.ok) 
      
      return response.json();

    })

    .then(() => {

      // This for removing the movies from the list
      const listItem = document.getElementById(`film-${movieId}`);
      if (listItem) {listItem.remove();}
    })
  }

  //Fetches the movie title,createas a button for each movie

  fetch(movieEndpoint)
    .then(response => response.json())
    .then(data => {
      const filmsList = document.getElementById("films");
      data.forEach(movie => {
        const listItem = document.createElement("li");
        listItem.classList.add("film", "item");
        listItem.textContent = movie.title;
        listItem.id = `film-${movie.id}`;


      //This will create a delete button 

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', function () {deleteMovie(movie.id);});

        // This shows movie info on click
        listItem.appendChild(deleteButton);

        listItem.addEventListener("click", function () {updateMovieInfo(movie);});

        filmsList.appendChild(listItem);
      });

      // This shows the first movie's details initially
      
      updateMovieInfo(data[0]); 
    })

});