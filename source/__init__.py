__author__ = 'dhtik_000'
from flask import Flask, url_for, request, redirect, render_template, make_response, jsonify
from database import *
import courses as C


app = Flask(__name__)
app.config["DEBUG"] = True
app.config["PROPAGATE_EXCEPTIONS"] = True

@app.route("/")
def main():
    user = request.cookies.get("last_user", "none")
    token = request.cookies.get("token", "none")
    token = authenticate(user, token)

    if token[:2] == "_$":
        response = make_response(redirect(url_for("dashboard")))
        response.set_cookie("last_user", user)
        response.set_cookie("token", token)
        C.load_courses(user)
        return response
    else:
        if token == "Timeout":
            return redirect(url_for("logout"))
    return redirect(url_for("login"))

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        user = request.form['username']
        pword = request.form['password']
        token = verify_user(user, pword)
        if "_$" in token:
            response = make_response(redirect(url_for('dashboard')))
            response.set_cookie("last_user", user)
            response.set_cookie("token", token)
            C.load_courses(user)
            return response

    user = request.cookies.get("last_user", "none")
    token = request.cookies.get("token", "none")
    auth = authenticate(user, token)
    if auth[:2] == "_$":
        response = make_response(redirect(url_for("dashboard")))
        response.set_cookie('token', auth)
        C.load_courses(user)
        return response
    else:
        if auth == "Timeout":
            return redirect(url_for("logout"))
        response = make_response(render_template("home.html"))
        response.set_cookie('token', "none")
        response.set_cookie('last_user', 'none')
        return response

@app.route("/register", methods=["POST"])
def register():
    user = request.form["roll"].lower()
    fname = request.form["fname"]
    lname = request.form['lname']
    resend = request.form.get("resend", "none")
    verify = verify_user(user, "")
    if verify == "Unregistered":
        temp_pass = random_pass(8)
        add_user(user, temp_pass, fname, lname)
        send_registration_email(user, temp_pass, user+"@iith.ac.in")  # Validating Email existence need to be added in future
        return jsonify(status = "Success")
    elif verify == "Wrong password":
        return jsonify(status = "Already")
    return jsonify(status = "FAIL")

@app.route("/change-password", methods=["POST"])
def changePassword():
    roll = request.form.get("roll", "none").lower()
    old_pass = request.form.get("oldPass", "none")
    new_pass = request.form.get("newPass", "none")
    if old_pass != "none" and new_pass != "none" and roll != "none":
        if "_$" in verify_user(roll, old_pass):
            if (float(time()) - float((get_user(roll)[0][6]))) < 1*60*60:
                update_user(roll, pword=new_pass)
                return jsonify(status = "Success")
            else:
                do_sql("DELETE FROM students WHERE username = '{}'".format(roll), True)
                return jsonify(status = "Timeout")
        else:
            return jsonify(status = "InvalidTempPass")
    return jsonify(status = "InvalidForm")


@app.route("/dashboard")
def dashboard():
    user = request.cookies.get("last_user", "none")
    token = request.cookies.get("token", "none")
    auth = authenticate(user, token)
    if auth[:2] == "_$":
        response = make_response(render_template("dashboard.html", fname = get_user(user)[0][1]))
        response.set_cookie('token', auth)
        return response
    else:
        response = make_response(redirect(url_for("login")))
        response.set_cookie('token', "none")
        response.set_cookie('last_user', 'none')
        return response

@app.route("/schedule")
def schedule():
    user = request.cookies.get("last_user", "none")
    token = request.cookies.get("token", "none")
    auth = authenticate(user, token)
    if auth[:2] == "_$":
        response = make_response(render_template("schedule.html"))
        response.set_cookie('token', auth)
        return response
    else:
        response = make_response(redirect(url_for("login")))
        response.set_cookie('token', "none")
        response.set_cookie('last_user', 'none')
        return response

@app.route("/get-day", methods=["POST"])
def get_day():
    username = request.form.get("username", "none")
    offset = request.form.get("offset", "none")
    if username != "none" and offset != "none":
        return jsonify(day = C.get_today_courses(username, offset), status = "Success")
    else:
        return jsonify(status = "Invalid")

@app.route("/add-course", methods=["POST"])
def addCourse():
    user = request.form.get("username", "none")
    course = request.form.get("course", "none")
    kind = request.form.get("type", "none")
    if course != "none" and kind != "none":

        j = jsonify(status = user_add_course(user, course, kind))
        C.load_courses(user)
        return j
    else:
        return jsonify(status = "Missing")

@app.route("/add_class")
def add_class():
    user = request.cookies.get("last_user", "none")
    token = request.cookies.get("token", "none")
    auth = authenticate(user, token)
    if auth[:2] == "_$":
        response = make_response(render_template("add_course.html"))
        response.set_cookie('token', auth)
        return response
    else:
        response = make_response(redirect(url_for("login")))
        response.set_cookie('token', "none")
        response.set_cookie('last_user', 'none')
        return response

@app.route("/search-course", methods=["POST"])
def search_course():
    key = request.form.get("query", "none")
    if key != "none":
        data = ""
        search_result = query_course(key)
        if search_result != "No Match!":
            for index, i in enumerate(search_result):
                if index >= 6:
                    break
                data += i[0]+"`"+i[1]+"|"
            return jsonify(status = "Success", result = data[:-1])
        else:
            print "Sending No Result"
            return jsonify(status = "No Result")
    else:
        return jsonify(status = "Invalid")

@app.route("/bus")
def bus():
    user = request.cookies.get("last_user", "none")
    token = request.cookies.get("token", "none")
    auth = authenticate(user, token)
    if auth[:2] == "_$":
        response = make_response(render_template("bus.html"))
        response.set_cookie('token', auth)
        return response
    else:
        response = make_response(redirect(url_for("login")))
        response.set_cookie('token', "none")
        response.set_cookie('last_user', 'none')
        return response

@app.route("/profile")
def profile():
    user = request.cookies.get("last_user", "none")
    token = request.cookies.get("token", "none")
    auth = authenticate(user, token)
    if auth[:2] == "_$":
        user = get_user(user)[0];

        response = make_response(render_template("profile.html",fname=user[1],lname=user[2],roll=user[0].upper(),department=get_department(user[0][:2])))
        response.set_cookie('token', auth)
        return response
    else:
        response = make_response(redirect(url_for("login")))
        response.set_cookie('token', "none")
        response.set_cookie('last_user', 'none')
        return response

@app.route("/get-all-courses", methods=["POST"])
def get_all_courses():
    user = request.form.get("username", "none")
    if user != "none":
        return jsonify(status="Success", data=C.get_all_course(user))
    else:
        return jsonify(status="Invalid")

@app.route("/logout")
def logout():
    uname = request.cookies.get("last_user", "none").lower()
    C.course_cache.pop(uname, None)
    authenticate(request.cookies.get("last_user", "none"), request.cookies.get("token", "none"))
    response = make_response(redirect(url_for("login")))
    response.set_cookie("last_user", 'none')
    response.set_cookie('token', 'none')
    return response

@app.route("/settings.html")
def asdfasdfasdf():
    return render_template("settings.html")

if __name__ == "__main__":
    app.run("127.0.0.1", 5000, debug=False)
