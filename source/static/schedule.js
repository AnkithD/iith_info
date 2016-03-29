var after_gap = false;
var courses;
var course_offset = 0;

function pills_activate() {
    if (!$(".slots").hasClass("loading")) {
        $(".slots").addClass("loading");
        $(".nav-pills > li").removeClass("active");
        $(this).addClass("active");
        course_offset = ($(this).text() == "Today")? 0:1;
        $(".slots").html("<style type='text/css'>@-webkit-keyframes uil-default-anim { 0% { opacity: 1} 100% {opacity: 0} }@keyframes uil-default-anim { 0% { opacity: 1} 100% {opacity: 0} }.uil-default-css > div:nth-of-type(1){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.5s;animation-delay: -0.5s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(2){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.4166666666666667s;animation-delay: -0.4166666666666667s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(3){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.33333333333333337s;animation-delay: -0.33333333333333337s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(4){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.25s;animation-delay: -0.25s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(5){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.16666666666666669s;animation-delay: -0.16666666666666669s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(6){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.08333333333333331s;animation-delay: -0.08333333333333331s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(7){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0s;animation-delay: 0s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(8){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.08333333333333337s;animation-delay: 0.08333333333333337s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(9){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.16666666666666663s;animation-delay: 0.16666666666666663s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(10){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.25s;animation-delay: 0.25s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(11){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.33333333333333337s;animation-delay: 0.33333333333333337s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}.uil-default-css > div:nth-of-type(12){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.41666666666666663s;animation-delay: 0.41666666666666663s;}.uil-default-css { position: relative;background:none;width:200px;height:200px;}</style><div id='loading' class='uil-default-css' style='transform:scale(0.35);'><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(0deg) translate(0,-60px);transform:rotate(0deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(30deg) translate(0,-60px);transform:rotate(30deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(60deg) translate(0,-60px);transform:rotate(60deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(90deg) translate(0,-60px);transform:rotate(90deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(120deg) translate(0,-60px);transform:rotate(120deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(150deg) translate(0,-60px);transform:rotate(150deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(180deg) translate(0,-60px);transform:rotate(180deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(210deg) translate(0,-60px);transform:rotate(210deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(240deg) translate(0,-60px);transform:rotate(240deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(270deg) translate(0,-60px);transform:rotate(270deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(300deg) translate(0,-60px);transform:rotate(300deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(330deg) translate(0,-60px);transform:rotate(330deg) translate(0,-60px);border-radius:10px;position:absolute;'></div></div>");
        display_schedule();
    }
}

function open_detail(code) {
    for(var j=0; j < courses.length;j++) {
        if (code == courses[j].substring(0,6)) {
            course = courses[j].split('`') //course data structure: [code 0, start_hour 1, end_hour 2, name 3, duration 4, room 5, credits 6, former 7, pre-req 8, desc 9, segment 10]
        }
    }
    $(".view").html('Course Code : ' + course[0] + ' ' + (course[7]=="None"? '':'(formerly '+course[7]+')')+'<br> Course Name : ' + course[3] +'<br> Pre-requsites : ' + course[8] + '<br> <span id="credits">Credit(s) : ' + course[6] + '</span>  <span id="room">Room : ' + course[5] + '</span>  <span id="segment">Segment : ' + course[10] + '</span><br> Description : ' + course[9].replace("\n","<br>"));
}


function open_menu(meal) {
    alert(meal);
}

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


function get_next_meal_time(time) {
    time = intify_time(time);
    if (time < 1230) {
        return "12:30";
    } else if (time < 1715) {
        return "17:15";
    } else if (time < 1930) {
        return "19:30"
    } else {
        return ""
    }
    
}


function subtract_time(a, b) {
    a = intify_time(a);
    b = intify_time(b);
    
    var container;
    if (a < b){
        container = a;
        a = b;
        b = container;
    }
    
    var a_hour = Math.floor(a/100);
    var b_hour = Math.floor(b/100);
    var a_minute = a%100;
    var b_minute = b%100;
    
    if (a_minute-b_minute < 0) {
        return ((a_hour-b_hour-1)*60)+60+a_minute-b_minute;
    } else {
        return ((a_hour-b_hour)*60)+a_minute-b_minute;
    }
}


function intify_time(time) {
    return Number(time.replace(":", ""));
}


