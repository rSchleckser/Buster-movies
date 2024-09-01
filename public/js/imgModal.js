document.addEventListener('DOMContentLoaded', () => {
    let currentImageIndex = 0;

    const images = Array.from(document.querySelectorAll('.card img'));
    const modalImage = document.getElementById('modalImage');
    const imageModal = $('#imageModal');

    function openModal(index) {
      currentImageIndex = index;
      modalImage.src = images[index].src;
      imageModal.modal('show');
    }

    images.forEach((img, index) => {
      img.addEventListener('click', () => openModal(index));
    });

    document.getElementById('prevImage').addEventListener('click', () => {
      if (currentImageIndex > 0) {
        openModal(currentImageIndex - 1);
      }
    });

    document.getElementById('nextImage').addEventListener('click', () => {
      if (currentImageIndex < images.length - 1) {
        openModal(currentImageIndex + 1);
      }
    });
  });