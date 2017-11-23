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
  $.ajax({
    method: "GET",
    url: "/api/resources"
  }).done((resources) => {
    for (resource of resources) {
      console.log(resource);
      $("<div>").text(resource.title).appendTo($("body"));
      $("<div>").text(resource.url).appendTo($("body"));
      $("<div>").text(resource.description).appendTo($("body"));
      $("<p>").appendTo($("body"));
    }
  });;
});
