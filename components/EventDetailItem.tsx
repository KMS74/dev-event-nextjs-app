import Image from "next/image";

type Props = {
  icon: string;
  alt: string;
  label: string;
};

const EventDetailItem = ({ icon, alt, label }: Props) => {
  return (
    <div className="flex-row-gap-2 items-center">
      <Image src={icon} alt={alt} width={18} height={18} />
      <p>{label}</p>
    </div>
  );
};

export default EventDetailItem;
