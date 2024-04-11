import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";

interface SocialLink {
  id: number;
  icon: JSX.Element; // Modifica necessaria: specifica che icon è un elemento JSX
  url: string;
}

const socialLinks: SocialLink[] = [
  {
    id: 1,
    icon: <FiGithub />,
    url: "https://github.com/boobaGreen",
  },
  {
    id: 2,
    icon: <FiTwitter />,
    url: "https://twitter.com/claudiodal8444",
  },
  {
    id: 3,
    icon: <FiLinkedin />,
    url: "https://www.linkedin.com/in/claudio-dall-ara-730aa0302/",
  },
];

function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full h-auto">
      <div className="flex flex-col justify-center content-center  ">
        <div className="w-auto flex  justify-center">
          <ul className="flex gap-2 sm:gap-4">
            {socialLinks.map((link) => (
              <a
                href={link.url}
                target="__blank"
                key={link.id}
                className="cursor-pointer rounded-lg shadow-sm p-2 duration-300 "
              >
                <i className="sm:text-lg md:text-xl">{link.icon}</i>
              </a>
            ))}
          </ul>
        </div>
        <div className="w-auto flex  justify-center ">
          <p className="text-sm sm:text-base md:text-xl s mt-4">
            © {currentYear} Copyright Dall'Ara Claudio
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
