const express = require("express")
const mysql = require("mysql2")
const bodyParser = require("body-parser")




var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Gopi@6003',
    database : 'nodemysql'
  });

 db.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("mysql connected....");
    }
 })

 //create db

//  let sql ='CREATE DATABASE nodemysql'
//     db.query(sql,(err,result)=>{
//         if(err){
//             console.log(err);
//         }else{
//             console.log(result);
//             res.send("DATABASE Created ...")
//         }
//     })

 //create table

// let sql = "CREATE TABLE student ( ID int NOT NULL AUTO_INCREMENT,firstName varchar(255),lastName varchar(255),email varchar(255),password varchar(255), PRIMARY KEY (ID));"
// db.query(sql,(err,result)=>{
//     if(err){
//         console.log(err);
//     }else{
//         console.log("table created"+result);

//     }
// })


const app = express()

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}))

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);



app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})


// student signup page


app.get("/studentsignup",(req,res)=>{
    res.sendFile(__dirname+"/studentsignup.html")
})


app.post("/studentsignup",(req,res)=>{
    let sql = "INSERT INTO student (firstName,lastName,email,password) VALUES (?)"
    let values = [
       req.body.Fname,
       req.body.Lname,
       req.body.email,
       req.body.password
    ]
    db.query(sql,[values],(err,result)=>{
        if(err)
            console.log(err);
        else{
            res.redirect("/studentlogin")
            console.log(result);
            console.log("inserted values");
        }
    })
})




// student login page


app.get("/studentlogin",(req,res)=>{
    res.sendFile(__dirname+"/studentlogin.html")
})


app.post("/studentlogin",(req,res)=>{
    let email = req.body.email
    let password = req.body.password

    let sql = "SELECT password FROM student WHERE email =?"
    value = email

    db.query(sql,[value],(err,result)=>{
        if(err)
            console.log(err);
        else{
            if(password==result[0].password){
                res.redirect("/home")
            }else{
                res.send("Wrong password")
            }
            
        }
    })
})


//createvenue


app.get("/createvenue",(req,res)=>{
    var teachers = []

    const sql = "SELECT firstName FROM teacher"
    db.query(sql,(err,result)=>{
        if(err)
            console.log(err);
        else{
            for(var i=0;i<result.length;i++)
                teachers.push(result[i].firstName)
                console.log(teachers);
                res.render("createvenue.html",{teachers:teachers})
        }    
    })


})

app.post("/createvenue",(req,res)=>{
    let venueName = req.body.name
    let teacherId = req.body.Tid

    let sql = "INSERT INTO venue (Name,teacherId) VALUES (?)"
    let values = [
        venueName,
        teacherId
    ]

    db.query(sql,[values],(err,result)=>{
        if(err)
            console.log(err);
        else{
            console.log(result);
            console.log("created new venue");
            res.redirect("/home")
        }    
    })
})


//teacher signup



app.get("/teachersignup",(req,res)=>{
    res.sendFile(__dirname+"/teachersignup.html")
})


app.post("/teachersignup",(req,res)=>{
    let sql = "INSERT INTO teacher (firstName,lastName,email,password) VALUES (?)"
    let values = [
       req.body.Fname,
       req.body.Lname,
       req.body.email,
       req.body.password
    ]
    db.query(sql,[values],(err,result)=>{
        if(err)
            console.log(err);
        else{
            res.redirect("/teacherlogin")
            console.log(result);
            console.log("inserted values");
        }
    })
})


// teacher login page


app.get("/teacherlogin",(req,res)=>{
    res.sendFile(__dirname+"/teacherlogin.html")
})


app.post("/teacherlogin",(req,res)=>{
    let email = req.body.email
    let password = req.body.password

    let sql = "SELECT password FROM teacher WHERE email =?"
    value = email

    db.query(sql,[value],(err,result)=>{
        if(err)
            console.log(err);
        else{
            if(password==result[0].password){
                res.redirect("/home")
            }else{
                res.send("Wrong password")
            }
            
        }
    })
})

//homepage


app.get("/home",(req,res)=>{
    var venues = []

    const sql = "SELECT Name FROM venue"
    db.query(sql,(err,result)=>{
        if(err)
            console.log(err);
        else{
            for(var i=0;i<result.length;i++)
                venues.push(result[i].Name)
                res.render("homepage.html",{venues:venues})
        }    
    })

    
})

app.post("/home",(req,res)=>{
    var dates = []
    var prgs = []
    const sql = "SELECT day FROM jan WHERE vId = '1'"
    db.query(sql,(err,result)=>{

        if(err)
            console.log(err);
        else{
            for(var i=0;i<result.length;i++)
                dates.push(result[i].day)

            
        }    
    })

    const sql2 = "SELECT program FROM jan WHERE vId ='1'"
    db.query(sql2,(err,result)=>{

        if(err)
            console.log(err);
        else{
            for(var i=0;i<result.length;i++)
                prgs.push(result[i].program)
                res.render("calender.html",{venue:req.body.venue,dates:dates,prgs:prgs})
        }    
    })
    
    
})


//bookings


app.post("/booking",(req,res)=>{

    const dates = req.body.dates[0]
    const prgName = req.body.prgName
    var dateArr = dates.split(',');
    console.log(dateArr);

    for(var i=0;i<dateArr.length;i++){
        const sql = "UPDATE jan SET vId = ?,program = "+db.escape(prgName)+" WHERE day = "+db.escape(dateArr[i])
        let values = [
            "1"
        ]
        db.query(sql,[values],(err,result)=>{
            if(err)
                console.log(err);
            else
               console.log(result);
        })
    }
    res.redirect("/home")

})




app.listen(3000,()=>{
    console.log("server running at port 3000");
})
