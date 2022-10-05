(function () {
	"use strict";

	/* Date.prototype.deltaDays(n)
	 * 
	 * Returns a Date object n days in the future.
	 */
	Date.prototype.deltaDays = function (n) {
		// relies on the Date object to automatically wrap between months for us
		return new Date(this.getFullYear(), this.getMonth(), this.getDate() + n);
	};

	/* Date.prototype.getSunday()
	 * 
	 * Returns the Sunday nearest in the past to this date (inclusive)
	 */
	Date.prototype.getSunday = function () {
		return this.deltaDays(-1 * this.getDay());
	};
}());
function Week(initial_d) {
	"use strict";

  
	this.sunday = initial_d.getSunday();
		
	this.nextWeek = function () {
		return new Week(this.sunday.deltaDays(7));
	};
	
	this.prevWeek = function () {
		return new Week(this.sunday.deltaDays(-7));
	};
	
	this.contains = function (d) {
		return (this.sunday.valueOf() === d.getSunday().valueOf());
	};
	
	this.getDates = function () {
		let dates = [];
		for(let i=0; i<7; i++){
			dates.push(this.sunday.deltaDays(i));
		}
		return dates;
	};
}

function Month(year, month) {
	"use strict";
	
	this.year = year;
	this.month = month;
	
	this.nextMonth = function () {
		return new Month( year + Math.floor((month+1)/12), (month+1) % 12);
	};
	
	this.prevMonth = function () {
		return new Month( year + Math.floor((month-1)/12), (month+11) % 12);
	};
	this.getDateObject = function(d) {
		return new Date(this.year, this.month, d);
	};
	this.getWeeks = function () {
		let firstDay = this.getDateObject(1);
		let lastDay = this.nextMonth().getDateObject(0);
		let weeks = [];
		let currweek = new Week(firstDay);
		weeks.push(currweek);
		while(!currweek.contains(lastDay)){
			currweek = currweek.nextWeek();
			weeks.push(currweek);
		}
		
		return weeks;
	};
}
let today = new Date();
let currentMonth = new Month(2022, 2); //March 2022
let startMonth = currentMonth;
let currentDay = String(today.getDate());


//move to the next month
document.getElementById("next_month").addEventListener("click", function(event){
	currentMonth = currentMonth.nextMonth();
	updateCalendar();
}, false);

//move to the previous month
document.getElementById("previous_month").addEventListener("click", function(event){
	currentMonth = currentMonth.prevMonth();
	updateCalendar();
}, false);

//update the calendar
//print out month as word rather than number
function updateCalendar(){
  let months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  document.getElementById('month_name').innerHTML = (months[currentMonth.month]) + " of " + currentMonth.year;
	document.getElementById('day_number').innerHTML = "";
	

	let weeks = currentMonth.getWeeks();
	for(let w in weeks){
        let days = weeks[w].getDates();

		for(let d in days){
			date = days[d].getDate();
			month = currentMonth.month + 1;
			year = currentMonth.year;
			let node = document.createElement("div");
			let dateNode =  document.createElement("p");

			if(date == currentDay){
        if((currentMonth.month == startMonth.month) && (currentMonth.year == startMonth.year)){
            //dateNode.innerHTML = "(today) " + date;
        }
        else{
         dateNode.innerHTML = date;
      }
      }
      else{
         dateNode.innerHTML = date;
      }
			node.appendChild(dateNode);
			node.classList.add('day');

			if(w == 0 && date > 7){
				month = month - 1;
			} else if(w >= 4 && date <= 6){
				month += 1;
				if(month > 12){
					month = 1;
					year += 1;
				}
			}

			if(date < 10){
				date = "0" + date
			}

			if(month < 10){
				month = "0" + month
			}

			if(month == 0){
				month = 12;
				year -= 1;
			}
			node.id = year + "-" + month + "-" + date;
			ajax_get_event(month, date, year)
			.then (response => {
				for(let i in response){
					let tempNode = document.createElement("p");
					timeModifier = "AM";

					time = response[i].time.split(":");
					title = response[i].title;
					eventId = response[i].id;
          priority = response[i].priority;

					// Adjust standard time modifier
					if(time[0] >= 12){
						timeModifier = "PM"
					}

					// Format to standard time/trim leading 0
					if(time[0] > 12){
						time[0] -= 12;
					} else if (time[0] < 10){
						time[0] =  time[0].substring(1)
					}
					time = time[0] + ":" + time[1] + timeModifier;
  
          //choose color for priority
          let color = "black";
          if (priority == "high"){
            color = "red";
          }
          else if (priority == "low"){
            color = "green";
          }
          
          //outputs the time and title of the event with the color associated with its priority
					tempNode.innerHTML = "<div style='color: " + color + ";'>" + time + " " + title + "</div>";
					tempNode.classList.add("event");
					tempNode.id = eventId
					if(loggedIn){
						tempNode.appendChild(create_edit_button(tempNode.id, eventId));
						tempNode.appendChild(create_delete_button(tempNode.id, eventId));
            tempNode.appendChild(create_share_button(tempNode.id, eventId));
					}
					document.getElementById(response[i].date).appendChild(tempNode);
				}
			});
			
			document.getElementById("day_number").appendChild(node);
		}
	}
}

function create_edit_button(input_node, input_event){
	let edit_button = document.createElement("BUTTON");
	edit_button.innerHTML = "Edit";
	edit_button.id = "edit_" + input_node;
	edit_button.addEventListener("click", edit_event, false)
	edit_button.eventId = input_event;
	return edit_button;
}

function create_delete_button(input_node, input_event){
	let delete_button = document.createElement("BUTTON");
	delete_button.innerHTML = "Delete";
	delete_button.id = "delete_" + input_node;
	delete_button.addEventListener("click", delete_event, false)
	delete_button.eventId = input_event;
	return delete_button;
}

function create_share_button(input_node, input_event){
	let share_button = document.createElement("BUTTON");
	share_button.innerHTML = "Send";
	share_button.id = "share_" + input_node;
	share_button.addEventListener("click", share_event, false)
	share_button.eventId = input_event;
	return share_button;
}

// begin the function
let month_name = document.createElement("H1");
month_name.id = "month_name";
document.getElementById('month_header').appendChild(month_name);
updateCalendar();