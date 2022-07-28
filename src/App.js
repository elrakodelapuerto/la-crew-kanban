import "./styles.css";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";

const data = [
  {
    title: "Готов",
    searchers: [2000005, 2000006],
    crews: [0, 1]
  },
  {
    title: "В пути",
    searchers: [],
    crews: [2]
  },
  {
    title: "На месте",
    searchers: [],
    crews: []
  },
  {
    title: "Возвращается",
    searchers: [],
    crews: []
  },
  {
    title: "Дома",
    searchers: [],
    crews: []
  }
];

const crewsData = [[2000001, 2000002], [2000003], [2000004]];

const searchersData = [
  {
    id: 2000001,
    callSign: "Харон",
    isPilot: true,
    seats: 3,
    phone: 9049418231,
    address: "ЧТЗ, октябрьская 3",
    time: "20:00"
  },
  {
    id: 2000002,
    callSign: "Росо",
    isPilot: false,
    seats: 0,
    phone: 9049418231,
    address: "ЧТЗ, октябрьская 3",
    time: "20:00"
  },
  {
    id: 2000003,
    callSign: "Зи",
    isPilot: true,
    seats: 4,
    phone: 9049418231,
    address: "ЧТЗ, октябрьская 3",
    time: "20:00"
  },
  {
    id: 2000004,
    callSign: "Клевер",
    isPilot: true,
    seats: 2,
    phone: 9049418231,
    address: "ЧТЗ, октябрьская 3",
    time: "20:00"
  },
  {
    id: 2000005,
    callSign: "Якут",
    isPilot: false,
    seats: 0,
    phone: 9049418231,
    address: "ЧТЗ, октябрьская 3",
    time: "20:00"
  },
  {
    id: 2000006,
    callSign: "Скитлс",
    isPilot: false,
    seats: 0,
    phone: 9049418231,
    address: "ЧТЗ, октябрьская 3",
    time: "20:00"
  }
];

export default function App() {
  const [state, setState] = useState(data);
  const [searchers, setSearchers] = useState(searchersData);
  const [crews, setCrews] = useState(crewsData);

  const Searcher = ({ searcherId }) => {
    const { callSign, phone, address, isPilot, seats, time } = searchers.find(
      (o) => o.id === searcherId
    );
    return (
      <div className="searcher">
        <div className="searcherHeader">
          <span>{callSign}</span>
          {isPilot && (
            <span className="material-symbols-rounded isPilot">
              directions_car
            </span>
          )}
        </div>
        <div className="searcherBody">
          <div>+7{phone}</div>
          <div>
            {address}, в {time}
          </div>
        </div>
      </div>
    );
  };

  const Crew = ({ crewId }) => {
    const crew = crews[crewId];
    return (
      <div className="crew">
        <div className="crewTitle">Экипаж #{crewId + 1}</div>
        <div className="crewBody">
          {crew &&
            crew.map((searcherId) => <Searcher searcherId={searcherId} />)}
        </div>
      </div>
    );
  };
  const AddSearcher = () => {
    return <div className="addSearcher">Добавить поисковика</div>;
  };
  const AddCrew = () => {
    return <div className="addCrew">Добавить экипаж</div>;
  };

  const onDragUpdate = (result) => {
    console.log(result);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (result.combine) {
      if (+result.draggableId <= 2000000) return;
      const from = +source.droppableId;
      const to = +result.combine.draggableId;

      const cloneSource = [
        ...state[from]["searchers"],
        ...state[from]["crews"]
      ];
      const cloneCrew = [...crews[to]];
      const [removed] = cloneSource.splice(source.index, 1);
      cloneCrew.push(removed);
      const newState = [...state];
      const newCrews = [...crews];
      newState[from]["searchers"] = cloneSource.filter((o) => o >= 2000000);
      newCrews[to] = cloneCrew;
      setState(newState);
      setCrews(newCrews);
      return;
    }
    if (!destination) return;

    const from = +source.droppableId;
    const to = +destination.droppableId;

    if (from === to) return;

    const cloneSource = [...state[from]["searchers"], ...state[from]["crews"]];
    const cloneDest = [...state[to]["searchers"], ...state[to]["crews"]];
    const [removed] = cloneSource.splice(source.index, 1);
    cloneDest.splice(destination.index, 0, removed);

    const newState = [...state];
    newState[from]["searchers"] = cloneSource.filter((o) => o >= 2000000);
    newState[from]["crews"] = cloneSource.filter((o) => o < 2000000);
    newState[to]["searchers"] = cloneDest
      .filter((o) => o >= 2000000)
      .sort((a, b) => a - b);
    newState[to]["crews"] = cloneDest
      .filter((o) => o < 2000000)
      .sort((a, b) => a - b);

    setState(newState);
  };

  return (
    <div className="container">
      <div className="content">
        <DragDropContext onDragEnd={onDragEnd}>
          {state.map(({ title, searchers, crews }, index) => (
            <Droppable key={index} droppableId={`${index}`} isCombineEnabled>
              {(provided) => (
                <div
                  className="statusColumn"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="statusTitle">
                    <div>{title}</div>
                    {index === 0 && (
                      <div className="statusButtons">
                        <span className="material-symbols-rounded">
                          group_add
                        </span>
                        <span className="material-symbols-rounded">
                          person_add
                        </span>
                      </div>
                    )}
                  </div>

                  {[...searchers, ...crews].map((item, index) => (
                    <Draggable key={item} draggableId={`${item}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="item"
                        >
                          <div
                            className="itemHandle"
                            {...provided.dragHandleProps}
                          >
                            <span class="material-symbols-rounded">
                              drag_handle
                            </span>
                          </div>
                          {item >= 2000000 ? (
                            <Searcher searcherId={item} />
                          ) : (
                            <Crew crewId={item} />
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}
