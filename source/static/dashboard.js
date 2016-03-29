today = new Date();

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

hour = today.getHours();
    if (hour >= 5 && hour < 12){
        greet_first = "M";
        greet_next = "ORNING";
        background = "morning.jpg";
    } else if (hour >= 12 && hour < 16) {
        greet_first = "A";
        greet_next = "FTERNOON";
        background = "noon.jpg";
    } else if (hour >= 16 && hour < 19) {
        greet_first = "E";
        greet_next = "VENING";
        background = "evening.jpg"
    } else if (hour >= 19 || hour < 5) {
        greet_first = "N";
        greet_next = "IGHT"
        background = "midnight.jpg"
    }
    $(document.body).css("background-image", "url(../static/"+background+");");
    $("#greet_first").text(greet_first);
    $("#greet_rest").text(greet_next);

$("document").ready(function () {
    /*var Tooltip = $('[data-toggle="tooltip"]');
    if (window.innerWidth < 756) {
        Tooltip.css({"width": "140px"});
        Tooltip.tooltip({placement: "right"});
    } else {
        Tooltip.tooltip({placement: "bottom"});
        Tooltip.css({"width": "auto"});
    }*/

    var xhttp  = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var response = JSON.parse(xhttp.responseText);
            
            if (response.status == "Success") {
                var courses = response.day.split("|");
                $("#loading").fadeOut(500, function() {
                    for (var i=0; i < courses.length; i++){
                        course = courses[i].split('`');                 //course data structure: [code 0, start_hour 1, end_hour 2, name 3, duration 4, room 5, credits 6]
                        $("#carousel").html(function (index, current) {
                            return current+ '<div class="item '+(i==0 ? "active" : "")+' pads"><span style="font-size:'+ 70*20/Math.ceil(course[0].length + course[3].length) +'px">'+course[0]+ ':' + course[3] +'</span><br> @ '+course[1]+'</div>';
                        })
                    }
            });
            }
        }
    }
    
    xhttp.open("POST", "/get-day", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username="+getCookie("last_user")+"&offset=0");
});