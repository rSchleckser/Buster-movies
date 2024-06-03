function showEditForm(reviewId) {
    const form = document.getElementById(`editForm_${reviewId}`);
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  }