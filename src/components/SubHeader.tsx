import React, { useState, useCallback, MouseEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Menu,
  MenuItem,
  styled,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Toolbar,
  Collapse,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import UploadIcon from '@mui/icons-material/Upload';
import PrescriptionUploadDialog from './PrescriptionUploadDialog';
import HomeCollectionDialog from './HomeCollectionDialog';
import { useSubHeader } from '../context/SubHeaderContext';
import { useHealthPackage } from '../context/HealthPackageContext';
import { useBloodTest } from '../context/BloodTestContext';
import { specialtyTests, SpecialtyTest } from './SpecialtyTests';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: '48px !important',
  padding: theme.spacing(0, 2),
  justifyContent: 'space-between',
  backgroundColor: '#28757A',
  '& .MuiButton-root': {
    color: '#fff',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  '& .MuiSvgIcon-root': {
    color: '#fff',
  },
  maxWidth: theme.breakpoints.values.xl,
  margin: '0 auto',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    minHeight: '40px !important',
    padding: theme.spacing(0, 1),
  },
}));

const MenuContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginLeft: theme.spacing(2),
  '& .MuiButton-root': {
    color: '#fff',
    fontSize: '0.9rem',
    padding: '6px 12px',
    minWidth: 'auto',
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: theme.spacing(1),
  },
}));

const MenuButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  textTransform: 'none',
  padding: theme.spacing(0.5, 1.5),
  minHeight: '32px',
  '& .MuiButton-endIcon': {
    marginLeft: 2,
    transition: 'transform 0.2s ease',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.25, 1),
    minHeight: '28px',
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    marginTop: '2px',
    minWidth: 220,
    boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(0,0,0,0.08)',
  },
  '& .MuiList-root': {
    padding: theme.spacing(1, 0),
  },
  '& .MuiMenuItem-root': {
    minHeight: '44px',
    fontSize: '0.875rem',
    padding: theme.spacing(1, 2),
    margin: theme.spacing(0, 0.5),
    borderRadius: '4px',
    color: '#3F1E43',
    '&:hover': {
      backgroundColor: 'rgba(63, 30, 67, 0.04)',
    },
  },
}));

const DrawerContent = styled(Box)(({ theme }) => ({
  width: 250,
  paddingTop: theme.spacing(1),
}));

const StyledListItemButton = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface SubMenuOption {
  text: string;
  items?: string[];
}

