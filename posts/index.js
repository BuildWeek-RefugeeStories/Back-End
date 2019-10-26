const express = require("express");

const router = express.Router();

const protected = require("../auth/protected");

const Post = require("../models/Post");
const User = require("../models/User");

router.get("/", (req, res) => {
  Post.find((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: err });
    }

    const stories = docs.filter(doc => doc.approved);

    const sortBy = req.query.sort ? req.query.sort : 'date';
    const limit = req.query.limit ? req.query.limit : 25;
    const page = req.query.page ? req.query.page : 0;

    if(page * limit > stories.length) {
      page = Math.floor(stories.length / limit);
    } else if (page < 0) page = 0;

    switch (sortBy) {
      case "likes": {
        stories.sort((a, b) => b.likes - a.likes);
      }
      default: {
        // By default, we sort by date created
        stories.sort((a, b) => b.createdAt - a.createdAt);
      }
    }

    const end = (page * limit) + limit;

    if(end > stories.length) {
      end = stories.length;
    }

    stories.slice(page * limit, end);

    return res.status(200).json(stories);
  });
});

router.get('/awaiting', protected, (req, res) => {
  if(req.headers.decodedToken.level === 'admin' || req.headers.decodedToken.level === 'owner') {
    Post.find((err, docs) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: err });
      }
  
      const stories = docs.filter(doc => !doc.approved);
  
      const sortBy = req.query.sort ? req.query.sort : 'date';
      const limit = req.query.limit ? req.query.limit : 25;
      const page = req.query.page ? req.query.page : 0;

      if(page * limit > stories.length) {
        page = Math.floor(stories.length / limit);
      } else if (page < 0) page = 0;
  
      switch (sortBy) {
        case "likes": {
          stories.sort((a, b) => b.likes - a.likes);
        }
        default: {
          // By default, we sort by date created
          stories.sort((a, b) => b.createdAt - a.createdAt);
        }
      }
  
      const end = (page * limit) + limit;

      if(end > stories.length) {
        end = stories.length;
      }

      stories.slice(page * limit, end);
  
      return res.status(200).json(stories);
    });
  } else {
    return res.status(401).json({message: "You are not authorized to view unapproved posts."});
  }
})

router.post("/like/:id", protected, (req, res) => {
  // Check for headers
  // Check if post exists
  Post.findById(req.params.id, (err, doc) => {
    if (err || !doc) {
      return res.status(404).json({
        message: "Post not found, please make sure the provided id is valid."
      });
    } else {
      // Check if post is already liked
      const user = req.headers.user;

      const index = user.likedPosts.findIndex(post => post == doc._id);

      if (index !== -1) {
        // Unlike
        user.likedPosts.splice(index, 1);

        user.save((err, doc) => {
          if (err) {
            return res.status(500).json({
              message:
                "An error occured when unliking this post. Please try again later."
            });
          }
        });

        doc.likes != 0 ? (doc.likes -= 1) : null;

        doc.save((err, doc) => {
          if (err) {
            return res.status(500).json({
              message:
                "An error occured when unliking this post. Please try again later."
            });
          }
        });
      } else {
        // Like
        user.likedPosts.push(doc._id);

        user.save((err, doc) => {
          if (err) {
            return res.status(500).json({
              message:
                "An error occured when unliking this post. Please try again later."
            });
          }
        });

        doc.likes += 1;

        doc.save((err, doc) => {
          if (err) {
            return res.status(500).json({
              message:
                "An error occured when unliking this post. Please try again later."
            });
          }
        });
      }
      // Return array of liked posts

      return res.status(200).json(user.likedPosts);
    }
  });
});

router.delete("/:id", protected, (req, res) => {
  // Check for headers
  // Check if post exists
  Post.findById(req.params.id, (err, post) => {
    if (err || !post) {
      err && console.log(err);
      return res
        .status(500)
        .json({ message: "Unable to find post. Make sure post ID is validd" });
    } else {
      // Check if posts belongs to user
      console.log(post.author.id);
      console.log(req.headers.user._id);
      if (post.author.id !== req.headers.decodedToken.id) {
        return res
          .status(401)
          .json({ message: "You may not delete posts posted by others." });
      } else {
        const index = req.headers.user.posts.findIndex(post => {
          return post === req.params.id;
        });

        console.log(index);

        // Remove post from user profile
        if (index !== -1) {
          req.headers.user.posts.splice(index, 1);
          req.headers.user.save(err => {
            if (err) {
              console.log(err);
              return res
                .status(500)
                .json({
                  message:
                    "An error occured while attempting to delete this post. Please try again later."
                });
            }
          });
        }
        // Delete post
        Post.deleteOne({ _id: req.params.id }, err => {
          if (err) {
            return res.status(500).json({
              message:
                "An error occured when attempting to delete this post. Please try again later."
            });
          } else {
            // Return array of created posts
            return res.status(200).json(req.headers.user.posts);
          }
        });
      }
    }
  });
});

router.get("/mine", protected, (req, res) => {
  // Check for headers
  // Return array of posts that belong to user
  return res.status(200).json(req.headers.user.posts);
});

router.get("/liked", protected, (req, res) => {
  // Check for headers
  // Return array of liked posts

  return res.status(200).json(req.headers.user.likedPosts);
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id, (err, doc) => {
    if (err) {
      return res.status(400).json({
        message: "Failed to retrieve post. Make sure provided ID is valid"
      });
    } else {
      if (!doc) {
        return res.status(404).json({ message: "No post found with that id" });
      }
      return res.status(200).json(doc);
    }
  });
});

router.post("/new", protected, (req, res) => {
  const user = req.headers.user;

  if (
    req.body &&
    req.body.title &&
    req.body.title.trim() &&
    req.body.body &&
    req.body.body.trim()
  ) {
    const anon = req.body.anonymous;

    // Create the post
    const post = new Post({
      author: {
        id: user._id,
        name: anon ? "Anonymous Author" : `${user.firstName} ${user.lastName}`,
        country: anon ? "" : user.country
      },
      title: req.body.title,
      body: req.body.body,
      approved: req.body.approved
    });

    user.posts.push(post._id);

    user.save((err, doc) => {
      if (err) {
        return res.status(500).json({ message: err });
      }
    });

    post.save((err, doc) => {
      if (err) {
        return res.status(500).json({ message: err });
      }

      return res.status(201).json(doc);
    });
  } else {
    return res.status(400).json({
      message:
        "Please make sure to include a title and body. Posting as anonymous is optional."
    });
  }
});

router.post('/approve/:id', protected, (req, res) => {
  Post.findById(req.params.id, (err, doc) => {
    if(err || !doc) {
      return res.status(404).json({message: "Unable to find post. Make sure ID is accurate"});
    } else {
      doc.approved = true;

      doc.save((err, doc) => {
        if(!err) {
          return res.status(200).json(doc);
        } else {
          return res.status(500).json({message: "An error occured while trying to approve this post. Please try again later."})
        }
      })
    }
  })
});

module.exports = router;
