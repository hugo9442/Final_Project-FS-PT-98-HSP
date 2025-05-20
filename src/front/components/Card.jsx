
const Card = ({ image, text, text2, alt = "imagen" }) => {
  return (
    <div className="card mx-auto mb-5" style={{ width: "18rem" }}>
      <img src={image} className="card-img-top" alt={alt} />
      <div className="card-body">
        <p className="card-text" style={{
          color: 'black',
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>{text}</p>
        <p className="card-text">{text2}</p>
      </div>
    </div>
  );
};

export default Card;
