$(document).ready(function() {

    //change tags
    // var $cs1 = $( "<span class=tag data-tag='java'>Java<span class='form-rem-tag glyphicon glyphicon-remove'></span></span>" )
    // var $cs2 = $( "<span class=tag data-tag='html'>HTML<span class='form-rem-tag glyphicon glyphicon-remove'></span></span>" )
    // var $cs3 = $( "<span class=tag data-tag='nodejs'>Node.js<span class='form-rem-tag glyphicon glyphicon-remove'></span></span>" )
    // $('#tags').prepend($cs1,$cs2,$cs3);
    // var $de1 = $( "<span class=tag data-tag='photoshop'>Photoshop<span class='form-rem-tag glyphicon glyphicon-remove'></span></span>" )
    // var $de2 = $( "<span class=tag data-tag='illustrator'>Illustrator<span class='form-rem-tag glyphicon glyphicon-remove'></span></span>" )
    // var $de3 = $( "<span class=tag data-tag='after_effect'>After Effect<span class='form-rem-tag glyphicon glyphicon-remove'></span></span>" )
    // var $de4 = $( "<span class=tag data-tag='solid_works'>Solid Works<span class='form-rem-tag glyphicon glyphicon-remove'></span></span>" )
    // $('#form-degs').on('change', function() {
    //     $('.tag').remove()
    //     if($(this).val()==='cs' || $(this).val()==='eng'){
    //         $('#tags').prepend($cs1,$cs2,$cs3);
    //     }else if($(this).val()==='vis-comm' || $(this).val()==='ind-design'){
    //         $('#tags').prepend($de1,$de2,$de3,$de4);
    //     }else if ($(this).val()==='cs-design') {
    //         $('#tags').prepend($cs1,$cs2,$cs3);
    //     }
    // });
//

    // Hide academic field and institution if not student and no degree
    if ( ($('#form-student').val()==='false') && ($('#form-degree').val()==='none') ){
        $('#wrap-field').css('display','none');
        $('#form-field').prop('required',false);
        $('#wrap-institution').css('display','none');
        $('#form-institution').prop('required',false);
    }

    // Hide/show academic field and institution on student field change
    $('#form-student').on('change', function() {
        if ($(this).val()==='true'){
            $('#wrap-field').css('display','block');
            $('#form-field').prop('required',true);
            $('#wrap-institution').css('display','block');
            $('#form-institution').prop('required',true);
        } else {
            if ($('#form-degree').val()==='none'){
                $('#wrap-field').css('display','none');
                $('#form-field').prop('required',false);
                $('#wrap-institution').css('display','none');
                $('#form-institution').prop('required',false);
            }
        }
    });

    // Hide/show academic field and institution on degree field change
    $('#form-degree').on('change', function() {
        if ($(this).val()==='none'){
            if ($('#form-student').val()==='false'){
                $('#wrap-field').css('display','none');
                $('#form-field').prop('required',false);
                $('#wrap-institution').css('display','none');
                $('#form-institution').prop('required',false);
            }
        } else {
            $('#wrap-field').css('display','block');
            $('#form-field').prop('required',true);
            $('#wrap-institution').css('display','block');
            $('#form-institution').prop('required',true);
        }
    });



    // On submit ajax to server
    $('form').on('submit', function(e) {
        e.preventDefault();
        $('#reg_but').prop('disabled',true);
        $('.reg-loader').css('display','inline-block');
        // case password don't match
        if ($('#form-pass-ver').val() !== $('#form-pass').val()) {
            modal({
                type: 'error',
                title: 'Houston, We have a problem',
                text: "The passwords you inserted does not match, Please fix and try again",
                animate:true
            });
            $('.reg-loader').css('display','none');
            $('#reg_but').prop('disabled',false);
        } else {
            var tags = $('.tag');
            var jTags = [];
            $.each(tags, function(key, value) {
                jTags.push($(value).attr('data-tag'));
            });
            var formData = new FormData(this);
            formData.append('tags', jTags);
            formData.append('regDate', Date());
            $.ajax({
                type: "POST",
                cache: false,
                contentType: false,
                processData: false,
                url: $(this).attr('action'),
                data: formData,
                success: function(data) {
                    modal({
                        type: 'success',
                        title: 'Success',
                        text: "You registered successfully! You will now be redirected to our team registration platform.",
                        animate:true,
                        callback:function(){window.location.replace("/login");}
                    });
                },
                error: function (data) {
                    if (data.status==409){
                        modal({
                            type: 'error',
                            title: 'Houston, We have a problem',
                            text: "A user with this email already exists.\nThere is no need to register twice.\nfor help please contact contact@datahack-il.com",
                            animate:true
                        });
                        $('.reg-loader').css('display','none');
                        $('#reg_but').prop('disabled',false);
                    }
                    else{
                        console.log(data.status)
                        console.log(data)
                        modal({
                            type: 'error',
                            title: 'Houston, We have a problem',
                            text: "We have a problem. Please try again or contact contact@datahack-il.com",
                            animate:true
                        });
                        $('.reg-loader').css('display','none');
                        $('#reg_but').prop('disabled',false);
                    }
                }
            });
        }
    });


    // cancel enter submit form

    $(window).keydown(function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
});
