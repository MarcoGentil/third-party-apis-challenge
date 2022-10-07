var currentDay = ""; 
var currentDayString = ""; 
var currentHour = 9; 
var hourEntries = []; 

const timeEntriesName = "workDaySchedulerList"; 
const firstHour = 9; 
const lastHour = 17;
const time = ["12AM","1AM","2AM","3AM","4AM","5AM","6AM","7AM","8AM","9AM","10AM","11AM","12PM",
                "1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM","10PM","11PM"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; 
const months = ["January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December"]; 
currentDayAndTime(); 
buildLayout(); 
getHourEntries();
$(".saveBtn").click(clickSaveButton);
function currentDayAndTime() {
    var today = new Date();
    var day = today.getDate(); 
    var dayEnd = "th"; 
    currentHour = today.getHours(); 
    if (day < 10) {
        currentDay = today.getFullYear() + months[today.getMonth()] + "0" + day; 
    }
    else {
        currentDay = today.getFullYear() + months[today.getMonth()] + day;
    }
    if ((day === 1) || (day === 21) || (day === 31)) {
        dayEnd = "st";
    }
    else if ((day === 2) || (day === 22)) {
        dayEnd = "nd";
    }
    else if ((day === 3) || (day === 23)) {
        dayEnd = "rd";
    }
    currentDayString = days[today.getDay()] + ", " + months[today.getMonth()] + " " + 
        day + dayEnd + ", " + today.getFullYear(); 
    $("#currentDay").text(currentDayString); 
}

function buildLayout() {
    var containerDiv = $(".container"); 

    for (let hourBlock=firstHour; hourBlock <= lastHour; hourBlock++) {
        var newHtml = '<div class="row time-block"> ' +
            '<div class="col-md-1 hour">' + time[hourBlock] + '</div> ';
        if (hourBlock < currentHour) {
            newHtml = newHtml + '<textarea class="col-md-10 description past" id="text' + 
                time[hourBlock] + '"></textarea> ';
        }
        else if (hourBlock === currentHour) {
            newHtml = newHtml + '<textarea class="col-md-10 description present" id="text' + 
                time[hourBlock] + '"></textarea> ';
        }
        else {
            newHtml = newHtml + '<textarea class="col-md-10 description future" id="text' + 
                time[hourBlock] + '"></textarea> ';
        };

      
        newHtml = newHtml + '<button class="btn saveBtn col-md-1" value="' + time[hourBlock] + '">' +
            '<i class="fas fa-save"></i></button> ' +
            '</div>';
        containerDiv.append(newHtml);
    }
}

function getHourEntries() {
    var teList = JSON.parse(localStorage.getItem(timeEntriesName));

    if (teList) {
        hourEntries = teList;
    }

    for (let i=0; i<hourEntries.length; i++) {
        if (hourEntries[i].day == currentDay) {
            $("#text"+hourEntries[i].time).val(hourEntries[i].text); 
        }
    }
}
function clickSaveButton() {
    var hourBlock = $(this).val(); 
    var entryFound = false;
    var newEntryIndex = hourEntries.length;
    var newEntry = {day: currentDay, time: hourBlock, text: $("#text"+hourBlock).val()}; 

    function timeGreater(time1,time2) {
        var number1 = parseInt(time1.substring(0, time1.length-2)); 
        var number2 = parseInt(time2.substring(0, time2.length-2)); 
        var period1 = time1.substr(-2,2); 
        var period2 = time2.substr(-2,2); 

        if (number1 === 12) {
            number1 = 0;
        }
        if (number2 === 12) {
            number2 = 0;
        }
        if (period1 < period2) {
         return false;
        }
        else if (period1 > period2) {
         return true; 
        }
        else {
         return (number1 > number2);
        }
    }
    for (let i=0; i<hourEntries.length; i++) {
        if (hourEntries[i].day == currentDay) {
            if (hourEntries[i].time == hourBlock) {
                hourEntries[i].text = newEntry.text;
                entryFound = true; 
                break;
            }
            else if (timeGreater(hourEntries[i].time, hourBlock)) {
                newEntryIndex = i;
                break;
            }
        }
        else if (hourEntries[i].day > currentDay) {
            newEntryIndex = i;
            break;
        }
    }
    if (!entryFound) {
        hourEntries.splice(newEntryIndex, 0, newEntry);
    }
    localStorage.setItem(timeEntriesName, JSON.stringify(hourEntries));
}