import datetime, calendar, database
import operator

course_cache = {}           # Used to store the user data until he logs out
segment = "3"

def clean_up_whitespace(s):

    while s != "" and s[0].isspace():
        s = s[1:]
    while s != "" and s[-1].isspace():
        s = s[:-1]
    return s


def get_day(date, offset):
    date = date.split(".")
    date[2] = "20" + date[2]
    date = datetime.date(int(date[2]), int(date[1]), int(date[0]))
    return calendar.day_name[(int(date.weekday()) + int(offset))%7].lower()


def get_date():
    today = datetime.date.today().timetuple()
    return str(today[2]) + "." + str(today[1]) + "." + str(today[0]%100)

def set_segment(seg):
    global segment
    segment = seg

def period_type_info(i):
    if i == 1:
        return ["9:00", "9:55"]
    elif i == 2:
        return ["10:00", "10:55"]
    elif i == 3:
        return ["11:00", "11:55"]
    elif i == 4:
        return ["12:00", "12:55"]
    elif i == 5:
        return ["14:30", "15:55*"]
    elif i == 6:
        return ["16:00", "17:25*"]
    elif i == 7:
        return ["17:30", "19:00*"]
    elif i == 8:
        return ["19:00", "20:30*"]
    elif isinstance(i, type([])):  # In the case that the course has special slots like saturday or holiday slot, the period_type must be a list
        return i
    else:
        return None


class Period():
    def __init__(self, day, period_type, date=""):
        # 1 hr periods [start time 'HH:MM', end time 'HH:MM']
        # 1.5 hr periods [start time 'HH:MM', end time 'HH:MM*']
        # period_type for a course that has a period that isn't an ordinary period must be a list of the form:
        # [start time 'HH:MM', end time 'HH:MM~', duration x.y hours]

        self.day = day
        self.period_type_data = period_type_info(period_type)
        self.frequency = "one time" if (date != "") else "regular"
        self.date = date                                                # Format of date must be "dd.mm.yy"

    def get_hour_start(self, pure=False):
        return self.period_type_data[0] if not pure else self.period_type_data[0].replace(":", "")

    def get_hour_end(self):
        return self.period_type_data[1].replace("*", "").replace("~", "")

    def get_length(self):
        return 1.5 if (self.period_type_data[1][-1] == "*") else self.period_type_data[2] if (
            self.period_type_data[1][-1] == "~") else 1

    def get_date(self):
        return self.date if (self.frequency == "one time") else "regular"

slot = {
    "A": [Period("monday", 1), Period("wednesday", 3), Period("thursday", 2)],
    "B": [Period("monday", 2), Period("wednesday", 1), Period("thursday", 3)],
    "C": [Period("monday", 3), Period("wednesday", 2), Period("thursday", 1)],
    "D": [Period("monday", 4), Period("tuesday", 1), Period("friday", 3)],
    "E": [Period("tuesday", 2), Period("thursday", 4), Period("friday", 1)],
    "F": [Period("tuesday", 3), Period("wednesday", ["14:30", "15:25~", 1]), Period("friday", 2)],
    "G": [Period("tuesday", 4), Period("wednesday", 4), Period("friday", 4)],
    "P": [Period("monday", 5), Period("thursday", 6)],
    "Q": [Period("monday", 6), Period("thursday", 5)],
    "R": [Period("tuesday", 5), Period("friday", 6)],
    "S": [Period("tuesday", 6), Period("friday", 5)],
    "W": [Period("monday", 7), Period("thursday", 7)],
    "X": [Period("monday", 8), Period("thursday", 8)],
    "Y": [Period("tuesday", 7), Period("friday", 7)],
    "Z": [Period("tuesday", 7), Period("friday", 8)],
    "FN1": [Period("monday", ["9:00", "11:55~", 3])],
    "FN2": [Period("tuesday", ["9:00", "11:55~", 3])],
    "FN3": [Period("wednesday", ["9:00", "11:55~", 3])],
    "FN4": [Period("thursday", ["9:00", "11:55~", 3])],
    "FN5": [Period("friday", ["9:00", "11:55~", 3])],
    "AN1": [Period("monday", ["14:30", "17:25~", 3])],
    "AN2": [Period("tuesday", ["14:30", "17:25~", 3])],
    "CHL": [Period("wednesday", ["15:30", "17:25~", 2])],
    "AN4": [Period("thursday", ["14:30", "17:25~", 3])],
    "AN5": [Period("friday", ["14:30", "17:25~", 3])]
}


