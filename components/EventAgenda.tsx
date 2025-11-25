type Props = {
  agendaItems: string[];
};

const EventAgenda = ({ agendaItems }: Props) => {
  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <ul className="list-disc">
        {agendaItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventAgenda;
