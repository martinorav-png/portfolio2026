import './BioPortrait.css';

type Props = {
  imageSrc: string;
  name: string;
  title: string;
  imageAlt: string;
};

/** Plain about portrait (no ProfileCard holo) — used on mobile / coarse pointer. */
export default function BioPortrait({ imageSrc, name, title, imageAlt }: Props) {
  return (
    <figure className="bio-photo bio-photo--simple">
      <div className="bio-portrait">
        <div className="bio-portrait__media">
          <img
            className="bio-portrait__img"
            src={imageSrc}
            alt={imageAlt}
            width={520}
            height={724}
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="bio-portrait__overlay">
          <h3 className="bio-portrait__name">{name}</h3>
          <p className="bio-portrait__role">{title}</p>
        </div>
      </div>
    </figure>
  );
}
