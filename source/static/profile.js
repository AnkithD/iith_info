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

$("document").ready(function () {
    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
             var response = JSON.parse(xhttp.responseText);
            
            if (response.status == "Success") {
                courses = response.data.split("|");
                
                for(var i=0;i < courses.length;i++){
                    course = courses[i].split("`");
                    console.log(course);
                    $("#courses").html(function(index, current) {
                        return current + '<li class="list-group-item list-group-item-default">'+ course[0] + ': ' + course[1] +'</li>'
                    })
                }
            }   
        }
    }
    xhttp.open("POST", "/get-all-courses", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username="+getCookie("last_user"));
});