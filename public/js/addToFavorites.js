document.addEventListener("DOMContentLoaded", function() {
 
  });
  
  function addToWatchList(button) {
    button.classList.toggle('favorited');
    const icon = button.querySelector('i');
  
    // Toggle text and icon
    if (button.classList.contains('favorited')) {
        icon.className = 'check icon';
        button.childNodes[2].nodeValue = 'Favorited';
      
    } else {
        icon.className = 'add icon';
        button.childNodes[2].nodeValue = 'Favorite';
          
    }
  }