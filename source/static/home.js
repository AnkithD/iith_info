function force_thanks() {
    $("#regForm").fadeOut(250, function () {
        $("#thanks").fadeIn(250);
    });
}

function register() {
    if (! $(".nameField, .regRollField").hasClass("wrong") && ! $("#regSubmit").hasClass("disabled")) {
        $("#regSubmit").addClass("disabled");
        $("#regWarning").fadeOut(200);
        var xhttp = new XMLHttpRequest();
        var fname = $("#fname").val(),
            lname = $("#lname").val(),
            roll  = $(".regRollField").val();
        
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                var response = JSON.parse(xhttp.responseText);
                
                if (response.status == "Success") {
                    $("#regForm").fadeOut(250, function () {
                        $("#thanks").fadeIn(250);
                    });
                } else {
                    if (response.status == "Already") {
                        $("#regSubmit").removeClass("disabled");
                        $("#regWarningError").text("This Roll Number has already been registered. Wasn't you? Please contact the E-mail given below")
                        $("#regWarning").fadeIn(200);
                    }
                    if (response.status == "FAIL") {
                        $("#redSubmit").removeClass("disabled");
                        $("#regWarningError").text("Unkown Error occured. Please try again, or for further assistance please contact the E-mail given below")
                        $("#regWarning").fadeIn(200);
                    }
                }
            } else {
                if (xhttp.readyState == 4 && xhttp.status != 200) {
                    $("#redSubmit").removeClass("disabled");
                    $("#regWarningError").text("ResponseFail Error occured. Please try again, or for further assistance please contact the E-mail given below")
                    $("#regWarning").fadeIn(200);
                }
            }
        }
        
        xhttp.open("POST", "/register", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("fname="+fname+"&lname="+lname+"&roll="+roll);
    }
}

function change_pass() {
    if (! ($("#setPass> div > input").hasClass("wrong")) && !$('#passResetSubmit').hasClass("disabled")) {
        $("#passResetSubmit").addClass("disabled");
        
        var xhttp = new XMLHttpRequest(),
            roll = $(".changePassRollField").val(),
            tempPass = $("input[name='tempPass']").val(),
            newPass = $("input[name='newPass']").val();
        
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                var response = JSON.parse(xhttp.responseText);
                
                if (response.status == "Success") {
                    $("#thanks").fadeOut(200, function() {
                        $("#done").fadeIn(200, setTimeout(function() {
                            $("#registerModal").modal("hide");
                        }, 3000))
                    });
                } else {
                    if (response.status == "Timeout"){
                        $("#changePassWarningError").text("Your temporary password has expired, if you do not recall registering, then this may mean someone tried to register with you Roll-Number. Please Register again as this account has been automatically deleted or Please contact E-mail given below")
                        $("#changePassWarning").fadeIn(200);
                    }
                    if (response.status == "InvalidForm") {
                        $("#passResetSubmit").removeClass("disabled");
                        $("#changePassWarningError").text("InvalidForm Error occured. Please try again, or for further assistance please contact the E-mail given below")
                        $("#changePassWarning").fadeIn(200);
                    }
                    if (response.status == "InvalidTempPass") {
                        $("#passResetSubmit").removeClass("disabled");
                        $("#changePassWarningError").text("The temporary password you entered is not correct. Please check your College(@iith.ac.in) E-mail for the temporary password, or for further assistance please contact the E-mail given below")
                        $("#changePassWarning").fadeIn(200);
                    }
                }
            } else {
                if (xhttp.readyState == 4 && xhttp.status != 200) {
                $("#passResetSubmit").removeClass("disabled");
                $("#changePassWarningError").text("ResponseFail Error occured. Please try again, or for further assistance please contact the E-mail given below")
                $("#changePassWarning").fadeIn(200);
                }
            }
        }
        
        xhttp.open("POST", "/change-password", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("roll="+roll+"&oldPass="+tempPass+"&newPass="+newPass);
    }
}

