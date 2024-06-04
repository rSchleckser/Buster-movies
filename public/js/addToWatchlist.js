document.addEventListener("DOMContentLoaded", function() {
 
});

function addToWatchList(button) {
  button.classList.toggle('toggled');
  const icon = button.querySelector('i');

  // Toggle text and icon
  if (button.classList.contains('toggled')) {
      icon.className = 'check icon';
      button.childNodes[2].nodeValue = 'Added';
    
      console.log('Added to watchlist');
  } else {
      icon.className = 'add icon';
      button.childNodes[2].nodeValue = 'Add';
      
      console.log('Removed from watchlist');
  }
}
