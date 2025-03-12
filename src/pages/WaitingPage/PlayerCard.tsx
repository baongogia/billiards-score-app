interface PlayerCardProps {
  className?: string;
  name: string;
}
export default function PlayerCard({ className, name }: PlayerCardProps) {
  return (
    <div
      style={{
        backgroundImage: `url("https://static.vecteezy.com/system/resources/previews/010/790/729/non_2x/abstract-background-dark-blue-with-modern-concept-vector.jpg")`,
      }}
      className={`h-[30vh] w-[14vw] bg-white rounded-xl flex justify-center items-center bg-cover bg-center border border-white shadow-xl relative overflow-hidden ${className}`}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.3)] to-[rgba(0,0,0,0.8)] rounded-xl"></div>

      {/* Avatar Container */}
      <div
        style={{
          backgroundImage: `url("https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474094aUF/anh-dep-doremon_033145831.png")`,
        }}
        className="relative w-full h-full bg-contain bg-no-repeat bg-center rounded-xl flex justify-end items-end shadow-lg"
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
