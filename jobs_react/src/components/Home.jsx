import React from "react";

function Home() {
    return (
        <div className = "home-container">
            <section className ="hero">
                <img src ="../assets/logo.svg" alt="Logo" className="logo" /> {/* Logo */}
                <h1 className="hero-title">TriPowers LLC</h1>
                <h1>Welcome to TriPowers LLC</h1>
                <p>
                    Your one-stop solution for all your business needs. We specialize in providing top-notch services to help you grow and succeed in today's competitive market.</p>
                <img src ="../assets/ChatGPT Image 1.png" alt="Office" className="heroPhoto" /> {/* Hero */} 
                <br />
                <a href="#contact" className ="cta-btn">Contact Us</a>
                           
            </section>
            <section className="services">
            <h2>Our Capabilities</h2>
            <ul>
                <li>Design and develop secure, scalable web applications tailored to client missions</li>
                <li>Build responsive, user-friendly websites that deliver real impact</li>
                <li>Create custom dashboards and data-driven platforms to support decision-making</li>
                <li>Integrate systems, APIs, and databases for seamless user and backend experiences</li>
                <li>Deliver cloud-ready, future-proof solutions based on client needs and environments</li>
                <li>Support federal compliance standards including accessibility and security</li>
            </ul>
            </section>
        </div>
    )
}

export default Home;