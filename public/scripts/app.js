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
  // $.ajax({
  //   method: "GET",
  //   url: "/api/resources"
  // }).done((resources) => {
  //   console.log("we are testing");
  //   console.log(response);

  //   // for (resource of resources) {
  //   //   console.log(resource);
  //   //   $("<div>").text(resource.title).appendTo($("body"));
  //   //   $("<div>").text(resource.url).appendTo($("body"));
  //   //   $("<div>").text(resource.description).appendTo($("body"));

  //   //   $("<p>").appendTo($("body"));
  //   // }
  // });;

  $('#testbutton').click(function(e){
    alert("hello");
    $.ajax({
      method: "GET",
      url: "/test",
      dataType: 'json',
      success: function (result) {
        var output = "";
        var titles = [];
        var title = '';
        titles.push(title);
        for(var i =0; i<result.length; i++){
          if(jQuery.inArray(result[i].title,titles)===-1){
            titles.push(result[i].title);
          }
        }
        console.log("Single Titles "+titles);

        for(var x = 0; x<titles.length; x++){
          
          for (var i = 0; i < result.length; i++) {
            if (titles[x] === result[i].title) {
              if (i != 0) {
                output = output + ", " + result[i].tag_name;
              } else {
                output = output + result[i].tag_name;
              }
            }
          }
          //output the loop contents
          $("<div>").text(titles[x]).appendTo($("body"));
          $("<br/>").appendTo($("body"));
          $("<div>").text(output).appendTo($("body"));
          output="";

        }
        
        //pushes the content to the HTML and displays it.
        //$('<p></p>').appendTo($("body"));
        // $("<div>").text(result[0].title).appendTo($("body"));
        // $("<br/>").appendTo($("body"));
        // $("<div>").text(output).appendTo($("body"));

      },

     
      error: function (error) {
        console.log("we are in error", error);
      }

    });;


  })
   

});
