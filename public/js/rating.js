$('.ui.rating').rating({
  initialRating: 3,
  maxRating: 5,
  onRate: function(value) {
    $('#rating').val(value);
  }
});