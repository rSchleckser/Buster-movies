{/* <div class="ui star rating" data-rating="<%=parseInt(media.vote_average)%>"></div> */}
$('.extra.content .rating')
  .rating({
    initialRating: 2,
    maxRating: 10
  });