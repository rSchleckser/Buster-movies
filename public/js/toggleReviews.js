    // create short text onload
    document.addEventListener("DOMContentLoaded", function() {
        const reviewItems = document.querySelectorAll('.review-item .description');
        reviewItems.forEach(review => {
          const fullContent = review.getAttribute('data-full-content');
          const shortContent = review.querySelector('.short-content');
          shortContent.textContent = reduceText(fullContent, 20)
        });
      });
  
      // Toggle function
      function toggleFullReview(event, link) {
        event.preventDefault();
        const descriptionDiv = link.closest('.description');
        const fullContent = descriptionDiv.getAttribute('data-full-content');
        const shortContent = descriptionDiv.querySelector('.short-content');
  
        if (link.textContent === 'View More') {
          shortContent.textContent = fullContent;
          link.textContent = 'View Less';
        } else {
          shortContent.textContent = reduceText(fullContent, 20);
          link.textContent = 'View More';
        }
      }
  
      //Reduce text to word limit ...
      function reduceText(text, wordLimit) {
        const words = text.split(' ');
        if (words.length > wordLimit) {
          return words.slice(0, wordLimit).join(' ') + '...'
        }
        return text
      }