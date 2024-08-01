
import NavBar from '../../components/NavBar';
import HeroSection from '../../components/HeroSection';
import EventDetails from '../../components/EventDetails';
import OtherEvents from '../../components/OtherEvents';
import Footer from '../../components/Footer';

export default function HomePage() {
  return (
    <>
      <NavBar />
      <HeroSection />
      <EventDetails />
      <OtherEvents />
      <Footer />
    </>
  );
}
