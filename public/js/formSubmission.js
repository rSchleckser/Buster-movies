document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.querySelector('.search.link.icon');
    const formSubmission = searchIcon.closest('form');

    searchIcon.addEventListener('click', function() {
      formSubmission.submit();
    });
  });