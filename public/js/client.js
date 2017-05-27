var baseUrl = location.origin;

$(document).ready(function(){

    var $grid = $('.grid').imagesLoaded( function() {
        $grid.masonry({
            itemSelector: '.grid-item',
            isFitWidth: true,
            gutter:10
        }); 
    });

    function addWarning(selector, message) {
        $(selector).html('');
        var html = 
            `
            <div class="alert alert-warning alert-dismissable fade in">
                <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                <strong>${message}</strong> 
            </div>               
        `;
            $(selector).append(html);
    }


    $( document.body).on('click','.delete', function(e) {
        e.preventDefault();
        let id = $( this ).attr('id');
        let data = { id:id };
        console.log(id);
        ajaxRequest(`${baseUrl}/userLogged/deleteBook`, 'DELETE', data, function(err, data) {
            if (!err) {
                $grid.masonry( 'remove', $(`[name=${id}]`))
                    // trigger layout
                    .masonry('layout');
            } else {
                alert("Something went wrong!");
            }
        });
    });

     $( ".exchange" ).click(function() {
        let data = { id:$( this ).attr('id') };
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
        let parent = $(this).parent();
        let idNum = parent.parent().attr('id');
        let data = { id:idNum };
        console.log(data);
        let id = "#" + idNum;
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
            jQuery('.grid').prepend('<div id="loader"></div>');
            ajaxRequest(`${baseUrl}/userLogged/newBook`, 'POST', data, function(err, data) {
                if (!err) {
                    let html = `<div class="grid-item" name=${data._id} >`;
                    html += `<img src=${data.link} alt=${data.title}>`;
                    html += `<i id=${data._id} class="fa fa-times topright delete" aria-hidden="true" ></i>`;
                    html += `</div>`;
                    var elem = $(html);
                    jQuery('#loader').remove();
                    $grid.append(elem);
                    $grid.masonry( 'appended', elem )
                        .masonry('layout');
                    jQuery('#bookname').val('');
                } else {
                    alert("Please provide a valid title or specify the author!");
                }
            });
        }
    });

    jQuery('#options').on('submit', function(e){
        e.preventDefault();
        var data ={};
        
        if (jQuery('#fullName').val() !== "") {
             data.fullName = jQuery('#fullName').val();
             jQuery('#cName').text(data.fullName);
             jQuery('#fullName').val('');
         }
        if (jQuery('#city').val() !== "") { 
             data.city = jQuery('#city').val();
             jQuery('#cCity').text(data.city);
             jQuery('#city').val('');
         }
        if (jQuery('#state').val() !== "") {
             data.state = jQuery('#state').val();
             jQuery('#cState').text(data.state);
             jQuery('#state').val('');
         }

        if (!data.fullName && !data.city && !data.state ) { return alert("You didn't change anything!"); }
        
        ajaxRequest(`${baseUrl}/userLogged/options`, 'POST', data, function(err, data) {
            if (!err) {
                alert('You successfully changed your contact information!')
            } else {
                alert('Something went wrong');
            }
        });
    });    

///// User handling logic start  

    //modal handling

    $('#loginModal').modal({ backdrop: 'static', keyboard: false, show: false });
    $('#signUpModal').modal({ backdrop: 'static', keyboard: false, show: false });


    $('#loginModal').on('hide.bs.modal', function () {
        $('#loginError').empty();
        jQuery('[name=emailLog]').val('');
        jQuery('[name=pwdLog]').val('');
    })

    $('#signUpModal').on('hide.bs.modal', function () {
        $('#signUpError').empty();
        jQuery('[name=email]').val('');
        jQuery('[name=password]').val('');
        jQuery('[name=name]').val('');
    })


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
                addWarning('#loginError', "Invalid Credentials");    
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
                addWarning('#signUpError', err.responseText);
            }
        });
    });

    //user log out
    jQuery('#logOut').on('click',function(e){
        e.preventDefault();
        ajaxRequest(`${baseUrl}/users/me/token`, 'DELETE', {}, function(err, data) {
            if (!err) {
                window.location.replace('/');
            } 
        });
    });


 ///// User handling logic end



});


