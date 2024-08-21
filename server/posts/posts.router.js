const express = require('express');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');
const { default: axios } = require('axios');

const router = express.Router();

const getImages = async id => {
  const { data: images } = await axios.get(
    `https://jsonplaceholder.typicode.com/albums/${id}/photos`,
  );
  return images.map(img => ({ url: img.url }));
};

router.get('/', async (req, res) => {
  const { start = 0, limit = 10 } = req.query;
  const posts = await fetchPosts({ start, limit });
  const postsWithImages = await Promise.all(
    posts.map(async post => {
      const images = await getImages(post.id);
      const userDetails = await fetchUserById(post.userId);

      return {
        ...post,
        images,
        user: userDetails,
      };
    }),
  );

  res.json(postsWithImages);
});

module.exports = router;
