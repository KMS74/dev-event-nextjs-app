type Props = {
  tags: string[];
};

const EventTags = ({ tags }: Props) => {
  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag) => (
        <span className="pill" key={tag}>
          {tag}
        </span>
      ))}
    </div>
  );
};

export default EventTags;
