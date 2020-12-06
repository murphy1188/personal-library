$( document ).ready(function() {
  let  items = [];
  let  itemsRaw = [];
  
  $.getJSON('/api/books', function(data) {
    //let  items = [];
    itemsRaw = data;
    $.each(data, function(i, val) {
      items.push('<li class="bookItem" id="' + i + '"><b>' + val.title + '</b> - ' + val.commentcount + ' comments</li>');
      //return ( i !== 14 );
    });
    //if (items.length >= 15) {
      //items.push('<p>...and '+ (data.length - 15)+' more!</p>');
    //}
    $('<ul/>', {
      'class': 'listWrapper',
      html: items.join('')
      }).appendTo('#display');
  });
  
  let  comments = [];
  $('#display').on('click','li.bookItem',function() {
    $("#detailTitle").html('<b style="font-size: 24px;">'+itemsRaw[this.id].title+'</b> <span style="float: right;"><b>id:</b> <em>'+itemsRaw[this.id]._id+'</em></span>');
    $.getJSON('/api/books/'+itemsRaw[this.id]._id, function(data) {
      comments = [];
      comments.push('<ol>');
      $.each(data.comments, function(i, val) {
        comments.push('<li>' +val+ '</li>');
      });
      comments.push('</ol>')
      comments.push('<form id="newCommentForm"><label for="comment" class="text-left">Add comment:</label><input type="text" class="form-control" id="commentToAdd" name="comment" placeholder="Type your comment here..."></form>');
      comments.push('<button class="btn btn-primary addComment" id="'+ data._id+'">Add Comment</button>');
      comments.push('<button class="btn btn-danger deleteBook" id="'+ data._id+'">Delete Book</button>');
      $('#detailComments').html(comments.join(''));
    });
  });
  
  $('#bookDetail').on('click','button.deleteBook',function() {
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'delete',
      success: function(data) {
        //update list
        $('#detailComments').html('<p style="color: red;">'+data+'<p><p>Refresh the page</p>');
      }
    });
  });  
  
  $('#bookDetail').on('click','button.addComment',function() {
    let  newComment = $('#commentToAdd').val();
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success: function(data) {
        comments.unshift(newComment); //adds new comment to top of list
        $('#detailComments').html(comments.join(''));
      }
    });
  });
  
  $('#newBook').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
      }
    });
  });
  
  $('#deleteAllBooks').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
      }
    });
  }); 
  
});