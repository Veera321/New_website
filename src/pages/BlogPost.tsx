import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Button,
  useTheme,
  Avatar,
  Fade,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import { useBlog } from '../context/BlogContext';

const BlogPost: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBlogById } = useBlog();

  const blog = getBlogById(id || '');

  if (!blog) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" color="error" align="center">
          Blog post not found
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/blogs')}
          >
            Back to Blogs
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Fade in timeout={500}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/blogs')}
            sx={{ mb: 2 }}
          >
            Back to Blogs
          </Button>
          <Typography variant="h3" component="h1" gutterBottom>
            {blog.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ mr: 2 }}>{blog.author[0]}</Avatar>
            <Box>
              <Typography variant="subtitle1">{blog.author}</Typography>
              <Typography variant="caption" color="text.secondary">
                Published on {new Date(blog.publishDate).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              label={blog.category}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: 'white',
              }}
            />
            {blog.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                variant="outlined"
                sx={{ borderColor: theme.palette.primary.main }}
              />
            ))}
          </Box>
        </Box>

        {/* Featured Image */}
        <Paper
          sx={{
            position: 'relative',
            backgroundColor: 'grey.800',
            color: '#fff',
            mb: 4,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url(${blog.imageUrl})`,
            height: 400,
            borderRadius: 2,
          }}
        />

        {/* Content */}
        <Box sx={{ maxWidth: 'md', mx: 'auto' }}>
          <Typography variant="subtitle1" paragraph>
            {blog.summary}
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography
            variant="body1"
            paragraph
            sx={{
              lineHeight: 1.8,
              '& p': { mb: 2 },
            }}
          >
            {blog.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </Typography>

          {/* Share Section */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 4,
              py: 2,
              borderTop: 1,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="subtitle2">Share this article:</Typography>
            <Box>
              <IconButton color="primary">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary">
                <TwitterIcon />
              </IconButton>
              <IconButton color="primary">
                <LinkedInIcon />
              </IconButton>
              <IconButton>
                <BookmarkIcon />
              </IconButton>
              <IconButton>
                <ShareIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Container>
    </Fade>
  );
};

export default BlogPost;
