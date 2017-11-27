// dom ready
jQuery(document).ready(() => {
  const $like = $('.like');
  $like.on('submit', updateLike());
});

function updateLike() {
  if (!like[0]) {
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