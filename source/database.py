__author__ = 'dhtik_000'

from passlib.hash import pbkdf2_sha256 as hasher
import sqlite3 as sql
from platform import system
from random import choice
from time import time
import smtplib

pass_path = "C:\Users\dhtik_000\Desktop\pass.encrypted" if (system().lower() =="windows") else "/var/www/iith_info/pass.encrypted"
pass_file = file(pass_path, "r")
password = pass_file.readline()

# email registration stuff
def send_registration_email(Uname,Pword,email):
    user = get_user(Uname)[0]
    session = smtplib.SMTP('smtp.gmail.com', 587)
    session.ehlo()
    session.starttls()
    session.login("iithyderabad.info@gmail.com", password)
    headers = "\r\n".join(["from: " + "iithyderabad.info@gmail.com",
                       "subject: " + "You've Registered for IITH.INFO",
                       "to: " + email,
                       "mime-version: 1.0",
                       "content-type: text/html"])
    body = '''Hi {} {},<br>
                    Welcome to iith.info, here is your temporary password: {}'''.format(user[1], user[2], Pword)
    content = headers + "\r\n\r\n" + body
    session.sendmail("iithyderabad.info@gmail.com", email, content)
    session.quit()

def send_email(body):
    session = smtplib.SMTP('smtp.gmail.com', 587)
    session.ehlo()
    session.starttls()
    session.login("iithyderabad.info@gmail.com", "IDPgroup18")
    headers = "\r\n".join(["from: " + "iithyderabad.info@gmail.com",
                       "subject: " + "Server encounterd unexpected situation",
                       "to: " + "iithyderabad.info@gmail.com",
                       "mime-version: 1.0",
                       "content-type: text/html"])
    body = body
    content = headers + "\r\n\r\n" + body
    session.sendmail("iithyderabad.info@gmail.com", "iithyderabad.info@gmail.com", content)
    session.quit()


#Sqlite database related functions
db_path = "" if (system().lower() =="windows") else "/var/www/iith_info/iith_info/"
database = sql.connect(db_path + "MainDatabase.db", check_same_thread=False)
db = database.cursor()

def random_pass(length, token=False):
    temp_pass = "_$"
    for i in range(length-2):
        if token:
            temp_pass += choice("abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()")
        else:
            temp_pass += choice("abcdefghijklmnopqrstuvwxyz1234567890")
    return temp_pass

def do_sql(code, write = False):
    db.execute(code)
    if write:
        database.commit()

do_sql("CREATE TABLE IF NOT EXISTS students (username TEXT, first_name TEXT, last_name TEXT, password_hash TEXT, token TEXT,last_seen TEXT, registered TEXT, extra_courses TEXT)", True)

# verify Student roll number:
def verify_rollnumber(roll):
    if len(roll) == 14 and roll[:2].upper() in ["CS", "ME", "MS", "EE", "CH", "CE", "ES", "EP"]:
        if roll[2:4] == "15":
            if roll[4:9].lower() == "btech":
                if roll[9:12] == "110":
                    return True
                else:
                    return "INVALID"
            else:
                return "NOTBTECH"
        else:
            return "NOT15"
    else:
        return "INVALID"

def add_user(uname, pword, fname, lname):
    token = random_pass(20, True)
    do_sql("INSERT INTO students VALUES ('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}')".format(uname.lower(), fname, lname, hasher.encrypt(pword, rounds=100000), token, str(time()), str(time()), ""), True)
    return token

def get_user(uname):
    do_sql("SELECT * FROM students WHERE username = '{}'".format(uname.lower()))
    return db.fetchall()

def update_user(uname, pword=None, fname=None, lname=None):
    info = get_user(uname.lower())[0]
    if pword == None:
        hash = info[3]
    else:
        hash = hasher.encrypt(pword, rounds=100000)
    if fname == None:
        fname = info[1]
    if lname == None:
        lname = info[2]
    token = random_pass(20, True)
    do_sql("UPDATE students SET first_name = '{}', last_name = '{}', password_hash = '{}', token = '{}',last_seen = '{}' WHERE username = '{}'".format(fname, lname, hash, token, str(time()), uname.lower()), True)
    return token

def user_add_course(uname, code, type):   #type is string that is either "f" or "l" standing for free elective and LA course
    uname = uname.lower()
    do_sql("SELECT extra_courses FROM students WHERE username = '{}'".format(uname))
    extras = db.fetchone()[0]
    do_sql("SELECT id FROM {}".format(uname[0:2].upper() + "_2_Courses"))
    required = db.fetchone()[0]
    if code not in extras and code not in required:
        new_code = get_user(uname)[0][-1]
        new_code += ";"+code.upper()
        new_code = new_code[1:] if new_code[0]==";" else new_code
        do_sql("UPDATE students SET extra_courses = '{}' WHERE username = '{}'".format(new_code, uname.lower()), True)

        return "Success"
    else:
        return "Already"


def verify_user(uname, pword):
    uname = uname.lower()
    if verify_rollnumber(uname) == True:
        user = get_user(uname)
        if len(user) == 1:
            if hasher.verify(pword, user[0][3]):
                return update_user(uname)
            else:
                return "Wrong password"
        else:
            if len(user) > 0:
                send_email("Database contains multiple accounts for {}".format(uname))
                return "oops"
            else:
                return "Unregistered"
    else:
        return "Invalid roll number"

def authenticate(uname, token):
    uname = uname.lower()
    if verify_rollnumber(uname) == True:
        user = get_user(uname)
        if len(user) == 1:
            if user[0][4] == token:
                if float(user[0][5]) - time() < 60.0*60*24*7:  #week in seconds
                    return update_user(uname)
                else:
                    return "Timeout"
            else:
                return "Wrong password"
        else:
            if len(user) > 1:
                send_email("Database contains multiple accounts for {}".format(uname))
                return "oops"
            else:
                return "Unregistered"
    else:
        return "Invalid roll number"


def query_course(key = ""):
    key = "%{}%".format(key)
    do_sql("SELECT id FROM FE_2_Courses WHERE id LIKE '{}' ORDER BY id ASC".format(key))
    a = db.fetchall()
    do_sql("SELECT code,name FROM Courses WHERE name LIKE '{}' ORDER BY code ASC".format(key))
    b = db.fetchall()
    print len(a), len(b)
    if (len(a)+len(b) != 0):
        for index, i in enumerate(a[:]):
            do_sql("SELECT name FROM Courses WHERE code = '{}'".format(i[0]))
            a[index] = (a[index][0], db.fetchone()[0])
        index = 0
        for j in b[:]:
            do_sql("SELECT id FROM FE_2_Courses WHERE id = '{}'".format(j[0]))
            c = db.fetchone()
            if c == None:
                b.pop(index)
                index -= 1
            index += 1
        return a+b
    print "No Match :("
    return "No Match!"

def get_department(initial):
    initial = initial.lower() #"CS", "ME", "MS", "EE", "CH", "CE", "ES", "EP"
    if initial == "cs":
        return "Computer Science and Engineering"
    if initial == "me":
        return "Mechanical and Aerospace Engineering"
    if initial == "ms":
        return "Material Science and Metallurgy"
    if initial == "ee":
        return "Electrical Engineering"
    if initial == "ch":
        return "Chemical Engineering"
    if initial == "ce":
        return "Civil Engineering"
    if initial == "es":
        return "Engineering Science"
    if initial == "ep":
        return "Engineering Physics"