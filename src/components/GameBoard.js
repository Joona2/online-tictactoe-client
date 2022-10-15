import { ButtonGroup } from "reactstrap";

const GameBoard = ({ sendMessage, gameboard }) => {
  const renderGameboard = () => {
    const rows = [];
    for (let row = 0; row < 3; row++) {
      rows.push(<ButtonGroup>{renderRow(row)}</ButtonGroup>);
    }
    return rows;
  };

  const renderRow = (rowIndex) => {
    const row = rowIndex;
    const res = [];
    for (let col = 0; col < 3; col++) {
      res.push(
        <button
          className="boardButton"
          onClick={() => sendMessage({ move: { row: rowIndex, col: col } })}
        >
          {gameboard[row][col]}
        </button>
      );
    }
    return res;
  };

  return (
    <div className="gameBoard">
      <ButtonGroup className="gameBoardBoard" vertical>
        {renderGameboard()}
      </ButtonGroup>
    </div>
  );
};

export default GameBoard;
