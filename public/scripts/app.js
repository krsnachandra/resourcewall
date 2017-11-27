// dom ready
$(() => {
  // console.log(resource);
  const $like = $('.like');
  $like.on('submit', loadResource());
});

function loadResource() {
  
  $.ajax({
    url: `/resources/${req.params.id}`,
    method: 'GET',
    success: (resource, like) => {
      console.log('i am here');
      updateLike(resource, like);
    }
  });
}

function updateLike(resource, like) {
  console.log(typeof(resource));
  console.log(resource);
  console.log(like);
  if (!like) {
    $.ajax({
      url: `/resources/${resource.id}/like`,
      method: 'POST'
    });
  } else {
    $.ajax({
      url: `/resources/${resource.id}/delete`,
      method: 'POST',
      success: $('.like src').val('/images/unlike.png')
    });
  }
}