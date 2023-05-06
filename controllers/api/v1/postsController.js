const { default: mongoose } = require("mongoose");
const Post = require("../../../models/Post");

module.exports.getPosts = async (req, res) => {
  // const [limit, skip] = [req.query.limit, req.query.page];
  // console.log(limit, skip);
  // const response = await fetch(
  // `https://dummyjson.com/posts?limit=${limit}&skip=${skip}`
  // );

  // const result = await response.json();
  const allPosts = await Post.find();
  try {
    // for (let post of result.posts) {
    //   await Post.create({
    //     title: post.title,
    //     desc: post.body,
    //     user: new mongoose.Types.ObjectId(),
    //     mediaPath:
    //       "https://images.unsplash.com/photo-1681946947943-538ea3092abc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1131&q=80",
    //     mediaType: "image",
    //   });
    // }
    // await Post.deleteMany();
  } catch (err) {
    console.log("Error in creating posts:", err);
  }

  return res.status(200).json({
    message: "List of Posts",
    success: true,
    data: allPosts,
  });
};
