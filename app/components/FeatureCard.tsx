type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
};

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="feature-card">
    <div className="feature-card-icon">
      <img src={icon} alt="" className="size-5" />
    </div>
    <h3 className="feature-card-title">{title}</h3>
    <p className="feature-card-desc">{description}</p>
  </div>
);

export default FeatureCard;
