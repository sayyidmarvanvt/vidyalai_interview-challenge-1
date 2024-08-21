import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import { WindowWidthContext } from '../context/WindowWidthContext';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [start, setStart] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const { isSmallerDevice } = useContext(WindowWidthContext);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const { data: newPosts } = await axios.get('/api/v1/posts', {
          params: { start, limit: isSmallerDevice ? 5 : 10 },
        });

        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setHasMorePosts(newPosts.length > 0);
        setIsLoading(false);
      };
      fetchPost();
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [start, isSmallerDevice]);

  console.log(posts);

  const handleClick = () => {
    setIsLoading(true);
    if (hasMorePosts) {
      setStart(prevStart => prevStart + 10);
    }
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </PostListContainer>

      {hasMorePosts && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        </div>
      )}
    </Container>
  );
}
