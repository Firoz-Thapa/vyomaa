import './Testimonials.css';

const TESTIMONIALS = [
  {
    quote: "SkyGrid has revolutionized our satellite operations. The real-time tracking and accurate pass predictions have saved us countless hours.",
    author: "Dr. Sarah Chen",
    title: "Lead Engineer, SpaceTech Labs",
    avatar: "SC"
  },
  {
    quote: "As a researcher, having access to comprehensive orbital data has been invaluable for my studies. The API is robust and the dashboard is intuitive.",
    author: "Prof. Michael Rodriguez",
    title: "Aerospace Researcher, University of Aeronautics",
    avatar: "MR"
  },
  {
    quote: "The email alerts feature keeps us informed about critical satellite passes. SkyGrid's reliability is unmatched in the industry.",
    author: "Emma Thompson",
    title: "Operations Manager, Global Satellites Inc.",
    avatar: "ET"
  }
];

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="testimonials-inner">
        <div className="section-tag">Testimonials</div>
        <h2 className="section-title">Trusted by Space Professionals</h2>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="testimonial-quote">"{testimonial.quote}"</div>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.avatar}</div>
                <div className="author-info">
                  <div className="author-name">{testimonial.author}</div>
                  <div className="author-title">{testimonial.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}