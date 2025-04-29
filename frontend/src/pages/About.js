import React from 'react';

const About = () => {
  const teamMembers = [
    {
      name: 'Sarah Mutesi',
      role: 'Founder & CEO',
      image: 'https://picsum.photos/200/204',
      bio: 'Passionate about promoting Rwandan art and supporting local artists.',
    },
    {
      name: 'Jean Claude Niyonzima',
      role: 'Art Curator',
      image: 'https://picsum.photos/200/205',
      bio: 'Expert in traditional and contemporary Rwandan art forms.',
    },
    {
      name: 'Grace Uwamahoro',
      role: 'Community Manager',
      image: 'https://picsum.photos/200/206',
      bio: 'Building bridges between artists and art enthusiasts.',
    },
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="bg-brown py-20">
        <div className="section-container">
          <h1 className="text-4xl md:text-5xl font-bold text-cream text-center mb-6">
            About Our Gallery
          </h1>
          <p className="text-cream/90 text-center max-w-2xl mx-auto">
            Dedicated to showcasing and preserving Rwanda's rich artistic heritage
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="section-container py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-brown">Our Mission</h2>
            <p className="text-brown/70 leading-relaxed">
              At Rwandan Art Gallery, we are committed to promoting and preserving the rich artistic heritage of Rwanda. 
              Our platform serves as a bridge between talented local artists and art enthusiasts worldwide, 
              creating opportunities for cultural exchange and artistic growth.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-coral flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brown">Support Local Artists</h3>
                  <p className="text-brown/70">Providing a platform for Rwandan artists to showcase and sell their work</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-coral flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brown">Global Reach</h3>
                  <p className="text-brown/70">Connecting Rwandan art with collectors and enthusiasts worldwide</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img
                src="https://picsum.photos/600/600"
                alt="Gallery"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-coral rounded-lg -z-10"></div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-brown py-16">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-cream text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-brown">{member.name}</h3>
                  <p className="text-coral font-medium mb-3">{member.role}</p>
                  <p className="text-brown/70">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="section-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '200+', label: 'Artists' },
            { number: '1,000+', label: 'Artworks' },
            { number: '50+', label: 'Exhibitions' },
            { number: '10,000+', label: 'Happy Customers' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-coral mb-2">{stat.number}</div>
              <div className="text-brown/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About; 