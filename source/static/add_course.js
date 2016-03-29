function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') 
            c = c.substring(1);
        if (c.indexOf(name) == 0) 
            return c.substring(name.length,c.length);
    }
    return "";
}

function course_search() {
    $("#submit").removeClass("disabled");
    $("#addCourseWarning").fadeOut(200);
    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var response = JSON.parse(xhttp.responseText);
            
            if (response.status == "Success") {
                var results = response.result.split("|");
                var name = "";
                $("#result").html("");
                for(var i=0;i < results.length;i++) {
                    $("#result").html(function(index, current) {
                        name = results[i].split("`")
                        name = name[0]+":"+name[1]
                        return current+"<option>"+name+"</options>"
                    });
                }
            } else {
                if (response.status == "No Result") {
                    $("#addCourseWarning").fadeIn(250);
                    $("#addCourseHeading").text("No match has been found");
                } else {
                    $("#addCourseWarning").fadeIn(250);
                    $("#addCourseHeading").text("ResponseFail Error occured");
                }
            }
        }
    }
    
    xhttp.open("POST", "/search-course", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("query="+$("#search").val());
}

function submit_course() {
    if ($("#result").val() != null && !$("#submit").hasClass("disabled")) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                var response = JSON.parse(xhttp.responseText);
                alert(response.status);
                
                if (response.status == "Success") {
                    $("#submit").addClass("disabled");
                    $("#addCourseWarning").removeClass("alert-danger");
                    $("#addCourseWarning").addClass("alert-success");
                    $("#addCourseWarning").fadeIn(250);
                    $("#addCourseHeading").text("Succesfully Added!");
                } else {
                    if (response.status == "Already") {
                        $("#addCourseWarning").fadeIn(250);
                        $("#addCourseHeading").text("Already Registered for this Course!");
                    } else {
                            $("#addCourseWarning").fadeIn(250);
                            $("#addCourseHeading").text("ResponseFail error occured");
                        }
                    }
                } 
            }

        xhttp.open("POST", "/add-course", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("username="+getCookie("last_user")+"&course="+$("#result").val().substring(0,6)+"&type="+($("#LA").hasClass("active")? "l":"f"));
        console.log($("#result").val().substring(0,6));
        } 
    }