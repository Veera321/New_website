import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import { theme } from './theme';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { SubHeaderProvider } from './context/SubHeaderContext';
import { ImageProvider } from './context/ImageContext';
import { SearchProvider } from './context/SearchContext';
import { CartRequestProvider } from './context/CartRequestContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { BannerProvider } from './context/BannerContext';
import { HealthPackageProvider } from './context/HealthPackageContext';
import { BlogProvider } from './context/BlogContext';
import { DoctorProvider } from './context/DoctorContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { PrivacyPolicyProvider } from './context/PrivacyPolicyContext';
import { AboutProvider } from './context/AboutContext';
import { SocialMediaProvider } from './context/SocialMediaContext';
import { BloodTestProvider } from './context/BloodTestContext';
import { HomeCollectionProvider } from './context/HomeCollectionContext';
import emailjs from '@emailjs/browser';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import SubHeaderManager from './pages/admin/SubHeaderManager';
import CartRequests from './pages/admin/CartRequests';
import BannerManager from './pages/admin/BannerManager';
import BloodTestManager from './pages/admin/BloodTestManager';
import HealthPackageManager from './pages/admin/HealthPackageManager';
import BlogManager from './pages/admin/BlogManager';
import DoctorManager from './pages/admin/DoctorManager';
import AppointmentManager from './pages/admin/AppointmentManager';
import PrivacyPolicyManager from './pages/admin/PrivacyPolicyManager';
import AboutManager from './pages/admin/AboutManager';
import SocialMediaManager from './pages/admin/SocialMediaManager';
import HomeCollectionRequests from './pages/admin/HomeCollectionRequests';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import Navbar from './components/Navbar';
import SubHeader from './components/SubHeader';
import Home from './pages/Home';
import TestDetails from './pages/TestDetails';
import PackageDetails from './pages/PackageDetails';
import HomeCollection from './pages/HomeCollection';
import RiskTests from './pages/RiskTests';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Footer from './components/Footer';
import BloodTestDetails from './pages/BloodTestDetails';
import SpecialtyTestDetails from './pages/SpecialtyTestDetails';
import Blogs from './pages/Blogs';
import BlogPost from './pages/BlogPost';
import DoctorConsultation from './pages/DoctorConsultation';
import About from './pages/About';

// Initialize EmailJS
emailjs.init('pCruUNl_sOjz6Zalq'); // Replace with your actual public key

const MainLayout = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  '& > main': {
    flexGrow: 1,
    paddingTop: '120px',
  },
}));

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <CartProvider>
              <BlogProvider>
                <BloodTestProvider>
                  <SubHeaderProvider>
                    <BannerProvider>
                      <HealthPackageProvider>
                        <DoctorProvider>
                          <SocialMediaProvider>
                            <ImageProvider>
                              <SearchProvider>
                                <CartRequestProvider>
                                  <AppointmentProvider>
                                    <PrivacyPolicyProvider>
                                      <AboutProvider>
                                        <HomeCollectionProvider>
                                          <Routes>
                                            {/* Admin Routes */}
                                            <Route path="/admin/login" element={<AdminLogin />} />
                                            <Route
                                              path="/admin/*"
                                              element={
                                                <AdminProtectedRoute>
                                                  <AdminLayout>
                                                    <Routes>
                                                      <Route index element={<AdminDashboard />} />
                                                      <Route path="dashboard" element={<AdminDashboard />} />
                                                      <Route path="banners" element={<BannerManager />} />
                                                      <Route path="cart-requests" element={<CartRequests />} />
                                                      <Route path="home-collection" element={<HomeCollectionRequests />} />
                                                      <Route path="subheader" element={<SubHeaderManager />} />
                                                      <Route path="blood-test" element={<BloodTestManager />} />
                                                      <Route path="health-packages" element={<HealthPackageManager />} />
                                                      <Route path="blog" element={<BlogManager />} />
                                                      <Route path="doctors" element={<DoctorManager />} />
                                                      <Route path="appointments" element={<AppointmentManager />} />
                                                      <Route path="privacy-policy" element={<PrivacyPolicyManager />} />
                                                      <Route path="about" element={<AboutManager />} />
                                                      <Route path="social-media" element={<SocialMediaManager />} />
                                                    </Routes>
                                                  </AdminLayout>
                                                </AdminProtectedRoute>
                                              }
                                            />

                                            {/* Public Routes */}
                                            <Route
                                              path="/*"
                                              element={
                                                <MainLayout>
                                                  <Navbar />
                                                  <SubHeader />
                                                  <main>
                                                    <Routes>
                                                      <Route index element={<Home />} />
                                                      <Route path="test/:testId" element={<TestDetails />} />
                                                      <Route path="package/:packageId" element={<PackageDetails />} />
                                                      <Route path="blood-test/:testId" element={<BloodTestDetails />} />
                                                      <Route path="specialty-test/:testId" element={<SpecialtyTestDetails />} />
                                                      <Route path="home-collection" element={<HomeCollection />} />
                                                      <Route path="risk-tests/:riskCategory" element={<RiskTests />} />
                                                      <Route path="terms" element={<TermsAndConditions />} />
                                                      <Route path="privacy-policy" element={<PrivacyPolicy />} />
                                                      <Route path="about" element={<About />} />
                                                      <Route path="blogs" element={<Blogs />} />
                                                      <Route path="blog/:id" element={<BlogPost />} />
                                                      <Route path="doctors" element={<DoctorConsultation />} />
                                                    </Routes>
                                                  </main>
                                                  <Footer />
                                                </MainLayout>
                                              }
                                            />
                                          </Routes>
                                        </HomeCollectionProvider>
                                      </AboutProvider>
                                    </PrivacyPolicyProvider>
                                  </AppointmentProvider>
                                </CartRequestProvider>
                              </SearchProvider>
                            </ImageProvider>
                          </SocialMediaProvider>
                        </DoctorProvider>
                      </HealthPackageProvider>
                    </BannerProvider>
                  </SubHeaderProvider>
                </BloodTestProvider>
              </BlogProvider>
            </CartProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