function check_name() {
    var inputVal = $(this).val();
    var valid = /^[a-zA-Z ']+$/.test(inputVal);
    var current_error = $("#regWarningError").text();
    
    if (!valid) {
        $(this).addClass("wrong");
        $('#regWarning').fadeIn(200);
        $("#regWarningError").text("Names may only contain alphabets, spaces, apostrophe and cannot be left empty");
    }else {
        $(this).removeClass("wrong")
        $("#regWarning").fadeOut(200);
    }
}

function check_temp_pass() {
    var inputVal = $(this).val();
    if (inputVal.substring(0,2) == "_$" && inputVal.length == 8) {
        $(this).removeClass("wrong")
        $("#changePassWarning").fadeOut(200);   
    } else {
        $(this).addClass("wrong")
        $("#changePassWarningError").text("Not a valid temporary password.")
        $("#changePassWarning").fadeIn(200);
    }
}

function check_new_pass() {
    var inputVal = $(this).val();
    if (inputVal.length >= 7) {
        if (inputVal.length <= 77) {
            $(this).removeClass("wrong")
            $("#changePassWarning").fadeOut(200, function() {
                $("input[name='newPassConfirm']").trigger("keyup");
            });   
        } else {
            $(this).addClass("wrong")
            $("#changePassWarningError").text("Password is too long.")
            $("#changePassWarning").fadeIn(200);
        }
    } else {
        $(this).addClass("wrong")
        $("#changePassWarningError").text("Password is too short.")
        $("#changePassWarning").fadeIn(200);
    }
}

function check_new_pass_confirm() {
    if ($(this).val() == $("input[name='newPass']").val()) {
        $(this).removeClass("wrong")
        $("#changePassWarning").fadeOut(200);   
    } else {
        $(this).addClass("wrong")
        $("#changePassWarningError").text("Password and Confirmation do not match.")
        $("#changePassWarning").fadeIn(200);
    } 
}

function change_pass_check_roll() {
    var inputVal = $(this).val();
    if (inputVal.length == 14){
        if ("CS,ME,MS,EE,CH,CE,ES,EP".indexOf(inputVal.substring(0,2).toUpperCase()) > -1) {
            if (inputVal.substring(2,4) == "15") {
                if (inputVal.substring(4,9).toUpperCase() == "BTECH"){
                    if (inputVal.substring(9,12) == "110") {
                        $(this).removeClass("wrong");
                        $("#changePassWarning").fadeOut(200);
                    } else {
                        $(this).addClass("wrong");
                        $('#changePassregWarning').fadeIn(200);
                        $("#changePassregWarningError").text("Roll number is incorrect");
                    }
                } else {
                    $(this).addClass("wrong");
                    $('#changePassregWarning').fadeIn(200);
                    $("#changePassregWarningError").text("Only Btech Ist year students are currently accepted");
                }
            } else {
                $(this).addClass("wrong");
                $('#changePassregWarning').fadeIn(200);
                $("#changePassregWarningError").text("Only Btech Ist year students are currently accepted");
            }
        } else {
            $(this).addClass("wrong");
            $('#changePassWarning').fadeIn(200);
            $("#changePassWarningError").text("Roll number is incorrect");
        }
    } else {
        $(this).addClass("wrong");
        $('#changePassregWarning').fadeIn(200);
        $("#changePassregWarningError").text("Roll Number is incorrect length");
    }
}

function reg_check_roll() {
    var inputVal = $(this).val();
    if (inputVal.length == 14){
        if ("CS,ME,MS,EE,CH,CE,ES,EP".indexOf(inputVal.substring(0,2).toUpperCase()) > -1) {
            if (inputVal.substring(2,4) == "15") {
                if (inputVal.substring(4,9).toUpperCase() == "BTECH"){
                    if (inputVal.substring(9,12) == "110") {
                        $(this).removeClass("wrong");
                        $("#regWarning").fadeOut(200);
                    } else {
                        $(this).addClass("wrong");
                        $('#regWarning').fadeIn(200);
                        $("#regWarningError").text("Roll number is incorrect");
                    }
                } else {
                    $(this).addClass("wrong");
                    $('#regWarning').fadeIn(200);
                    $("#regWarningError").text("Only Btech Ist year students are currently accepted");
                }
            } else {
                $(this).addClass("wrong");
                $('#regWarning').fadeIn(200);
                $("#regWarningError").text("Only Btech Ist year students are currently accepted");
            }
        } else {
            $(this).addClass("wrong");
            $('#regWarning').fadeIn(200);
            $("#regWarningError").text("Roll number is incorrect");
        }
    } else {
        $(this).addClass("wrong");
        $('#regWarning').fadeIn(200);
        $("#regWarningError").text("Roll Number is incorrect length");
    }
}

$("document").ready(function () {
    var Tooltip = $('[data-toggle="tooltip"]');
    if (window.innerWidth < 756) {
        Tooltip.css({"width": "110px"});
        Tooltip.tooltip({placement: "right"});
    } else {
        Tooltip.tooltip({placement: "bottom"});
        Tooltip.css({"width": "auto"});
    }

    $(".nameField").on("change", check_name);
    $(".regRollField").on("change", reg_check_roll);
    $(".changePassRollField").on("change", change_pass_check_roll);
    $("input[name='tempPass']").on("change", check_temp_pass);
    $("input[name='newPass']").on("change", check_new_pass);
    $("input[name='newPassConfirm']").on("change", check_new_pass_confirm);
    
}
);