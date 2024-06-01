document.addEventListener("DOMContentLoaded", function() {
    const toggleButtons = document.querySelectorAll('.ui.toggle.button');
    toggleButtons.forEach(button => {
      button.addEventListener('click', function() {
        this.classList.toggle('toggled')
        const icon = this.querySelector('i');

        // Toggle text and icon
        if (this.classList.contains('toggled')) {
          icon.className = 'check icon';
          this.childNodes[2].nodeValue = 'Added';
        } else {
          icon.className = 'add icon';
          this.childNodes[2].nodeValue = 'Add';
        }
      })
    });
  });