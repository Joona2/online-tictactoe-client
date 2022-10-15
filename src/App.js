import GameBoard from "./components/GameBoard";
import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";

function App() {
  const socket = useRef(
    io.connect("https://tictactoe-online-server.herokuapp.com/")
  );
  const [queueStarted, setQueueStarted] = useState(false);
  const [gameOverWin, setGameOverWin] = useState(false);
  const [gameOverLoss, setGameOverLoss] = useState(false);
  const [gameOverDraw, setGameOverDraw] = useState(false);
  const [gameOverDC, setGameOverDC] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [yourTurn, setYourTurn] = useState(null);
  const [connectedPlayers, setConnectedPlayers] = useState(0);
  const [gameboard, setGameboard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  const joinRoom = () => {
    setQueueStarted(true);
    setGameOverWin(false);
    setGameOverLoss(false);
    setGameOverDraw(false);
    setGameOverDC(false);
    setYourTurn(null);
    socket.emit("join_room");
    setGameboard([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
  };

  const sendMessage = (data) => {
    socket.emit("send_message", data);
  };

  useEffect(() => {
    socket.on("receive_message", (gameboard) => {
      setGameboard(gameboard);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("game_over", (typeGameOver) => {
      setYourTurn(null);
      if (typeGameOver === "dc") {
        setGameOverDC(true);
      } else if (typeGameOver === "draw") {
        setGameOverDraw(true);
      } else if (typeGameOver === socket.id) {
        setGameOverWin(true);
      } else {
        setGameOverLoss(true);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on("match_found", () => {
      setQueueStarted(false);
      setMatchFound(true);
      setTimeout(() => setMatchFound(false), 4000);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("your_turn", (userID) => {
      if (userID === socket.id) {
        setYourTurn(true);
      } else {
        setYourTurn(false);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on("connected_player", (numConnectedPlayers) => {
      setConnectedPlayers(numConnectedPlayers);
    });
  }, [socket]);

  return (
    <div className="App">
      <header className="titleTicTacToe">TicTacToe</header>
      <div className="matchmaking">
        <button className="matchmakingButton" onClick={joinRoom}>
          {" "}
          Find New Match
        </button>
      </div>
      {queueStarted && <h1 className="actionText">In Queue...</h1>}
      {matchFound && <h1 className="matchFoundText">Match Found</h1>}
      {yourTurn !== null && yourTurn && (
        <h1 className="actionText">Your Turn!</h1>
      )}
      {yourTurn !== null && !yourTurn && (
        <h1 className="actionText">Opponent's Turn!</h1>
      )}

      {gameOverWin && <h1 className="actionText">Game Over! You Win!</h1>}
      {gameOverDraw && <h1 className="actionText">Game Over! Draw!</h1>}
      {gameOverLoss && (
        <h1 className="actionText">Game Over! Opponent Wins!</h1>
      )}
      {gameOverDC && (
        <h1 className="actionText">
          Game Over! Opponent Disconnected! You Win!
        </h1>
      )}
      <GameBoard gameboard={gameboard} sendMessage={sendMessage}></GameBoard>
      <h1 className="connectedPlayers">
        Current Players Online: {connectedPlayers}
      </h1>
    </div>
  );
}

export default App;
