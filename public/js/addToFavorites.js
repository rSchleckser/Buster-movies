document.addEventListener("DOMContentLoaded", function() {
    const toggleButtons = document.querySelectorAll('.ui.teal.favorite.button');
    toggleButtons.forEach(button => {
      button.addEventListener('click', function() {
        this.classList.toggle('favorited')
        const icon = this.querySelector('i');

        // Toggle text and icon
        if (this.classList.contains('favorited')) {
          icon.className = 'heart icon';
          this.childNodes[2].nodeValue = 'Favorited';
        } else {
          icon.className = 'add icon';
          this.childNodes[2].nodeValue = 'Favorite';
        }
      })
    });
  });
  