$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.username).appendTo($("body"));
      $("<div>").text(user.email).appendTo($("body"));
    }
  });;
});

$(() => {
  $('#testbutton').click(function(e){
    alert("hello");
    $.ajax({
      method: "GET",
      url: "/test",
      dataType: 'json',
      success: function (result) {
        for (let i = 0; i < result.length; i++) {
          let element = result[i];
          let preElement = {};
          if (i === 0) {
            console.log(`title: ${element.title}`);
            console.log(`tag_name: ${element.tag_name}`);
            // not the first element, compare title with previous element
          } else {
            preElement.val = result[i - 1];
            if (element.title !== preElement.val.title) {
              console.log(`title: ${element.title}`);
              console.log(`tag_name: ${element.tag_name}`);
            } else {
              console.log(`tag_name: ${element.tag_name}`);
            }
            continue;
          }
        }
      },

     
      error: function (error) {
        console.log("we are in error", error);
      }
    });;
  })
});
