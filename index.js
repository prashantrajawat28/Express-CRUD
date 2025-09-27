// File: index.js

const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

// Render dynamic port
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// In-memory posts array
let posts = [
  {
    id: uuidv4(),
    username: "wanderlust_dreamer",
    content:
      "Exploring the mountains taught me that the best views come after the hardest climbs. 🏞️✨ #NatureLover #MountainVibes",
    likes: 0,
    comments: [],
  },
  {
    id: uuidv4(),
    username: "foodie_lover",
    content:
      "The ocean is my escape — where the waves whisper secrets only my heart can hear. 🌊💙 #BeachVibes #SeaYouSoon",
    likes: 0,
    comments: [],
  },
  {
    id: uuidv4(),
    username: "artsy_mind",
    content:
      "Every brushstroke tells a story. 🖌️✨ What colors would you use to paint your life? #CreativeSoul #ArtLove",
    likes: 0,
    comments: [],
  },
];

// Routes

app.get("/", (req, res) => {
  res.redirect("/posts");
});

app.get("/posts", (req, res) => {
  res.render("index", { posts });
});

app.get("/posts/new", (req, res) => {
  res.render("new");
});

app.post("/posts", (req, res) => {
  const { username, content } = req.body;
  if (!username || !content) {
    return res.status(400).send("Username and content are required");
  }
  const id = uuidv4();
  posts.push({ id, username, content, likes: 0, comments: [] });
  res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).send("Post not found");
  res.render("show", { post });
});

app.get("/posts/:id/edit", (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).send("Post not found");
  res.render("edit", { post });
});

app.patch("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).send("Post not found");
  const { content } = req.body;
  if (!content) return res.status(400).send("Content cannot be empty");
  post.content = content;
  res.redirect("/posts");
});

app.delete("/posts/:id", (req, res) => {
  const postExists = posts.some((p) => p.id === req.params.id);
  if (!postExists) return res.status(404).send("Post not found");
  posts = posts.filter((p) => p.id !== req.params.id);
  res.redirect("/posts");
});

app.post("/posts/:id/like", (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).send("Post not found");
  post.likes += 1;
  res.redirect(`/posts/${req.params.id}`);
});

app.post("/posts/:id/comments", (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).send("Post not found");
  const { comment } = req.body;
  if (!comment) return res.status(400).send("Comment cannot be empty");
  post.comments.push(comment);
  res.redirect(`/posts/${req.params.id}`);
});

// Error logging middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
