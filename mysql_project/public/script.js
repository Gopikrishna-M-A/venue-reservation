
const days = document.querySelectorAll(".daynum")
var bookedDates = [];
updatecal()
for (var i = 0; i < days.length; i++) {
    days[i].addEventListener("click",(e)=>{
        const day = e.target
        console.log(day);
         if(day.classList.contains('avail')){
                day.classList.add("selected")   
                day.classList.toggle("booked")   

         }
         if(day.classList.contains("booked")){
            bookedDates.push(day.id)
            document.getElementById("datesinp").value = bookedDates
            console.log(bookedDates);}
    });
  }

    function updatecal() { 
        const dateobj = document.getElementById("days").getAttribute("data-date-obj")
        const prgobj = document.getElementById("days").getAttribute("data-prog-obj")
        const datearr = dateobj.split(",")
        const progarr = prgobj.split(",")
        
        if(datearr[0]!= ""){
            for(var i=0;i<datearr.length;i++){
                const date = document.getElementById(datearr[i])
                date.childNodes[1].innerHTML = progarr[i]
                date.classList.remove("avail")
                date.classList.add("navail")
                date.disabled = true;
                console.log(date);
            }
        }
      
    };