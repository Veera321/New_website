import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  InputAdornment,
  TextField,
  useTheme,
  Tab,
  Tabs,
  Paper,
  Button,
  IconButton,
  Grow,
} from '@mui/material';
import {
  Search as SearchIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useBlog } from '../context/BlogContext';

const Blogs: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { blogs } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredBlogs, setFilteredBlogs] = useState(blogs.filter(blog => blog.status === 'published'));
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

  const categories = ['all', 'Health Tips', 'Medical News', 'Wellness Articles', 'Diet & Nutrition'];
  const publishedBlogs = blogs.filter(blog => blog.status === 'published');

  useEffect(() => {
    const filtered = blogs
      .filter(blog => blog.status === 'published')
      .filter(blog => {
        const matchesSearch = 
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
      });
    
    setFilteredBlogs(filtered);
  }, [searchTerm, selectedCategory, blogs]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeaturedIndex((prevIndex) => 
        prevIndex === publishedBlogs.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [publishedBlogs.length]);

  const handleCategoryChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Featured Blog Carousel */}
      {publishedBlogs.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Grow in timeout={500}>
            <Paper
              sx={{
                position: 'relative',
                backgroundColor: 'grey.800',
                color: '#fff',
                borderRadius: 2,
                overflow: 'hidden',
                height: '400px',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${publishedBlogs[currentFeaturedIndex].imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'opacity 0.5s ease-in-out',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  backgroundColor: 'rgba(0,0,0,.5)',
                }}
              />
              <Grid container sx={{ height: '100%' }}>
                <Grid item xs={12} md={8}>
                  <Box
                    sx={{
                      position: 'relative',
                      p: { xs: 3, md: 6 },
                      pr: { md: 0 },
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography 
                      component="h1" 
                      variant="h3" 
                      color="inherit" 
                      gutterBottom
                      sx={{
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        fontWeight: 600,
                      }}
                    >
                      {publishedBlogs[currentFeaturedIndex].title}
                    </Typography>
                    <Typography 
                      variant="h5" 
                      color="inherit" 
                      paragraph
                      sx={{
                        fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                        opacity: 0.9,
                        mb: 4,
                      }}
                    >
                      {publishedBlogs[currentFeaturedIndex].summary}
                    </Typography>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate(`/blog/${publishedBlogs[currentFeaturedIndex].id}`)}
                      sx={{
                        width: 'fit-content',
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                        color: 'white',
                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 15px 2px rgba(33, 203, 243, .4)',
                        },
                      }}
                    >
                      Read More
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              {/* Carousel Indicators */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  right: 20,
                  display: 'flex',
                  gap: 1,
                }}
              >
                {publishedBlogs.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: index === currentFeaturedIndex ? 'white' : 'rgba(255,255,255,0.5)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => setCurrentFeaturedIndex(index)}
                  />
                ))}
              </Box>
            </Paper>
          </Grow>
        </Box>
      )}

      {/* Search and Filter */}
      <Box sx={{ mb: 4 }}>
        <TextField
          size="small"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            mb: 2,
            maxWidth: 400,
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: 'background.paper',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
              </InputAdornment>
            ),
          }}
        />
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              minWidth: 'auto',
              px: 2,
            },
          }}
        >
          {categories.map((category) => (
            <Tab
              key={category}
              label={category}
              value={category}
              sx={{ textTransform: 'capitalize' }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Blog Grid */}
      <Grid container spacing={3}>
        {filteredBlogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog.id}>
            <Grow in timeout={500}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                  }
                }}
                onClick={() => navigate(`/blog/${blog.id}`)}
              >
                <CardMedia
                  component="img"
                  image={blog.imageUrl}
                  alt={blog.title}
                  sx={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover'
                  }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', py: 2 }}>
                  <Box sx={{ mb: 1 }}>
                    <Chip
                      label={blog.category}
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                      }}
                    />
                  </Box>
                  <Typography 
                    gutterBottom 
                    variant="h5" 
                    component="h2"
                    sx={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.2,
                    }}
                  >
                    {blog.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 1,
                      fontSize: '0.875rem',
                      lineHeight: 1.4,
                    }}
                  >
                    {blog.summary}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                    {blog.tags.slice(0, 2).map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          borderColor: theme.palette.primary.main,
                          height: 20,
                          '& .MuiChip-label': {
                            fontSize: '0.75rem',
                            px: 1,
                          }
                        }}
                      />
                    ))}
                  </Box>
                  <Box sx={{ mt: 'auto' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ fontSize: '0.75rem' }}
                      >
                        By {blog.author} • {new Date(blog.publishDate).toLocaleDateString()}
                      </Typography>
                      <Box>
                        <IconButton size="small" sx={{ p: 0.5 }}>
                          <BookmarkIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                        <IconButton size="small" sx={{ p: 0.5 }}>
                          <ShareIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem' }} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/blog/${blog.id}`);
                      }}
                      sx={{
                        width: 'fit-content',
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                        color: 'white',
                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                        fontSize: '0.875rem',
                        py: 0.5,
                        px: 1.5,
                      }}
                    >
                      Read More
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Blogs;