const SubHeader: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { options } = useSubHeader();
  const { packages } = useHealthPackage();
  const { tests: bloodTests } = useBloodTest();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<boolean[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [homeCollectionOpen, setHomeCollectionOpen] = useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (event: MouseEvent<HTMLElement>, index: number) => {
    const option = options[index];
    if (option.text === 'Doctor Consultation') {
      navigate('/doctors');
      return;
    }
    setAnchorEl(event.currentTarget);
    setSelectedOption(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedOption(null);
  };

  const handleItemClick = (item: string, option: string) => {
    handleClose();
    if (option === 'Health Packages') {
      const packageData = packages.find((pkg: { name: string; id: number }) => pkg.name === item);
      if (packageData) {
        navigate(`/package/${packageData.id}`);
      }
    } else if (option === 'Health Risk') {
      navigate(`/risk-tests/${item}`);
    } else if (option === 'Blood Tests') {
      const testData = bloodTests.find((test) => test.name === item && test.published);
      if (testData) {
        navigate(`/blood-test/${testData.id}`);
      }
    } else if (option === 'Specialty Tests') {
      const testData = specialtyTests.find((test: SpecialtyTest) => test.name === item);
      if (testData) {
        navigate(`/specialty-test/${testData.id}`);
      }
    } else if (option === 'Doctor Consultation') {
      navigate(`/doctors?specialty=${encodeURIComponent(item)}`);
    } else if (option === 'Blogs') {
      navigate('/blogs');
    }
  };

  const handleMobileItemClick = (option: SubMenuOption) => {
    if (option.text === 'Doctor Consultation') {
      navigate('/doctors');
      setMobileMenuOpen(false);
      return;
    }
    toggleExpanded(options.indexOf(option));
  };

  const toggleMobileMenu = useCallback((open: boolean) => {
    setMobileMenuOpen(open);
  }, []);

  const toggleExpanded = useCallback((index: number) => {
    setOpenSubMenus(prev => {
      const newOpenSubMenus = [...prev];
      newOpenSubMenus[index] = !Boolean(newOpenSubMenus[index]);
      return newOpenSubMenus;
    });
  }, []);

  const handleHomeCollection = () => {
    setHomeCollectionOpen(true);
  };

  const renderDesktopMenu = () => (
    <>
      {options.map((option, index) => (
        <Box key={option.text} sx={{ position: 'relative' }}>
          <Tooltip title={option.items ? 'Click to see more options' : ''}>
            <MenuButton
              onClick={(e) => {
                if (option.items) {
                  handleClick(e, index);
                } else if (option.text === 'Doctor Consultation') {
                  navigate('/doctors');
                }
              }}
              endIcon={option.items && <KeyboardArrowDownIcon 
                sx={{ 
                  transform: Boolean(anchorEl) && selectedOption === index ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
              />}
            >
              {option.text}
            </MenuButton>
          </Tooltip>
          {option.items && (
            <StyledMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl) && selectedOption === index}
              onClose={() => handleClose()}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              slotProps={{
                paper: {
                  sx: {
                    mt: '2px',
                    '& .MuiList-root': {
                      py: 0.5,
                    },
                  },
                },
              }}
              disableScrollLock
            >
              {option.items.map((item) => (
                <MenuItem 
                  key={item}
                  onClick={() => handleItemClick(item, option.text)}
                >
                  {item}
                </MenuItem>
              ))}
            </StyledMenu>
          )}
        </Box>
      ))}
      <Button
        onClick={handleHomeCollection}
      >
        Home Collection
      </Button>
    </>
  );

  const renderMobileMenu = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => toggleMobileMenu(false)}
      ModalProps={{
        disableScrollLock: true,
        keepMounted: true,
      }}
    >
      <DrawerContent>
        <List component="nav" disablePadding>
          {options.map((option, index) => (
            <React.Fragment key={option.text}>
              <StyledListItemButton
                onClick={() => {
                  if (option.items) {
                    toggleExpanded(index);
                  } else if (option.text === 'Doctor Consultation') {
                    navigate('/doctors');
                    toggleMobileMenu(false);
                  }
                }}
              >
                <ListItemText 
                  primary={option.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                  }}
                />
                {option.items && (
                  openSubMenus[index] ? <ExpandLess /> : <ExpandMore />
                )}
              </StyledListItemButton>
              {option.items && (
                <Collapse in={openSubMenus[index]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {option.items.map((item) => (
                      <StyledListItemButton
                        key={item}
                        sx={{ pl: 4 }}
                        onClick={() => {
                          if (option.text === 'Health Packages') {
                            const packageData = packages.find((pkg: { name: string; id: number }) => pkg.name === item);
                            if (packageData) {
                              navigate(`/package/${packageData.id}`);
                            }
                          } else if (option.text === 'Health Risk') {
                            navigate(`/risk-tests/${item}`);
                          } else if (option.text === 'Blood Tests') {
                            const testData = bloodTests.find((test) => test.name === item && test.published);
                            if (testData) {
                              navigate(`/blood-test/${testData.id}`);
                            }
                          } else if (option.text === 'Specialty Tests') {
                            const testData = specialtyTests.find((test: SpecialtyTest) => test.name === item);
                            if (testData) {
                              navigate(`/specialty-test/${testData.id}`);
                            }
                          } else if (option.text === 'Doctor Consultation') {
                            navigate(`/doctors?specialty=${encodeURIComponent(item)}`);
                          } else if (option.text === 'Blogs') {
                            navigate('/blogs');
                          }
                          toggleMobileMenu(false);
                        }}
                      >
                        <ListItemText 
                          primary={item}
                          primaryTypographyProps={{
                            fontSize: '0.875rem',
                          }}
                        />
                      </StyledListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
          <StyledListItemButton
            onClick={handleHomeCollection}
          >
            <ListItemText 
              primary={'Home Collection'}
              primaryTypographyProps={{
                fontSize: '0.875rem',
              }}
            />
          </StyledListItemButton>
        </List>
      </DrawerContent>
    </Drawer>
  );

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        top: scrolled ? 0 : 64,
        backgroundColor: '#28757A',
        boxShadow: scrolled ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
        borderTop: scrolled ? 'none' : '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.3s ease-in-out',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transform: scrolled ? 'translateY(0)' : 'none',
        '& .MuiListItemText-root': {
          color: '#fff',
        },
        '& .MuiListItemButton-root': {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
        [theme.breakpoints.down('sm')]: {
          top: scrolled ? 0 : 56,
        },
      }}
    >
      <Toolbar 
        sx={{ 
          justifyContent: 'space-between',
          minHeight: '40px !important',
          padding: '0 16px',
          '& .MuiButton-root': {
            padding: '4px 12px',
          },
          '& .MuiListItem-root': {
            padding: '0 4px',
          },
          '& .MuiListItemButton-root': {
            padding: '4px 8px',
          },
        }}
      >
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              onClick={() => toggleMobileMenu(true)}
            >
              <MenuIcon />
            </IconButton>
            <Button
              color="inherit"
              startIcon={<UploadIcon />}
              onClick={() => setUploadDialogOpen(true)}
            >
              Upload
            </Button>
          </>
        ) : (
          <>
            <MenuContainer>
              {renderDesktopMenu()}
            </MenuContainer>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<UploadIcon />}
                onClick={() => setUploadDialogOpen(true)}
                sx={{
                  color: '#fff',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Upload
              </Button>
            </Box>
          </>
        )}
      </Toolbar>

      {isMobile && renderMobileMenu()}

      <PrescriptionUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
      />

      <HomeCollectionDialog
        open={homeCollectionOpen}
        onClose={() => setHomeCollectionOpen(false)}
      />
    </AppBar>
  );
};

export default SubHeader;