function insert_panel(from , to, type, content) {
    type = (typeof type == 'undefined')? 'eperiod':type;
    content = (typeof content == 'undefined')? '':content;
    
    var scale_factor = ($(".timeline").height()/2300)*152
    var duration = subtract_time(from, to);
//    duration  = (type == "eperiod")? duration-10:duration;
    var height = (duration/60)*scale_factor;
    var id;
    if (type == "period") {
        id = content[0];
        content = '<p style="font-size:1.8em; margin: 0px; width:50%">'+content[0]+'</p>'+
        '<h4 style="margin-top: -2em; float: right"><span class="label label-default">'+content[6]+' CREDIT(S)</span></h4>'+
        '<p style="margin: 0px; font-size:1.4em">'+content[3]+'<br></p>'+
        '<span class="badge" style="font-size:1.2em; float:right">'+content[5]+'</span>'
    }
    var func = "";
    switch(type) {
        case "eperiod":
            break;
        case "period":
            func = "open_detail('"+id+"');"
            break;
        default:
            func = "open_menu('"+type+"');"
            
    }
    $(".slots").html(function(index, current) {
                        return current+'<div onclick="'+func+'" id="'+id+'" style="height:' + String(height) + 'px'+ '" class="' + type + '">'+ content +'</div>';
                    });
    after_gap = (type == "eperiod")? true:false;
}

function display_schedule() {
    var xhttp = new XMLHttpRequest()
    
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var response = JSON.parse(xhttp.responseText);
            if (response.status == "Success") {
                courses = (response.day == "")? "":response.day.split("|");
                $("#loading").fadeOut(500, function() {
                    insert_panel("7:30", "9:00", "breakfast", "Breakfast");
                    var lunch = false, snacks = false, current_end = "9:00";
                    for (var i=0; i < courses.length; i++){                 //course data structure: [code 0, start_hour 1, end_hour 2, name 3, duration 4, room 5, credits 6, former 7, pre-req 8, desc 9, segment 10]
                        course = courses[i].split('`');                        
                        if (i == courses.length - 1) {
                            course_next = [0,get_next_meal_time(course[2]),0,0,0,0,0]
                        } else {
                            course_next = courses[i+1].split('`');
                            next_start = course_next[1];
                        }
                        if (!lunch){
                            if (intify_time(course[1]) > 1230) {    // Need to add cases where period begins before lunch ends
                                var start,end;
                                start = (intify_time(current_end) >= 1230)? current_end:"12:30";
                                end = (intify_time(next_start) <= 1445)? next_start:"14:45";
                                insert_panel(start, end, "lunch", "Lunch");
                                lunch = true;
                                current_end = end;
                            }
                        }
                        if (!snacks){
                            if (intify_time(course[1]) > 1715) {
                                if (intify_time(current_end) < 1815) {
                                    if (intify_time(current_end) > 1715){
                                        insert_panel(current_end, (intify_time(next_start) < 1815) ? next_start:"18:15", "snacks", "Snacks");
                                        snacks = true;
                                        current_end = (intify_time(next_start) < 1815) ? next_start:"18:15";
                                    } else {
                                        insert_panel(current_end, "17:15")
                                        insert_panel("17:15", (intify_time(next_start) < 1815) ? next_start:"18:15", "snacks", "Snacks");
                                        snacks = true;
                                        current_end = (intify_time(next_start) < 1815) ? next_start:"18:15";
                                    }
                                }
                            }
                        }
                        
                        if (subtract_time(current_end, course[1]) > 0){
                            insert_panel(current_end, course[1]);
                        }
                        insert_panel(course[1], course[2], "period",course);
                        current_end = course[2]
                    }
                    
                    if (!lunch) {
                        if (intify_time(current_end) < 1215) {
                            insert_panel(current_end, "12:15");
                            insert_panel("12:15", "14:20", "lunch", "lunch");
                            current_end = "14:20";
                        } else {
                            if (intify_time(current_end) < 1420) {
                                insert_panel(current_end, "14:20", "lunch", "Lunch");
                                current_end = "14:20";
                            }
                        }
                    }
                    
                    if (!snacks) {
                        if (intify_time(current_end) < 1715) {
                            insert_panel(current_end, "17:15");
                            insert_panel("17:15", "18:15", "snacks", "Snacks");
                            current_end = "18:15";
                        } else {
                            if (intify_time(current_end) < 1815) {
                                insert_panel(current_end, "18:15", "snacks", "Snacks");
                                current_end = "18:15";
                            }
                        }
                    }
                    var dinner_start;
                    dinner_start = (intify_time(current_end) < intify_time("19:30"))? "19:30":current_end;
                    insert_panel(current_end, dinner_start);
                    insert_panel(dinner_start, "21:20", "dinner", "Dinner");
                    $(".slots").removeClass("loading");
            });
            }
        }
    }
    
    xhttp.open("POST", "/get-day", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username="+getCookie("last_user")+"&offset="+course_offset);
}

$("document").ready(function () {
    $(".nav-pills > li").on("click", pills_activate);
    display_schedule();
});