$(function(){
  getToDo();
  //New To Do Button Listener
  $('#newToDoButton').on('click', function(){
    var ToDoObj = {ToDoName: $('#newToDo').val()}
    $.ajax({
      type: 'POST',
      data: ToDoObj,
      url: '/newToDo',
      success: function( response ){
        $('#newToDo').empty();
        getToDo();
      }
    });
  });

  //Complete Button Listener
  $('#displayToDo').on('click', '.completedButton', function(){

       var toDoID = $(this).data('id');
       console.log('completeButton on click:', toDoID);
       var completedToDo = {
         id: toDoID
       };
       $.ajax({
         type: 'PUT',
         data: completedToDo,
         url: '/completeToDo',
         success: function( response ){

           getToDo();

         }
       });

   });

   //Delete Button Listener
   $('#displayToDo').on('click', '.deleteButton', function(){
       if(confirm( 'Are you sure?')){
        var toDoID = $(this).data('id');
        var deleteToDo = {
          id: toDoID
        };
        $.ajax({
          type: 'DELETE',
          data: deleteToDo,
          url: '/deleteToDo',
          success: function( response ){

            getToDo();

          }
        });
      }
   });

});

var getToDo = function(){
    $.ajax({
      type: 'GET',
      url: '/getToDo',
      success: function( response ){

        $('#displayTodo').empty();
        $('#displayToDo').children().empty();

        for (var i = 0; i < response.length; i++) {
          if( response[i].finished ){
            $('#displayToDo').append( '<p class="green">' + response[i].name + '<button class="deleteButton" data-id="' + response[i].id + '">Delete</button>' + '</p>');
          }
          else{
            $( '#displayToDo' ).append( '<p class="red">' + response[i].name + ' <button class="completedButton" data-id="' + response[i].id + '">Done!</button><button class="deleteButton" data-id="' + response[i].id + '">Delete</button></p>');
          }
        }
      }
    });
  };
