const express = require("express");
const path = require("path");
const app = express();
const port = 8080;
const { v4: uuidv4 } = require('uuid');
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

let posts = [
  {
    id: uuidv4(),
    username: "manishtiwari",
    content: "I Love Coding",
  },
  {
    id: uuidv4(),
    username: "manishkumar",
    content: "Hard work in coding work this side",
  },
  {
    id: uuidv4(),
    username: "mahitiwari",
    content: "I go select for this side",
  },
];

app.get("/post", (req, res) => {
  res.render("index.ejs", { posts });
});

app.get("/post/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/post", (req, res) => {
  let { username, content } = req.body;
  let id = uuidv4();
  posts.push({ id, username, content });
  res.redirect("/post");
});

app.get("/post/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find(p => p.id === id);
  res.render("show.ejs", { post }); 
});

app.delete("/post/:id", (req, res) => {
  let { id } = req.params;
  let postIndex = posts.findIndex(p => p.id === id);
  if (postIndex !== -1) {
    posts.splice(postIndex, 1);
    res.redirect("/post");
  } else {
    res.status(404).send("Post not found");
  }
});


app.get("/post/:id/edit", (req, res) => {
  let { id } = req.params;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(id)) { 
    return res.status(400).send("Invalid post ID");
  }
  
  let post = posts.find(p => p.id === id);
  if (post) {
    res.render("edit.ejs", { post }); 
  } else {
    res.status(404).send("Post not found");
  }
});



app.patch("/post/:id", (req, res) => {
  let { id } = req.params;
  let { content } = req.body;
  let postIndex = posts.findIndex(p => p.id === id);
  if (postIndex !== -1) {
    posts[postIndex].content = content;
    res.redirect(`/post/${id}`);
  } else {
    res.status(404).send("Post not found");
  }
});

app.listen(port, () => {
  console.log("Listening on port: 8080");
});
