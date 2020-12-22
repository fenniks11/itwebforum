import { Injectable } from '@angular/core';

import * as fns from 'date-fns'

import 'clipboard';


@Injectable()
export class TimeVerbose {


    parseTime(ms) {

        var nameOfTheMonth = "", nameOfTheDay = "", suffix = "", AMpm = "", time = {} as any;
        switch (fns.getMonth(new Date(ms))) {
            case 0:
                nameOfTheMonth = "January"
                break;
            case 1:
                nameOfTheMonth = "February"
                break;
            case 2:
                nameOfTheMonth = "March"
                break;
            case 3:
                nameOfTheMonth = "April"
                break;
            case 4:
                nameOfTheMonth = "May"
                break;
            case 5:
                nameOfTheMonth = "June"
                break;
            case 6:
                nameOfTheMonth = "July"
                break;
            case 7:
                nameOfTheMonth = "August"
                break;
            case 8:
                nameOfTheMonth = "September"
                break;
            case 9:
                nameOfTheMonth = "October"
                break;
            case 10:
                nameOfTheMonth = "November"
                break;
            case 11:
                nameOfTheMonth = "December"
                break;
        }
        switch (fns.getDay(new Date(ms))) {
            case 0:
                nameOfTheDay = "Sunday"
                break;
            case 1:
                nameOfTheDay = "Monday"
                break;
            case 2:
                nameOfTheDay = "Tuesday"
                break;
            case 3:
                nameOfTheDay = "Wednesday"
                break;
            case 4:
                nameOfTheDay = "Thursday"
                break;
            case 5:
                nameOfTheDay = "Friday"
                break;
            case 6:
                nameOfTheDay = "Saturday"
                break;
        }

        time.millisecond = fns.getMilliseconds(new Date(ms))
        time.second = fns.getSeconds(new Date(ms));
        time.minute = fns.getMinutes(new Date(ms));
        time.hour = fns.getHours(new Date(ms));

        if (time.hour >= 12) AMpm = "PM"
        else AMpm = "AM";
        time.ampm = AMpm;

        time.day = fns.getDate(new Date(ms));
        time.weekDay = fns.getDay(new Date(ms));
        if (time.day <= 10 && time.day >= 20 && time.day % 10 == 1) suffix = 'st'
        else if (time.day <= 10 && time.day >= 20 && time.day % 10 == 2) suffix = 'nd'
        else if (time.day <= 10 && time.day >= 20 && time.day % 10 == 3) suffix = 'rd'
        else suffix = 'th'

        time.dateSuffix = suffix;
        time.week = fns.getWeekOfMonth(new Date(ms));
        time.month = fns.getMonth(new Date(ms)) + 1;
        time.year = fns.getYear(new Date(ms));
        time.monthName = nameOfTheMonth;
        time.dayName = nameOfTheDay;

        time.verbose = [
            `${time.dayName}, ${time.day}${time.dateSuffix} ${time.monthName} ${time.year}`,
            `${time.hour >= 12 ? time.hour % 12 : time.hour}.${time.minute} ${time.ampm}`,
            `${time.hour}.${time.minute}`,
            `${time.hour}.${time.minute}.${time.second}`,
            `${time.dayName}, ${time.day}${time.dateSuffix} ${time.monthName} ${time.year} at ${time.hour >= 12 ? time.hour % 12 : time.hour}.${time.minute} ${time.ampm} (${time.hour}.${time.minute}.${time.second}.${time.millisecond})`,
            `${time.day}${time.dateSuffix} ${time.monthName} ${time.year} (${time.hour >= 12 ? time.hour % 12 : time.hour}.${time.minute} ${time.ampm})`
        ]
        return time;
    }
}