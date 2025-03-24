interface PlayerCardProps {
  className?: string;
  name: string;
  data?: {
    avatar: string;
  };
}
export default function PlayerCard({ className, name, data }: PlayerCardProps) {
  return (
    <div
      style={{
        backgroundImage: `url("https://static.vecteezy.com/system/resources/previews/010/790/729/non_2x/abstract-background-dark-blue-with-modern-concept-vector.jpg")`,
      }}
      className={`md:h-[30vh] md:w-[14vw] h-[10em] w-[10em] bg-white rounded-xl flex justify-center items-center bg-cover bg-center border border-white shadow-xl relative overflow-hidden ${className}`}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.3)] to-[rgba(0,0,0,0.8)] rounded-xl"></div>

      {/* Avatar Container */}
      <div
        style={{
          backgroundImage: `url("${
            data?.avatar ||
            "https://images.pexels.com/photos/5986316/pexels-photo-5986316.jpeg?auto=compress&cs=tinysrgb&w=1200"
          }")`,
        }}
        className="relative w-full h-full bg-cover bg-no-repeat bg-center rounded-xl flex justify-end items-end shadow-lg"
      >
        {/* Name Tag */}
        <div className="absolute bottom-0 w-full h-14 bg-[rgba(255,255,255,0.15)] backdrop-blur-md rounded-b-xl flex justify-center items-center uppercase text-white font-bold text-lg shadow-md">
          <div className="">{name}</div>
        </div>

        {/* Badge */}
        <div
          style={{
            backgroundImage: `url("https://support-leagueoflegends.riotgames.com/hc/article_attachments/36727007523091")`,
          }}
          className="absolute top-1 right-1 h-12 w-12 rounded-lg bg-cover bg-center shadow-lg"
        ></div>
      </div>
    </div>
  );
}
