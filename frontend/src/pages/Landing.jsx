import React from 'react';
import { Link } from 'react-router-dom';
import logo from '/socialsync.png';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-palette3 to-palette6 flex flex-col items-center justify-center text-white">
      <img src={logo} alt="SocialSync" className="w-24 h-24 mb-4" />
      <h1 className="text-4xl font-bold mb-2">Welcome to SocialSync 😊</h1>
      <p className="mb-6 text-lg">Plan events, send invites & track RSVPs with ease</p>

      <div className="space-x-3">
        <Link to="/auth" className="bg-white text-primary px-6 py-3 rounded-lg shadow hover:opacity-90">Get Started</Link>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        <Feature title="📅 Create Events" desc="Easily schedule events with date, time & location." />
        <Feature title="📧 Send Invites" desc="Invite guests via email with one click." />
        <Feature title="✅ Track Responses" desc="See who is coming in real time." />
      </div>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="bg-white/10 p-6 rounded-lg shadow text-center">
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className="text-white/80">{desc}</p>
    </div>
  );
}
