var baseUrl = location.origin;

function ajaxRequest(url, method, data, callback) {
    $.ajax({
        url: url,
        type: method,
        data: data,
        success: function(data, textStatus, request) {
            callback(null, data);
        },
        error: function(e) {
            callback(e);
        }
    });   
}

$(document).ready(function(){

    var $grid = $('.grid').imagesLoaded( function() {
        $grid.masonry({
            itemSelector: '.grid-item',
            isFitWidth: true,
            gutter:10
        }); 
    });


    $( ".delete" ).click(function() {
        let data = { id:$( this ).attr('id') };
        let name = $( this ).parent().attr('name');
        ajaxRequest(`${baseUrl}/userLogged/deleteBook`, 'DELETE', data, function(err, data) {
            if (!err) {
                $grid.masonry( 'remove', $(`[name=${name}]`))
                    // trigger layout
                    .masonry('layout');
            } else {
                alert("Something went wrong!");
            }
        });
    });

     $( ".exchange" ).click(function() {
        let data = { id:$( this ).attr('id') };
        let name = $( this ).parent().attr('name');
        let id = "#" + $( this ).attr('id');
        ajaxRequest(`${baseUrl}/userLogged/requestTrade`, 'PATCH', data, function(err, data) {
            if (!err) {
              $(id).remove();

            } else {
                alert("Something went wrong!");
            }
        });
    });   

     $( ".cancel" ).click(function() {
        let data = { id:$( this ).parent().attr('id') };
        let id = "#" + $( this ).parent().attr('id');
        ajaxRequest(`${baseUrl}/userLogged/cancelTrade`, 'PATCH', data, function(err, data) {
            if (!err) {
              $(id).remove();

            } else {
                alert("Something went wrong!");
            }
        });
    });   

    $( ".accept" ).click(function() {
        let parent = $(this).parent();
        let data = { id:parent.parent().attr('id') };

        ajaxRequest(`${baseUrl}/userLogged/acceptTrade`, 'PATCH', data, function(err, data) {
            if (!err) {
              parent.empty();
              parent.append('<span class="pull-right">Completed!</span>');

            } else {
                alert("Something went wrong!");
            }
        });
    });   
     $('#bookname').keypress(function(event){
        var title = jQuery('#bookname').val();   
        if(event.which == 13 && title != ""){
            let data ={ title:title };
            ajaxRequest(`${baseUrl}/userLogged/newBook`, 'POST', data, function(err, data) {
                if (!err) {
                    let html = `<div class="grid-item">`;
                    html += `<img src=${data.link} alt=${data.title}>`;
                    html += `<i id=${data._id} class="fa fa-times topright delete" aria-hidden="true" ></i>`;
                    html += `</div>`;
                    var elem = $(html);
                    $grid.append(elem);
                    $grid.masonry( 'appended', elem )
                        .masonry('layout');
                    jQuery('#bookname').val('');
                } else {
                    alert("Please privede a valid title or specify the author!");
                }
            });
        }
    });

    //user login
    jQuery('#login').on('submit', function(e){
        e.preventDefault();
        var data ={
            emailLog:jQuery('[name=emailLog]').val(),
            pwdLog:jQuery('[name=pwdLog]').val()
        };
        ajaxRequest(`${baseUrl}/users/login`, 'POST', data, function(err, data) {
            if (!err) {
                window.location.replace('/userLogged');
            } else {
                alert('"Invalid username. email or password"');
            }
        });
    });

    //user signup
    jQuery('#signUp').on('submit',function(e){
        e.preventDefault();
        var data ={
            email:jQuery('[name=email]').val(),
            password:jQuery('[name=password]').val(),
            name:jQuery('[name=name]').val()
        };
        ajaxRequest(`${baseUrl}/users`, 'POST', data, function(err, data) {
            if (!err) {
                window.location.replace('/userLogged');
            } else {
                alert("Username or email is already in use!");
            }
        });
    });

    //user log out
    jQuery('#logOut').on('click',function(e){
        e.preventDefault();
        ajaxRequest(`${baseUrl}/users/me/token`, 'DELETE', {}, function(err, data) {
            if (!err) {
                window.location.replace('/');
                alert('You succesfully logged out');
            } 
        });
    });

});




























// var x = location.origin;
// console.log(x);
// console.log(`${x}/api/getPools`);
// fetch(`${x}/api/getPools`)
//   .then((res)=>{
//     //console.log(JSON.stringify(result,'',2));
//     return res.json();
//   })
//   .then((polls)=>{
//       console.log(polls);
//   })
//   .catch((err)=>{
//     console.log(err);
//   });