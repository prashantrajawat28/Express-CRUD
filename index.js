const express=require("express");
const app=express();
const port=8080;
const path =require("path");
const { v4: uuidv4} = require('uuid');
uuidv4();
const methodOverride =require("method-override");

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));

let posts=[
    {   id:uuidv4(),
        username:"wanderlust_dreamer",
        content:"Exploring the mountains taught me that the best views come after the hardest climbs. 🏞️✨ #NatureLover #MountainVibes",
    },
    {   id:uuidv4(),
        username:"foodie_lover",
        content:"The ocean is my escape — where the waves whisper secrets only my heart can hear. 🌊💙 #BeachVibes #SeaYouSoon",
    },
    {   id:uuidv4(),
        username:"artsy_mind",
        content:"Every brushstroke tells a story. 🖌️✨ What colors would you use to paint your life? #CreativeSoul #ArtLove",
    },
];





app.get("/posts",(req,res)=>{
    res.render("index.ejs",{posts});
});

app.get("/posts/new",(req,res)=>{
    res.render("new.ejs");
});

app.post("/posts",(req,res)=>{
    let {username,content}=req.body;
    let id=uuidv4();
    posts.push({id,username,content});
    res.redirect("/posts");
});

app.get("/posts/:id",(req,res) =>{
    let {id}=req.params;
    let post =posts.find((p)=>id ===p.id);
    
    res.render("show.ejs",{post});
});

app.patch("/posts/:id",(req,res)=> {
    let {id} =req.params;
    let newContent=req.body.content;
    let post =posts.find((p)=>id ===p.id);
    post.content=newContent;
    console.log(post);
    res.redirect("/posts");
});

app.get("/posts/:id/edit",(req,res) => {
    let {id}=req.params;
    let post =posts.find((p)=>id ===p.id);
    res.render("edit.ejs",{post});
});

app.delete("/posts/:id",(req,res) => {
    let {id} =req.params;
     posts=posts.filter((p) => id !== p.id);
     res.redirect("/posts");
    

});

app.listen(port,()=>{
    console.log("listening to port:8080");
});
