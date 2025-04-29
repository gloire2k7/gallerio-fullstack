import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[80vh] hero-gradient">
        <div className="absolute inset-0">
          <div className="section-container h-full flex items-center">
            <div className="max-w-2xl animate-fadeIn">
              <h1 className="text-6xl font-bold text-cream mb-6 leading-tight">
                Discover the Beauty of
                <span className="text-coral block mt-2">Rwandan Art</span>
              </h1>
              <p className="text-xl text-cream/90 mb-8 leading-relaxed">
                Explore a curated collection of authentic Rwandan artworks, 
                celebrating our rich cultural heritage and contemporary creativity.
              </p>
              <Link to="/gallery" className="btn-primary inline-flex items-center group">
                Explore Gallery
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-cream">
        <div className="section-container">
          <h2 className="text-4xl text-center mb-16">
            Why Choose <span className="text-coral">Rwandan Art Gallery</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<ArtIcon />}
              title="Authentic Artworks"
              description="Each piece is carefully selected and verified for authenticity, representing true Rwandan craftsmanship."
            />
            <FeatureCard
              icon={<SupportIcon />}
              title="Support Local Artists"
              description="Your purchase directly supports Rwandan artists and helps preserve our cultural heritage."
            />
            <FeatureCard
              icon={<SecurityIcon />}
              title="Secure Transactions"
              description="Shop with confidence knowing your payments are secure and your artwork is protected."
            />
          </div>
        </div>
      </div>

      {/* Featured Artists Section */}
      <div className="py-24 bg-brown">
        <div className="section-container">
          <h2 className="text-4xl text-cream text-center mb-16">
            Featured Artists
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {/* Placeholder for featured artists */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-cream rounded-lg p-6 transform hover:-translate-y-2 transition-transform duration-300">
                <div className="w-full h-48 bg-coral/20 rounded-lg mb-4"></div>
                <h3 className="text-xl mb-2">Artist Name</h3>
                <p className="text-brown/80">Specializes in traditional paintings</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-24 bg-coral">
        <div className="section-container text-center">
          <h2 className="text-4xl text-cream mb-8">
            Ready to Start Your Collection?
          </h2>
          <p className="text-cream/90 mb-12 max-w-2xl mx-auto text-lg">
            Join our community of art enthusiasts and discover unique pieces that tell the story of Rwanda.
          </p>
          <Link
            to="/register"
            className="bg-brown hover:bg-salmon text-cream px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:shadow-xl inline-flex items-center"
          >
            Get Started
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="text-coral mb-6">{icon}</div>
    <h3 className="text-2xl font-semibold text-brown mb-4">{title}</h3>
    <p className="text-brown/80 leading-relaxed">{description}</p>
  </div>
);

// Icons components
const ArtIcon = () => (
  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SupportIcon = () => (
  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const SecurityIcon = () => (
  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default Home; 