class Course:
    def __init__(self, course_id, semester, segment, reg_periods, room):
        self.id = course_id
        self.sem = semester
        self.seg = segment
        self.reg_periods = reg_periods
        self.extra_periods = []
        self.room = room

    def add_period(self, date, time):
        self.extra_periods.append(Period(get_day(date), time, date))


def load_courses(uname):
    i = []
    uname = uname.lower()
    course_cache.pop(uname, "")
    database_name = uname[:2].upper() + "_2_Courses"
    database.do_sql("SELECT * FROM {}".format(database_name))
    courses = database.db.fetchall()
    if not uname in course_cache:
        course_cache[uname] = []
    for course in courses:
        if course[2][0] == '[':
            exec("i = " + course[2])
        else:
            i = slot[course[2]]
        course = course[:2] + (i, ) + course[3:]
        course_cache[uname].append(Course(course[0], 2, course[1], course[2], course[3]))
    database.do_sql("SELECT extra_courses FROM students WHERE username = '{}'".format(uname))
    courses = database.db.fetchone()[0].split(";")
    if len(courses) > 0 and courses[0] != "":
        for course in courses:
            database_name = course[:2].upper() + "_2_Courses"
            database.do_sql("SELECT * FROM {} WHERE id = '{}'".format(database_name, course))
            temp = database.db.fetchone()
            if not temp[2][0] == "[":
                temp = temp[:2] + (slot[temp[2]], ) + temp[3:]
            else:
                exec("i = " + temp[2])
                temp = temp[:2] + (i, ) + temp[3:]
            course_cache[uname].append(Course(temp[0], 2, temp[1], temp[2], temp[3]))

def get_today_courses(uname, offset):       # courses seperated by | and data seperated by `
                                            # as code`start_hour`end_hour`course_name`course_length`Room`Credits`Former`Pre-req`desc|
                                            # calendar.day_name(datetime.date.today().weekday()).lower()
    uname = uname.lower()
    data = ""
    temp_courses = []
    for course in course_cache[uname]:
        for period in course.reg_periods:
            if period.day == get_day(get_date(), offset) and segment in course.seg:
                temp_courses.append([course.id, int(period.get_hour_start(True)), course])
        for period in course.extra_periods:
            if period.date == get_date():
                temp_courses.append([course.id, int(period.get_hour_start(True)), course])

    temp_courses.sort(key = operator.itemgetter(1))
    for junk1, junk2, course in temp_courses:
        database.do_sql("SELECT * FROM Courses WHERE code = '{}'".format(course.id))
        extra_info = database.db.fetchone() # row in the form : Code, Former, Name, Pre-req, credits, desc
        for period in course.reg_periods:
            if period.day == get_day(get_date(), offset) and segment in course.seg:
                data += course.id + "`" + period.get_hour_start() + "`" + period.get_hour_end() + "`" + extra_info[2] + "`" + str(period.get_length()) + "`" + course.room + "`" + extra_info[4] + "`" + extra_info[1] + "`" + extra_info[3] + "`" + extra_info[5] + "`" + course.seg + "|"
        for period in course.extra_periods:
            if period.date == get_date():
                data += course.id + "`" + period.get_hour_start() + "`" + period.get_hour_end() + "`" + extra_info[2] + "`" + str(period.get_length()) + "`" + course.room + "`" + extra_info[4] + "`" + extra_info[1] + "`" + extra_info[3] + "`" + extra_info[5] + "`" + course.seg + "|"
    return data[:-1] #[:-1] to remove trailing |


def get_all_course(uname):
    uname = uname.lower()
    data = ""
    for course in course_cache[uname]:
        database.do_sql("SELECT name FROM Courses WHERE code = '{}'".format(course.id))
        name = database.db.fetchone()[0]
        data += course.id+'`'+name+'|'
    return data[:-1]

